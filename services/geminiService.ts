import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, WellnessTip } from '../types';

// Access API Key from Vite environment variables or fallback to process.env
// Note: In Vite, env vars must start with VITE_ to be exposed on import.meta.env
const API_KEY = import.meta.env.VITE_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("Missing API Key. AI features will not function correctly.");
}

// Initialize the client.
const ai = new GoogleGenAI({ apiKey: API_KEY || 'dummy-key' });

const SYSTEM_INSTRUCTION_CHAT = `
You are MindEase, an empathetic, non-clinical AI mental wellness companion. 
Your goal is to provide supportive, non-judgmental conversation.
- Keep responses concise (under 3 sentences unless asked for more).
- Validate the user's feelings.
- If a user expresses severe distress or self-harm, gently urge them to seek professional help immediately.
- Do not diagnose medical conditions.
`;

const SYSTEM_INSTRUCTION_ADVISOR = `
You are an expert wellness data analyst. 
Analyze the provided mood and stress logs.
Identify trends and generate 3 specific, actionable, low-effort tips to improve the user's well-being.
Output strictly JSON.
`;

export const chatWithBuddy = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
      },
      history: history,
    });

    const response = await chat.sendMessageStream({ message });
    return response;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

export const generateWellnessInsights = async (logs: LogEntry[]): Promise<WellnessTip[]> => {
  try {
    // Take the last 10 logs for analysis to keep prompt size manageable and relevant
    const recentLogs = logs.slice(0, 10);
    const prompt = `Here are my recent mental wellness logs: ${JSON.stringify(recentLogs)}. Based on these, generate 3 personalized wellness tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ADVISOR,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING, description: "A single emoji representing the tip" }
            },
            required: ["title", "description", "icon"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as WellnessTip[];
  } catch (error) {
    console.error("Insight Generation Error:", error);
    // Fallback tips in case of API failure
    return [
      { title: "Connection Error", description: "We couldn't reach the AI advisor. Try deep breathing for now.", icon: "🔌" },
    ];
  }
};