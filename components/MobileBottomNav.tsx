'use client';

import React from 'react';
import { Home, Dumbbell, LineChart, Sparkles } from 'lucide-react';

export type MobileTab = 'plan' | 'workouts' | 'progress' | 'ai';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 flex items-center justify-around shadow-lg">
      <button
        type="button"
        onClick={() => onTabChange('plan')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'plan'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Plan</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('workouts')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'workouts'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Dumbbell className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Workouts</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('progress')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'progress'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <LineChart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Progress</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('ai')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'ai'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Sparkles className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">AI Coach</span>
      </button>
    </nav>
  );
};
