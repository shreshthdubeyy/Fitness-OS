'use client';

import React, { useState, useEffect } from 'react';
import { FitnessInput, Gender, Goal, UnitSystem } from '@/lib/types';
import { ftInToCm, cmToFtIn } from '@/lib/calculator';
import { Settings, X, Save, User, Ruler, Weight, Target } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: FitnessInput;
  unitSystem: UnitSystem;
  onSave: (updated: FitnessInput) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  input,
  unitSystem,
  onSave,
}) => {
  const [gender, setGender] = useState<Gender>(input.gender);
  const [age, setAge] = useState<number>(input.age);
  const [heightCm, setHeightCm] = useState<number>(input.heightCm);
  const [weightKg, setWeightKg] = useState<number>(input.weightKg);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(input.targetWeightKg);
  const [goalWeeks, setGoalWeeks] = useState<number>(input.goalWeeks || 12);
  const [goal, setGoal] = useState<Goal>(input.goal);

  useEffect(() => {
    setGender(input.gender);
    setAge(input.age);
    setHeightCm(input.heightCm);
    setWeightKg(input.weightKg);
    setTargetWeightKg(input.targetWeightKg);
    setGoalWeeks(input.goalWeeks || 12);
    setGoal(input.goal);
  }, [input, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...input,
      gender,
      age: Math.max(10, age || 20),
      heightCm: Math.max(80, heightCm || 160),
      weightKg: Math.max(30, weightKg || 60),
      targetWeightKg: Math.max(30, targetWeightKg || 60),
      goalWeeks: Math.max(1, goalWeeks || 12),
      goal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Adjust Body Profile & Goal</h3>
            <p className="text-xs text-slate-500">Update height, target weight, or timeline parameters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Age (Years)</label>
              <input
                type="number"
                value={age || ''}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Height & Current Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Height (cm)</label>
              <input
                type="number"
                value={heightCm || ''}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg || ''}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Target Weight & Timeline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg || ''}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Timeline (Weeks)</label>
              <select
                value={goalWeeks}
                onChange={(e) => setGoalWeeks(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value={4}>4 Weeks</option>
                <option value={8}>8 Weeks</option>
                <option value={12}>12 Weeks</option>
                <option value={16}>16 Weeks</option>
                <option value={24}>24 Weeks</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
