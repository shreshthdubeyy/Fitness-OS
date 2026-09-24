'use client';

import React, { useState } from 'react';
import { FitnessInput, Gender, Goal, UnitSystem } from '@/lib/types';
import { ftInToCm } from '@/lib/calculator';
import { User, Ruler, Weight, Target, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface OnboardingWizardProps {
  unitSystem: UnitSystem;
  onComplete: (input: FitnessInput, name: string) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  unitSystem,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState<string>('My Profile');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [weightKg, setWeightKg] = useState<number>(80);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(74);
  const [goalWeeks, setGoalWeeks] = useState<number>(12);
  const [goal, setGoal] = useState<Goal>('recomp');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHeightCm = unitSystem === 'metric' ? heightCm : ftInToCm(heightFeet, heightInches);

    const input: FitnessInput = {
      gender,
      age: Math.max(10, age || 20),
      heightCm: Math.max(80, finalHeightCm || 160),
      weightKg: Math.max(30, weightKg || 60),
      targetWeightKg: Math.max(30, targetWeightKg || 60),
      activityLevel: 'moderate',
      goal,
      unitSystem,
      goalWeeks: Math.max(1, goalWeeks || 12),
      nutritionRatio: 0.5,
    };

    onComplete(input, name);
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              One-Time Setup — Step {step} of 3
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {step === 1 ? 'Basic Info & Gender' : step === 2 ? 'Body Measurements' : 'Target Goal & Timeline'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            Cancel
          </button>
        </div>

        {/* STEP 1: Name & Gender */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Profile Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shreshth"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" /> Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 px-4 rounded-xl text-xs font-medium border transition-all ${
                    gender === 'male'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 px-4 rounded-xl text-xs font-medium border transition-all ${
                    gender === 'female'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Age, Height, Weight */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Age (Years)</label>
              <input
                type="number"
                value={age || ''}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="e.g. 28"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-blue-600" /> Height {unitSystem === 'metric' ? '(cm)' : '(ft & in)'}
              </label>
              {unitSystem === 'metric' ? (
                <input
                  type="number"
                  value={heightCm || ''}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  placeholder="e.g. 175"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={heightFeet || ''}
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    placeholder="Ft"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                  />
                  <input
                    type="number"
                    value={heightInches || ''}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    placeholder="In"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-blue-600" /> Current Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weightKg || ''}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                placeholder="e.g. 80"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Target Weight & Timeline */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" /> Target Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={targetWeightKg || ''}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                placeholder="e.g. 74"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Target Timeline (Weeks)</label>
              <div className="grid grid-cols-4 gap-2">
                {[8, 12, 16, 24].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setGoalWeeks(w)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                      goalWeeks === w
                        ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    {w} Weeks
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete Setup & Launch App
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
