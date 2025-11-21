import React, { useState } from 'react';
import { LogEntry, MoodType, ViewState } from '../types';
import { MOODS } from '../constants';
import { saveLog } from '../services/storageService';

interface MoodLoggerProps {
  onLogSaved: () => void;
  setView: (view: ViewState) => void;
}

const MoodLogger: React.FC<MoodLoggerProps> = ({ onLogSaved, setView }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [stress, setStress] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    
    // Simulate slight network delay for better UX feel
    setTimeout(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        mood: selectedMood,
        stressLevel: stress,
        notes: notes
      };

      saveLog(newLog);
      onLogSaved();
      setView(ViewState.DASHBOARD);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">How are you feeling?</h2>
      
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg space-y-8">
        
        {/* Mood Selection */}
        <div>
          <label className="block text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Current Mood</label>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {MOODS.map((mood) => (
              <button
                key={mood.type}
                type="button"
                onClick={() => setSelectedMood(mood.type)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 border-2 ${
                  selectedMood === mood.type
                    ? 'border-teal-500 bg-slate-700 transform scale-105'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <span className="text-3xl mb-2">{mood.emoji}</span>
                <span className={`text-xs font-medium ${selectedMood === mood.type ? 'text-white' : 'text-slate-400'}`}>
                  {mood.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Slider */}
        <div>
          <div className="flex justify-between items-end mb-4">
             <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Stress Level</label>
             <span className={`text-xl font-bold ${stress > 7 ? 'text-red-400' : 'text-teal-400'}`}>{stress}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 transition-colors"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Relaxed</span>
            <span>Overwhelmed</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Quick Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind?..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 h-32 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedMood || isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            !selectedMood || isSubmitting
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? 'Saving Entry...' : 'Log Entry'}
        </button>
      </form>
    </div>
  );
};

export default MoodLogger;