import React, { useMemo, useState, useEffect } from 'react';
import { LogEntry, ViewState, DailyTask } from '../types';
import { MOODS } from '../constants';
import { getDailyTasks, toggleTaskCompletion } from '../services/storageService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardProps {
  logs: LogEntry[];
  setView: (view: ViewState) => void;
}

const getMoodScore = (mood: string): number => {
  switch (mood) {
    case 'Happy': return 6;
    case 'Calm': return 5;
    case 'Neutral': return 4;
    case 'Sad': return 3;
    case 'Anxious': return 2;
    case 'Angry': return 1;
    default: return 3.5;
  }
};

// Custom Tooltip Component for Stress Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodInfo = MOODS.find(m => m.type === data.mood);

    return (
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-95 outline-none min-w-[200px] z-50">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
        
        <div className="space-y-3">
           <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300 text-sm">Stress Level</span>
              <span className={`text-sm font-bold ${data.stress > 7 ? 'text-red-400' : data.stress > 4 ? 'text-yellow-400' : 'text-teal-400'}`}>
                {data.stress}/10
              </span>
           </div>
           
           <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300 text-sm">Mood</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{moodInfo?.emoji}</span>
                <span className={`text-sm font-medium ${moodInfo ? moodInfo.color : 'text-white'}`}>
                  {data.mood}
                </span>
              </div>
           </div>
        </div>

        {data.notes && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 font-medium mb-1">NOTES</p>
            <p className="text-sm text-slate-300 italic leading-relaxed line-clamp-3">
              "{data.notes}"
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Mood Chart
const MoodChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodInfo = MOODS.find(m => m.type === data.mood);

    return (
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-95 outline-none min-w-[200px] z-50">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
        
        <div className="space-y-3">
           <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300 text-sm">Mood</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{moodInfo?.emoji}</span>
                <span className={`text-sm font-bold ${moodInfo ? moodInfo.color : 'text-white'}`}>
                  {data.mood}
                </span>
              </div>
           </div>
           <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400 text-xs">Valence Score</span>
              <span className="text-slate-400 text-xs font-mono">{data.moodScore}/6</span>
           </div>
        </div>

        {data.notes && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 font-medium mb-1">NOTES</p>
            <p className="text-sm text-slate-300 italic leading-relaxed line-clamp-3">
              "{data.notes}"
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ logs, setView }) => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTasks(getDailyTasks());
  }, []);

  const handleToggleTask = (id: string) => {
    const updated = toggleTaskCompletion(id);
    setTasks(updated);
  };

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(log => 
      (log.notes && log.notes.toLowerCase().includes(query)) || 
      log.mood.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  // Check if logged today (using original logs to ensure reminder is accurate)
  const hasLoggedToday = useMemo(() => {
    if (logs.length === 0) return false;
    // logs[0] is the most recent log due to unshift in storageService
    const latestLogDate = new Date(logs[0].timestamp).toDateString();
    const today = new Date().toDateString();
    return latestLogDate === today;
  }, [logs]);

  // Process data for charts using filtered logs
  const chartData = useMemo(() => {
    return filteredLogs
      .slice(0, 7) // Last 7 matching entries
      .reverse() // Chronological order
      .map(log => ({
        date: new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
        stress: log.stressLevel,
        mood: log.mood,
        moodScore: getMoodScore(log.mood),
        notes: log.notes
      }));
  }, [filteredLogs]);

  const moodData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach(log => {
      counts[log.mood] = (counts[log.mood] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  const moodColors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    MOODS.forEach(m => {
       if (m.type === 'Happy') colorMap[m.type] = '#fbbf24';
       if (m.type === 'Calm') colorMap[m.type] = '#2dd4bf';
       if (m.type === 'Neutral') colorMap[m.type] = '#9ca3af';
       if (m.type === 'Sad') colorMap[m.type] = '#60a5fa';
       if (m.type === 'Anxious') colorMap[m.type] = '#c084fc';
       if (m.type === 'Angry') colorMap[m.type] = '#f87171';
    });
    return colorMap;
  }, []);

  const averageStress = useMemo(() => {
    if (filteredLogs.length === 0) return 0;
    const sum = filteredLogs.reduce((acc, curr) => acc + curr.stressLevel, 0);
    return (sum / filteredLogs.length).toFixed(1);
  }, [filteredLogs]);

  const taskProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Weekly Overview</h2>
            <p className="text-slate-400">Track your emotional journey and find your balance.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
            <input 
                type="text" 
                placeholder="Search notes or moods..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-500 text-sm shadow-lg"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </header>

      {/* Reminder Banner */}
      {!hasLoggedToday && (
        <div className="relative overflow-hidden rounded-2xl shadow-lg shadow-indigo-900/20 group">
           {/* Background Image */}
           <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200&auto=format&fit=crop" 
                alt="Relaxing background" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/80 mix-blend-multiply"></div>
           </div>

           <div className="relative z-10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/30 backdrop-blur-md rounded-full flex items-center justify-center text-2xl border border-indigo-400/30">
                  👋
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Haven't logged yet today?</h3>
                  <p className="text-indigo-100 text-sm">Taking a moment to check in helps build mindfulness.</p>
                </div>
              </div>
              <button 
                onClick={() => setView(ViewState.LOG_ENTRY)}
                className="whitespace-nowrap px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30"
              >
                Log Mood Now
              </button>
           </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg h-48 flex flex-col justify-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
             {searchQuery ? 'Matching Logs' : 'Total Logs'}
          </p>
          <p className="text-5xl font-bold text-teal-400">{filteredLogs.length}</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg h-48 flex flex-col justify-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Avg Stress</p>
          <p className={`text-5xl font-bold ${Number(averageStress) > 7 ? 'text-red-400' : Number(averageStress) > 4 ? 'text-yellow-400' : 'text-teal-400'}`}>
            {averageStress}<span className="text-xl text-slate-500 font-normal">/10</span>
          </p>
        </div>
        
        {/* Interactive Daily Goals Widget */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-48 relative overflow-hidden">
           <div className="flex justify-between items-center mb-3 z-10">
             <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Daily Goals</p>
             <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-400 transition-all duration-500 ease-out" 
                      style={{ width: `${taskProgress}%` }}
                    />
                </div>
                <span className="text-xs text-teal-400 font-bold">{taskProgress}%</span>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-2 z-10 scrollbar-hide">
              {tasks.map(task => (
                <button 
                    key={task.id} 
                    onClick={() => handleToggleTask(task.id)} 
                    className="w-full flex items-center gap-3 group text-left p-1.5 rounded-lg hover:bg-slate-700/30 transition-colors"
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-slate-600 group-hover:border-teal-400'}`}>
                     <svg 
                        className={`w-3 h-3 text-white transform transition-transform duration-200 ${task.completed ? 'scale-100' : 'scale-0'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                     >
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                  <span className={`text-sm truncate transition-colors duration-200 ${task.completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
                      {task.text}
                  </span>
                </button>
              ))}
              {tasks.length === 0 && (
                <p className="text-slate-500 text-sm italic text-center mt-4">No tasks set for today.</p>
              )}
           </div>
           
           {/* Subtle gradient overlay at bottom to indicate scrolling */}
           <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none z-20" />
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stress Chart */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Stress Trend</h3>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    domain={[0, 10]} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="#2dd4bf" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#1e293b', stroke: '#2dd4bf', strokeWidth: 2}} 
                    activeDot={{r: 6, fill: '#2dd4bf', stroke: '#fff', strokeWidth: 2}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                {searchQuery ? 'No matching logs found' : 'No data available yet'}
              </div>
            )}
          </div>
        </div>

        {/* Mood Trend Chart */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Mood Trend</h3>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    domain={[0, 7]} 
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tickFormatter={(val) => {
                      if (val === 1) return '😠';
                      if (val === 2) return '😰';
                      if (val === 3) return '😔';
                      if (val === 4) return '😐';
                      if (val === 5) return '😌';
                      if (val === 6) return '😊';
                      return '';
                    }}
                    tick={{fill: '#94a3b8', fontSize: 16}} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<MoodChartTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Line 
                    type="monotone" 
                    dataKey="moodScore" 
                    stroke="#fbbf24" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#1e293b', stroke: '#fbbf24', strokeWidth: 2}} 
                    activeDot={{r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                {searchQuery ? 'No matching logs found' : 'No data available yet'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Distribution and Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Mood Distribution</h3>
          <div className="h-64 w-full">
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={moodColors[entry.name] || '#cbd5e1'} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '0.75rem' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-500">
                {searchQuery ? 'No matching logs found' : 'No data available yet'}
              </div>
            )}
          </div>
        </div>

        {/* Recent / Filtered Entries List */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-[350px]">
             <h3 className="text-xl font-bold text-white mb-6">
                {searchQuery ? 'Search Results' : 'Recent Entries'}
             </h3>
             <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {filteredLogs.length > 0 ? (
                    filteredLogs.slice(0, 20).map(log => { // Limit list size for performance
                        const moodInfo = MOODS.find(m => m.type === log.mood);
                        return (
                            <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700 hover:border-teal-500/30 transition-colors">
                                <div className="text-2xl bg-slate-800 p-2 rounded-lg flex-shrink-0">{moodInfo?.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`font-bold text-sm ${moodInfo?.color}`}>{log.mood}</h4>
                                        <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    {log.notes ? (
                                      <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">"{log.notes}"</p>
                                    ) : (
                                      <p className="text-slate-600 text-xs italic">No notes</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end justify-center pl-2">
                                    <span className={`font-bold text-sm ${log.stressLevel > 7 ? 'text-red-400' : log.stressLevel > 4 ? 'text-yellow-400' : 'text-teal-400'}`}>
                                        {log.stressLevel}
                                    </span>
                                    <span className="text-[9px] text-slate-500 uppercase">Stress</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                        <span className="text-3xl mb-2">🔍</span>
                        <p>{searchQuery ? 'No entries found.' : 'No entries logged yet.'}</p>
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;