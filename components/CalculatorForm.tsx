'use client';

import React, { useState, useEffect } from 'react';
import {
  FitnessInput,
  Gender,
  ActivityLevel,
  Goal,
  UnitSystem,
} from '@/lib/types';
import {
  kgToLbs,
  lbsToKg,
  cmToFtIn,
  ftInToCm,
} from '@/lib/calculator';
import {
  User,
  Ruler,
  Weight,
  Target,
  Flame,
  Zap,
  Clock,
  Sliders,
} from 'lucide-react';

interface CalculatorFormProps {
  unitSystem: UnitSystem;
  onChange: (input: FitnessInput) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  unitSystem,
  onChange,
}) => {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(28);
  
  // Metric state
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(64);

  // Imperial state
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [targetWeightLbs, setTargetWeightLbs] = useState<number>(141);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('lose');
  
  // Goal Engine additions
  const [goalWeeks, setGoalWeeks] = useState<number>(12);
  const [nutritionRatio, setNutritionRatio] = useState<number>(0.5); // 0.5 = 50:50 split

  // Synchronize Metric and Imperial states when unit system changes
  useEffect(() => {
    if (unitSystem === 'metric') {
      const newWeightKg = lbsToKg(weightLbs);
      const newHeightCm = ftInToCm(heightFeet, heightInches);
      const newTargetKg = lbsToKg(targetWeightLbs);
      setWeightKg(newWeightKg);
      setHeightCm(newHeightCm);
      setTargetWeightKg(newTargetKg);
    } else {
      const newWeightLbs = kgToLbs(weightKg);
      const { feet, inches } = cmToFtIn(heightCm);
      const newTargetLbs = kgToLbs(targetWeightKg);
      setWeightLbs(newWeightLbs);
      setHeightFeet(feet);
      setHeightInches(inches);
      setTargetWeightLbs(newTargetLbs);
    }
  }, [unitSystem]);

  // Trigger recalculation on any change
  useEffect(() => {
    const currentWeightKg = unitSystem === 'metric' ? weightKg : lbsToKg(weightLbs);
    const currentHeightCm = unitSystem === 'metric' ? heightCm : ftInToCm(heightFeet, heightInches);
    const currentTargetKg = unitSystem === 'metric' ? targetWeightKg : lbsToKg(targetWeightLbs);

    onChange({
      gender,
      age: Math.max(1, age || 20),
      heightCm: Math.max(1, currentHeightCm || 160),
      weightKg: Math.max(1, currentWeightKg || 60),
      targetWeightKg: Math.max(1, currentTargetKg || 60),
      activityLevel,
      goal,
      unitSystem,
      goalWeeks: Math.max(1, goalWeeks || 12),
      nutritionRatio,
    });
  }, [
    gender,
    age,
    weightKg,
    heightCm,
    targetWeightKg,
    weightLbs,
    heightFeet,
    heightInches,
    targetWeightLbs,
    activityLevel,
    goal,
    unitSystem,
    goalWeeks,
    nutritionRatio,
  ]);

  return (
    <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Profile & Goals</h2>
          <p className="text-xs text-slate-500">Configure parameters for personalized goal engine calculations</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          Live Engine
        </span>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" /> Gender
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
              gender === 'male'
                ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
              gender === 'female'
                ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      {/* Age & Height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Age */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Age (years)
          </label>
          <input
            type="number"
            min="10"
            max="120"
            value={age || ''}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
            placeholder="e.g. 28"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-blue-600" /> Height {unitSystem === 'metric' ? '(cm)' : '(ft & in)'}
          </label>
          {unitSystem === 'metric' ? (
            <input
              type="number"
              min="80"
              max="250"
              value={heightCm || ''}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
              placeholder="e.g. 175"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="3"
                max="8"
                value={heightFeet || ''}
                onChange={(e) => setHeightFeet(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
                placeholder="Ft"
              />
              <input
                type="number"
                min="0"
                max="11"
                value={heightInches || ''}
                onChange={(e) => setHeightInches(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
                placeholder="In"
              />
            </div>
          )}
        </div>
      </div>

      {/* Weight & Target Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current Weight */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5 text-blue-600" /> Current Weight {unitSystem === 'metric' ? '(kg)' : '(lbs)'}
          </label>
          {unitSystem === 'metric' ? (
            <input
              type="number"
              min="30"
              max="300"
              step="0.5"
              value={weightKg || ''}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
              placeholder="e.g. 70"
            />
          ) : (
            <input
              type="number"
              min="60"
              max="660"
              step="1"
              value={weightLbs || ''}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
              placeholder="e.g. 154"
            />
          )}
        </div>

        {/* Target Weight */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-blue-600" /> Target Weight {unitSystem === 'metric' ? '(kg)' : '(lbs)'}
          </label>
          {unitSystem === 'metric' ? (
            <input
              type="number"
              min="30"
              max="300"
              step="0.5"
              value={targetWeightKg || ''}
              onChange={(e) => setTargetWeightKg(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
              placeholder="e.g. 64"
            />
          ) : (
            <input
              type="number"
              min="60"
              max="660"
              step="1"
              value={targetWeightLbs || ''}
              onChange={(e) => setTargetWeightLbs(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
              placeholder="e.g. 141"
            />
          )}
        </div>
      </div>

      {/* Fitness Goal */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-blue-600" /> Primary Fitness Goal
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'lose', label: 'Fat Loss' },
            { id: 'maintain', label: 'Maintain' },
            { id: 'gain', label: 'Muscle Gain' },
            { id: 'recomp', label: 'Recomp' },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGoal(g.id as Goal)}
              className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                goal === g.id
                  ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-semibold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Duration (Weeks) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Target Timeline (Weeks)
          </label>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {goalWeeks} Weeks ({Math.round(goalWeeks / 4.33)} Months)
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[4, 8, 12, 16, 24].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setGoalWeeks(w)}
              className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                goalWeeks === w
                  ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              {w}w
            </button>
          ))}
        </div>
      </div>

      {/* Deficit Ratio Split (Nutrition vs Activity) */}
      {goal === 'lose' && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" /> Deficit Allocation Split
            </label>
            <span className="text-xs font-semibold text-slate-800">
              {Math.round(nutritionRatio * 100)}% Diet : {Math.round((1 - nutritionRatio) * 100)}% Activity
            </span>
          </div>

          <input
            type="range"
            min="0.3"
            max="0.8"
            step="0.05"
            value={nutritionRatio}
            onChange={(e) => setNutritionRatio(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Higher Activity Burn</span>
            <span>Balanced 50:50</span>
            <span>Higher Diet Deficit</span>
          </div>
        </div>
      )}

      {/* Activity Level */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" /> Daily Activity Level
        </label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm font-medium text-slate-900 bg-white"
        >
          <option value="sedentary">Sedentary (Little or no exercise, desk job - 1.2x)</option>
          <option value="light">Lightly Active (Light exercise 1-3 days/week - 1.375x)</option>
          <option value="moderate">Moderately Active (Moderate exercise 3-5 days/week - 1.55x)</option>
          <option value="very_active">Very Active (Hard exercise 6-7 days/week - 1.725x)</option>
          <option value="extra_active">Extra Active (Very intense physical job / training - 1.9x)</option>
        </select>
      </div>
    </div>
  );
};
