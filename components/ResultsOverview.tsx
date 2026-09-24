'use client';

import React, { useState } from 'react';
import { FitnessResults, FitnessInput, UnitSystem } from '@/lib/types';
import { kgToLbs } from '@/lib/calculator';
import {
  Flame,
  Activity,
  PieChart,
  Calendar,
  Droplets,
  Copy,
  Check,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Sliders,
  Calculator,
  Compass,
  Info,
} from 'lucide-react';

interface ResultsOverviewProps {
  results: FitnessResults;
  input: FitnessInput;
  unitSystem: UnitSystem;
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({
  results,
  input,
  unitSystem,
}) => {
  const [copied, setCopied] = useState(false);

  const displayWeight = (kg: number) => {
    if (unitSystem === 'imperial') {
      return `${kgToLbs(kg)} lbs`;
    }
    return `${kg} kg`;
  };

  const isWeightLoss = input.weightKg > input.targetWeightKg;

  const handleCopySummary = () => {
    const summaryText = `💪 PERSONALIZED FITNESS & GOAL PLAN
----------------------------------------
Goal: ${input.goal.toUpperCase()} (${input.gender}, ${input.age} yrs)
Current Weight: ${displayWeight(input.weightKg)} → Target Weight: ${displayWeight(input.targetWeightKg)}
Target Timeline: ${input.goalWeeks} Weeks (${results.goalEngine.weeklyLossKg} kg/week)
BMI Score: ${results.bmi} (${results.bmiCategory})
Ideal Weight Range: ${displayWeight(results.idealWeightMinKg)} - ${displayWeight(results.idealWeightMaxKg)}

🔥 DAILY CALORIE BUDGET
Resting Calories (BMR): ${results.bmr} kcal/day
Daily Energy Burn (TDEE): ${results.tdee} kcal/day
Target Daily Budget: ${results.targetCalories} kcal/day
Daily Change: ${results.calorieDiff >= 0 ? '+' : ''}${results.calorieDiff} kcal/day

🥗 DAILY MACRONUTRIENTS
• 🍗 Protein: ${results.proteinGrams}g (${results.proteinCalories} kcal)
• 🥖 Carbs: ${results.carbGrams}g (${results.carbCalories} kcal)
• 🥑 Healthy Fat: ${results.fatGrams}g (${results.fatCalories} kcal)

💧 HYDRATION & TIMELINE
• Daily Water: ${results.waterLitersAvg} Liters (${results.waterMlMin}-${results.waterMlMax} ml)
----------------------------------------
Generated via Fitness Calculator OS`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // BMI gauge percentage calculation (clamped between 12 and 40)
  const clampedBmi = Math.max(12, Math.min(40, results.bmi));
  const bmiGaugePercent = ((clampedBmi - 12) / (40 - 12)) * 100;

  const getBmiBadgeColor = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Normal weight':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Overweight':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Obese':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety & Sustainability Guardrail Warning Banner */}
      {results.goalEngine.safetyWarning && (
        <div className="p-4 rounded-[12px] bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Safety & Timeline Check
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              {results.goalEngine.safetyWarning}
            </p>
          </div>
        </div>
      )}

      {/* Consumer Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Daily Calorie Budget */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Calorie Budget</span>
            <Flame className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {results.targetCalories}
            </span>
            <span className="text-xs font-medium text-slate-500">kcal/day</span>
          </div>
          <div className="mt-2 text-xs font-medium flex items-center gap-1">
            {results.calorieDiff < 0 ? (
              <span className="text-blue-600 flex items-center gap-0.5 font-semibold">
                <TrendingDown className="w-3 h-3" /> {results.calorieDiff} kcal (Fat Loss Deficit)
              </span>
            ) : results.calorieDiff > 0 ? (
              <span className="text-emerald-600 flex items-center gap-0.5 font-semibold">
                <TrendingUp className="w-3 h-3" /> +{results.calorieDiff} kcal (Muscle Surplus)
              </span>
            ) : (
              <span className="text-slate-500">Maintenance Level</span>
            )}
          </div>
        </div>

        {/* Protein */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">🍗 Protein</span>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {results.proteinGrams}g
            </span>
            <span className="text-xs font-medium text-slate-500">/ day</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {results.proteinCalories} kcal ({Math.round((results.proteinCalories / results.targetCalories) * 100)}%)
          </p>
        </div>

        {/* Carbs */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">🥖 Carbohydrates</span>
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {results.carbGrams}g
            </span>
            <span className="text-xs font-medium text-slate-500">/ day</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {results.carbCalories} kcal ({Math.round((results.carbCalories / results.targetCalories) * 100)}%)
          </p>
        </div>

        {/* Fat */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">🥑 Healthy Fats</span>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {results.fatGrams}g
            </span>
            <span className="text-xs font-medium text-slate-500">/ day</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {results.fatCalories} kcal ({Math.round((results.fatCalories / results.targetCalories) * 100)}%)
          </p>
        </div>
      </div>

      {/* Fat Loss Pace Card */}
      {isWeightLoss && (
        <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-semibold text-slate-900">Fat Loss Pace Breakdown</h3>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              {results.goalEngine.weightToLoseKg} kg target loss
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-semibold text-slate-500 uppercase">Total Calorie Burn Needed</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                {results.goalEngine.totalDeficitKcal.toLocaleString()} kcal
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-semibold text-slate-500 uppercase">Diet Food Cut</p>
              <p className="text-base font-extrabold text-blue-600 mt-0.5">
                -{results.goalEngine.nutritionDeficitKcal} kcal/day
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-semibold text-slate-500 uppercase">Daily Activity Target</p>
              <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                -{results.goalEngine.activityDeficitKcal} kcal/day
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
            <span className="font-semibold text-slate-800">Suggested Activity Goal: </span>
            {results.goalEngine.suggestedSteps}
          </p>
        </div>
      )}

      {/* Main Grid: Body Composition & Energy Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* BMI & Ideal Weight Card */}
        <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">Body Mass Index (BMI)</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getBmiBadgeColor(results.bmiCategory)}`}>
                {results.bmiCategory}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{results.bmi}</span>
                <span className="text-xs text-slate-500 ml-2">kg/m²</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Healthy BMI Range</p>
                <p className="text-xs font-semibold text-slate-800">18.5 – 24.9 kg/m²</p>
              </div>
            </div>

            {/* Visual BMI Gauge */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
                <div className="w-[23%] bg-amber-300" title="Underweight (<18.5)" />
                <div className="w-[23%] bg-emerald-400" title="Normal (18.5-24.9)" />
                <div className="w-[18%] bg-amber-400" title="Overweight (25-29.9)" />
                <div className="w-[36%] bg-rose-400" title="Obese (>=30)" />

                {/* Marker pointer */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-slate-900 rounded-full shadow-md transition-all duration-300 transform -translate-x-1/2"
                  style={{ left: `${bmiGaugePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Healthy Weight Range</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {displayWeight(results.idealWeightMinKg)} – {displayWeight(results.idealWeightMaxKg)}
            </span>
          </div>
        </div>

        {/* Resting vs Daily Energy Burn Card */}
        <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">Energy Burn Breakdown</h3>
              </div>
              <span className="text-xs font-medium text-slate-500">Mifflin-St Jeor</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Resting Calories (BMR)
                </p>
                <p className="text-2xl font-bold text-slate-900">{results.bmr}</p>
                <p className="text-[11px] text-slate-500 mt-1">Burned at rest</p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100/60">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  Daily Energy Burn (TDEE)
                </p>
                <p className="text-2xl font-bold text-slate-900">{results.tdee}</p>
                <p className="text-[11px] text-slate-500 mt-1">Total daily burn with movement</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Objective</span>
            <span className="font-semibold text-slate-900">
              {isWeightLoss
                ? 'Fat Loss & Muscle Recomp'
                : input.goal === 'gain'
                ? 'Muscle Growth (Surplus)'
                : 'Weight Maintenance'}
            </span>
          </div>
        </div>
      </div>

      {/* Copy Summary Action Bar */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" /> Copied Plan to Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Complete Plan Summary
            </>
          )}
        </button>
      </div>
    </div>
  );
};
