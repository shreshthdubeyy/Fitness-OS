'use client';

import React, { useState } from 'react';
import { FitnessResults, FitnessInput } from '@/lib/types';
import {
  TrendingDown,
  TrendingUp,
  LineChart,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ProgressTrackerSimulatorProps {
  results: FitnessResults;
  input: FitnessInput;
}

export const ProgressTrackerSimulator: React.FC<ProgressTrackerSimulatorProps> = ({
  results,
  input,
}) => {
  const currentW = input.weightKg;
  const targetLossPerWeek = results.goalEngine.weeklyLossKg;

  // Initial 7-day simulated weights near current weight
  const [weights, setWeights] = useState<number[]>([
    currentW,
    Number((currentW - targetLossPerWeek * 0.15).toFixed(1)),
    Number((currentW - targetLossPerWeek * 0.3).toFixed(1)),
    Number((currentW - targetLossPerWeek * 0.45).toFixed(1)),
    Number((currentW - targetLossPerWeek * 0.6).toFixed(1)),
    Number((currentW - targetLossPerWeek * 0.8).toFixed(1)),
    Number((currentW - targetLossPerWeek * 1.0).toFixed(1)),
  ]);

  const handleWeightChange = (index: number, val: number) => {
    const updated = [...weights];
    updated[index] = val;
    setWeights(updated);
  };

  const rollingAvg = Number(
    (weights.reduce((acc, curr) => acc + (curr || 0), 0) / weights.length).toFixed(2)
  );

  const totalDiff = Number((currentW - rollingAvg).toFixed(2));
  const expectedDiff = targetLossPerWeek;

  let progressState: 'On Track' | 'Slower Than Planned' | 'Faster Than Planned' = 'On Track';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  let stateMessage = 'Your 7-day average weight is trending steadily on target. Maintain your current calorie and activity plan.';
  let adjustmentTip = 'No adjustments required. Keep consistent with your daily targets.';

  if (totalDiff < expectedDiff - 0.2) {
    progressState = 'Slower Than Planned';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
    stateMessage = 'Your weight trend is changing slower than expected. Review food logging accuracy and daily step consistency.';
    adjustmentTip = 'Suggested Adjustment: Reduce daily calories by ~100 kcal OR add 1,500 daily steps.';
  } else if (totalDiff > expectedDiff + 0.35 && results.goalEngine.weeklyLossPercent > 0.8) {
    progressState = 'Faster Than Planned';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
    icon = <TrendingDown className="w-4 h-4 text-blue-600" />;
    stateMessage = 'Your weight is dropping faster than your planned rate. Protect lean tissue mass by ensuring adequate energy.';
    adjustmentTip = 'Suggested Adjustment: Increase daily calories by ~100–150 kcal (add complex carbs or protein).';
  }

  const resetToBaseline = () => {
    setWeights([
      currentW,
      Number((currentW - targetLossPerWeek * 0.15).toFixed(1)),
      Number((currentW - targetLossPerWeek * 0.3).toFixed(1)),
      Number((currentW - targetLossPerWeek * 0.45).toFixed(1)),
      Number((currentW - targetLossPerWeek * 0.6).toFixed(1)),
      Number((currentW - targetLossPerWeek * 0.8).toFixed(1)),
      Number((currentW - targetLossPerWeek * 1.0).toFixed(1)),
    ]);
  };

  return (
    <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">7-Day Rolling Average Progress Simulator</h3>
            <p className="text-xs text-slate-500">Track daily weights to evaluate sustained trends rather than single-day fluctuations</p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetToBaseline}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-600 transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
        </button>
      </div>

      {/* 7 Daily Input Fields */}
      <div className="grid grid-cols-7 gap-2">
        {weights.map((w, idx) => (
          <div key={idx} className="space-y-1 text-center">
            <label className="text-[10px] font-semibold text-slate-500 uppercase">Day {idx + 1}</label>
            <input
              type="number"
              step="0.1"
              value={w || ''}
              onChange={(e) => handleWeightChange(idx, parseFloat(e.target.value) || 0)}
              className="w-full text-center px-1.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        ))}
      </div>

      {/* Summary Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Starting Weight</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{currentW} kg</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">7-Day Rolling Average</p>
          <p className="text-xl font-bold text-blue-600 mt-0.5">{rollingAvg} kg</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Weekly Change Trend</p>
          <p className={`text-xl font-bold mt-0.5 ${totalDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalDiff > 0 ? `-${totalDiff}` : `+${Math.abs(totalDiff)}`} kg
          </p>
        </div>
      </div>

      {/* Adaptive Progress Status Box */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Progress State</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
            {progressState}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-normal">{stateMessage}</p>

        <div className="pt-2 border-t border-slate-200/80 text-xs font-semibold text-slate-900">
          💡 {adjustmentTip}
        </div>
      </div>
    </div>
  );
};
