# MindEase - AI Mental Wellness Companion

MindEase is a comprehensive mental wellness tracking application featuring mood logging, stress visualization, and an AI-powered empathetic assistant.

## Features

- **Mood & Stress Logging**: Track daily emotions and stress levels with notes.
- **Interactive Dashboard**: Visualize trends with Charts.js (Recharts) and track daily wellness goals.
- **AI Chat Buddy**: Empathetic conversational AI powered by Google Gemini.
- **Wellness Insights**: Personalized tips generated based on your mood history.
- **Local Data Privacy**: All data is stored locally in your browser.

## Prerequisites

- Node.js (v16 or higher)
- npm (or yarn/pnpm)
- A Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com/))

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory (copy from `.env.example`):
    ```bash
    cp .env.example .env
    ```
    Open `.env` and add your Gemini API Key:
    ```env
    VITE_API_KEY=your_actual_api_key_here
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open your browser to the URL shown (usually `http://localhost:5173`).

## Project Structure

- `src/`
  - `components/`: React UI components (Dashboard, Chat, etc.)
  - `services/`: API integration (Gemini) and Storage logic.
  - `types.ts`: TypeScript definitions.
  - `constants.ts`: Static data and configuration.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS (via CDN for portability)
- **Charts**: Recharts
- **AI**: Google Gemini API (`@google/genai`)
- **Storage**: Browser LocalStorage

## Customization

- **Styling**: Tailwind classes are used directly in components.
- **AI Prompts**: Modify `services/geminiService.ts` to change the system instructions for the Chat Buddy or Wellness Advisor.
