'use client';

import React from 'react';
import {
  Flame,
  Dumbbell,
  LineChart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LandingHeroProps {
  onStartOnboarding: () => void;
  onSkipToApp: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartOnboarding,
  onSkipToApp,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 sm:py-12 px-4">
      {/* Product Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Professional Health Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Precision Fitness & Nutrition Operating System
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Calculates your exact daily calorie budget, macronutrient split, weight trend analytics, and integrated OpenGym workout routines.
        </p>

        {/* Primary Call to Actions */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartOnboarding}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-xs"
          >
            Start 1-Min Setup <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSkipToApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
          >
            Skip directly to App
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Precision Calorie Budget</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Calculates your exact resting calories (BMR), daily energy burn (TDEE), and deficit allocation split based on 7,700 kcal/kg energy math.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">OpenGym Workouts</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Integrated PPL, Upper/Lower, and Full Body routines with exercise technique tips, set logging, and a built-in rest timer.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <LineChart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">7-Day Weight Trend Analytics</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tracks 7-day rolling averages and progress states (On Track, Slower, Faster) to evaluate true body composition trends.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">AI Fitness Coach</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Generates 5 tailored actionable recommendations across Nutrition, Training, Hydration, Recovery, and Mindset.
          </p>
        </div>
      </div>

      {/* Feature Bullet Points */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-around gap-2 font-medium text-center">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Client-Side Privacy
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-User Local Storage
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Forever Hosting
        </span>
      </div>
    </div>
  );
};
