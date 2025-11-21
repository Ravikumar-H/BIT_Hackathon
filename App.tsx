import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MoodLogger from './components/MoodLogger';
import ChatBuddy from './components/ChatBuddy';
import WellnessInsights from './components/WellnessInsights';
import Auth from './components/Auth';
import { LogEntry, ViewState, User } from './types';
import { getLogs, getUser, loginUser, logoutUser } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  // Initialize data on mount
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setLogs(getLogs());
    } else {
      setCurrentView(ViewState.AUTH);
    }
  }, []);

  const handleLogin = (username: string) => {
    const newUser = loginUser(username);
    setUser(newUser);
    setLogs(getLogs());
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView(ViewState.AUTH);
  };

  const refreshLogs = () => {
    setLogs(getLogs());
  };

  // Auth Guard
  if (!user || currentView === ViewState.AUTH) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard logs={logs} setView={setCurrentView} />;
      case ViewState.LOG_ENTRY:
        return <MoodLogger onLogSaved={refreshLogs} setView={setCurrentView} />;
      case ViewState.CHAT:
        return <ChatBuddy />;
      case ViewState.INSIGHTS:
        return <WellnessInsights logs={logs} />;
      default:
        return <Dashboard logs={logs} setView={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      onLogout={handleLogout}
      username={user.username}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;