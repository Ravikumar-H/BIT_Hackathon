import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  username: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onLogout, username }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { view: ViewState.LOG_ENTRY, label: 'Log Mood', icon: '✏️' },
    { view: ViewState.INSIGHTS, label: 'Insights', icon: '🧠' },
    { view: ViewState.CHAT, label: 'Chat Buddy', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">MindEase</h1>
        <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm">Logout</button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-6">
        <div className="mb-10">
           <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-1">MindEase</h1>
           <p className="text-xs text-slate-400">Welcome, {username}</p>
        </div>
        
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.view 
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center space-x-2 text-slate-500 hover:text-red-400 transition-colors px-4 py-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-slate-800 border-t border-slate-700 z-50 flex justify-around p-3 pb-safe">
         {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center space-y-1 ${
                currentView === item.view ? 'text-teal-400' : 'text-slate-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
            </button>
          ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;