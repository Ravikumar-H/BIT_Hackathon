export type MoodType = 'Happy' | 'Calm' | 'Neutral' | 'Anxious' | 'Sad' | 'Angry';

export interface User {
  username: string;
  isLoggedIn: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string; // ISO String
  mood: MoodType;
  stressLevel: number; // 1-10
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface WellnessTip {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
}

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  LOG_ENTRY = 'LOG_ENTRY',
  CHAT = 'CHAT',
  INSIGHTS = 'INSIGHTS'
}