import { MoodType, DailyTask } from './types';

export const MOODS: { type: MoodType; emoji: string; color: string }[] = [
  { type: 'Happy', emoji: '😊', color: 'text-yellow-400' },
  { type: 'Calm', emoji: '😌', color: 'text-teal-400' },
  { type: 'Neutral', emoji: '😐', color: 'text-gray-400' },
  { type: 'Sad', emoji: '😔', color: 'text-blue-400' },
  { type: 'Anxious', emoji: '😰', color: 'text-purple-400' },
  { type: 'Angry', emoji: '😠', color: 'text-red-400' },
];

export const INITIAL_TIPS = [
  { 
    title: "Deep Breathing", 
    description: "Take 5 deep breaths, holding for 3 seconds each.", 
    icon: "🌬️",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
  },
  { 
    title: "Hydrate", 
    description: "Drink a glass of water to refresh your body and mind.", 
    icon: "💧", 
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80"
  },
  { 
    title: "Step Away", 
    description: "Take a 5-minute break from your current screen or task.", 
    icon: "🚶",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80"
  }
];

export const CALMING_IMAGES = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80", // Nature
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80", // Morning
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80", // Lake
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80", // Forest
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", // Beach
];

export const DEFAULT_DAILY_TASKS: Omit<DailyTask, 'completed'>[] = [
  { id: '1', text: 'Take 3 deep conscious breaths' },
  { id: '2', text: 'Drink a glass of water' },
  { id: '3', text: 'Step outside for fresh air' },
  { id: '4', text: 'Write down one win for today' },
];