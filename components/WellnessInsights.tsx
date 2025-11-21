import React, { useEffect, useState } from 'react';
import { LogEntry, WellnessTip } from '../types';
import { generateWellnessInsights } from '../services/geminiService';
import { INITIAL_TIPS, CALMING_IMAGES } from '../constants';

interface InsightsProps {
  logs: LogEntry[];
}

const WellnessInsights: React.FC<InsightsProps> = ({ logs }) => {
  const [tips, setTips] = useState<WellnessTip[]>(INITIAL_TIPS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  // Generate tips when component mounts, but only if we have logs and haven't updated recently
  useEffect(() => {
    const fetchTips = async () => {
      if (logs.length === 0) return;
      if (Date.now() - lastUpdated < 60000) return; // Cache for 1 min

      setIsLoading(true);
      const generatedTips = await generateWellnessInsights(logs);
      if (generatedTips && generatedTips.length > 0) {
        // Assign random images to generated tips since API doesn't return them
        const tipsWithImages = generatedTips.map((tip, idx) => ({
            ...tip,
            imageUrl: CALMING_IMAGES[idx % CALMING_IMAGES.length]
        }));
        setTips(tipsWithImages);
        setLastUpdated(Date.now());
      }
      setIsLoading(false);
    };

    fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs.length]);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">AI Wellness Insights</h2>
        <p className="text-slate-400">Personalized suggestions based on your recent activity.</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-slate-800 rounded-2xl h-80 border border-slate-700 animate-pulse overflow-hidden">
               <div className="h-40 bg-slate-700"></div>
               <div className="p-6 space-y-4">
                  <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
                  <div className="h-3 w-full bg-slate-700 rounded"></div>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <div 
              key={index} 
              className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/20 group overflow-hidden flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                 <img 
                   src={tip.imageUrl || CALMING_IMAGES[index % CALMING_IMAGES.length]} 
                   alt={tip.title}
                   className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                 <div className="absolute top-4 right-4 bg-slate-900/50 backdrop-blur-md p-2 rounded-full text-2xl border border-slate-700/50 shadow-lg">
                    {tip.icon}
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{tip.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {logs.length === 0 && (
         <div className="mt-12 p-8 bg-gradient-to-br from-blue-900/20 to-teal-900/20 border border-blue-500/30 rounded-2xl text-center relative overflow-hidden">
            <div className="relative z-10">
                <span className="text-4xl mb-4 block">🌱</span>
                <h3 className="text-lg font-bold text-white mb-2">Start Your Journey</h3>
                <p className="text-blue-200 max-w-lg mx-auto">Start logging your mood daily to receive personalized AI-powered wellness insights tailored just for you.</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default WellnessInsights;