import { LogEntry, User, DailyTask } from '../types';
import { DEFAULT_DAILY_TASKS } from '../constants';

const LOGS_KEY = 'mindease_logs';
const USER_KEY = 'mindease_user';
const TASKS_KEY = 'mindease_daily_tasks';

export const getLogs = (): LogEntry[] => {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse logs", e);
    return [];
  }
};

export const saveLog = (log: LogEntry): void => {
  const currentLogs = getLogs();
  const updatedLogs = [log, ...currentLogs];
  localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
};

export const getUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const loginUser = (username: string): User => {
  const user = { username, isLoggedIn: true };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Daily Tasks Logic
export const getDailyTasks = (): DailyTask[] => {
  const today = new Date().toDateString();
  const storedString = localStorage.getItem(TASKS_KEY);
  
  let storedData: { date: string; tasks: DailyTask[] } | null = null;
  
  if (storedString) {
    storedData = JSON.parse(storedString);
  }

  // If tasks exist and are from today, return them
  if (storedData && storedData.date === today) {
    return storedData.tasks;
  }

  // Otherwise, reset tasks for the new day
  const newTasks: DailyTask[] = DEFAULT_DAILY_TASKS.map(task => ({
    ...task,
    completed: false
  }));

  localStorage.setItem(TASKS_KEY, JSON.stringify({ date: today, tasks: newTasks }));
  return newTasks;
};

export const toggleTaskCompletion = (taskId: string): DailyTask[] => {
  const currentTasks = getDailyTasks();
  const updatedTasks = currentTasks.map(t => 
    t.id === taskId ? { ...t, completed: !t.completed } : t
  );
  
  const today = new Date().toDateString();
  localStorage.setItem(TASKS_KEY, JSON.stringify({ date: today, tasks: updatedTasks }));
  
  return updatedTasks;
};