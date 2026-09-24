'use client';

import React, { useState, useEffect } from 'react';
import {
  WeightEntry,
  loadWeightLogsFromStorage,
  saveWeightLogsToStorage,
  getActiveProfileId,
} from '@/lib/storage';
import { FitnessResults, FitnessInput, UnitSystem } from '@/lib/types';
import { kgToLbs } from '@/lib/calculator';
import { Plus, Trash2, Calendar, LineChart, Target, CheckCircle2 } from 'lucide-react';

interface WeightProgressChartProps {
  results: FitnessResults;
  input: FitnessInput;
  unitSystem: UnitSystem;
  activeProfileId: string;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  results,
  input,
  unitSystem,
  activeProfileId,
}) => {
  const [logs, setLogs] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const pid = activeProfileId || getActiveProfileId();
    const loaded = loadWeightLogsFromStorage(pid);
    if (loaded.length === 0) {
      const seedDate = new Date();
      const initialLogs: WeightEntry[] = [
        {
          id: 'log-1',
          date: new Date(seedDate.getTime() - 6 * 86400000).toISOString().split('T')[0],
          weightKg: input.weightKg,
        },
        {
          id: 'log-2',
          date: new Date(seedDate.getTime() - 3 * 86400000).toISOString().split('T')[0],
          weightKg: Number((input.weightKg - results.goalEngine.weeklyLossKg * 0.4).toFixed(1)),
        },
        {
          id: 'log-3',
          date: seedDate.toISOString().split('T')[0],
          weightKg: Number((input.weightKg - results.goalEngine.weeklyLossKg * 0.8).toFixed(1)),
        },
      ];
      setLogs(initialLogs);
      saveWeightLogsToStorage(pid, initialLogs);
    } else {
      setLogs(loaded);
    }
  }, [activeProfileId, input.weightKg]);

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) return;

    const entryKg = unitSystem === 'imperial' ? Number((w / 2.20462).toFixed(1)) : w;
    const newEntry: WeightEntry = {
      id: `log-${Date.now()}`,
      date: newDate || new Date().toISOString().split('T')[0],
      weightKg: entryKg,
    };

    const updated = [...logs, newEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const pid = activeProfileId || getActiveProfileId();
    setLogs(updated);
    saveWeightLogsToStorage(pid, updated);
    setNewWeight('');
  };

  const deleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    const pid = activeProfileId || getActiveProfileId();
    setLogs(updated);
    saveWeightLogsToStorage(pid, updated);
  };

  const displayWeight = (kg: number) => {
    if (unitSystem === 'imperial') return `${kgToLbs(kg)} lbs`;
    return `${kg} kg`;
  };

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const initialLog = logs.length > 0 ? logs[0] : null;
  const totalChangeKg =
    latestLog && initialLog ? Number((latestLog.weightKg - initialLog.weightKg).toFixed(1)) : 0;

  return (
    <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <LineChart className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Weight Log & Chart</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log daily weights to track progress toward your {displayWeight(input.targetWeightKg)} target
          </p>
        </div>
      </div>

      {/* Quick Add Log Form */}
      <form onSubmit={addLog} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">
            Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            step="0.1"
            placeholder={unitSystem === 'metric' ? 'e.g. 70.5' : 'e.g. 155'}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Log Entry
          </button>
        </div>
      </form>

      {/* Analytics Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 uppercase">Current Weight</p>
          <p className="text-lg font-extrabold text-slate-900 mt-0.5">
            {latestLog ? displayWeight(latestLog.weightKg) : displayWeight(input.weightKg)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 uppercase">Total Progress</p>
          <p className={`text-lg font-extrabold mt-0.5 ${totalChangeKg <= 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {totalChangeKg > 0 ? `+${totalChangeKg}` : totalChangeKg} kg
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase">Target Weight</p>
          <p className="text-lg font-extrabold text-blue-600 mt-0.5">
            {displayWeight(input.targetWeightKg)}
          </p>
        </div>
      </div>

      {/* Weight History List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Logged Entries</h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 text-xs transition-all"
            >
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" /> {log.date}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{displayWeight(log.weightKg)}</span>
                <button
                  type="button"
                  onClick={() => deleteLog(log.id)}
                  className="text-slate-600 hover:text-rose-600 transition-all p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
