'use client';

import React, { useState, useEffect } from 'react';
import { WORKOUT_ROUTINES, WorkoutRoutine, Exercise } from '@/lib/workoutData';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Flame,
  Zap,
  Info,
} from 'lucide-react';

export const OpenGymWorkout: React.FC = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine>(WORKOUT_ROUTINES[0]);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const toggleSet = (exerciseId: string, setNum: number) => {
    const key = `${exerciseId}-set-${setNum}`;
    const nextState = !completedSets[key];
    setCompletedSets((prev) => ({ ...prev, [key]: nextState }));

    // Start rest timer automatically when set is completed
    if (nextState) {
      setTimerSeconds(60);
      setTimerRunning(true);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">OpenGym Workout Planner</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured workout routines, exercise targets, and set logging with rest timer
          </p>
        </div>

        {/* Rest Timer Widget */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs shrink-0">
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-500">Rest Timer</p>
            <p className="text-base font-extrabold text-blue-600 tracking-tight">{formatTimer(timerSeconds)}</p>
          </div>
          <button
            type="button"
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
            title={timerRunning ? 'Pause Timer' : 'Start Rest Timer'}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setTimerSeconds(60);
              setTimerRunning(false);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
            title="Reset to 60s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Routine Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {WORKOUT_ROUTINES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRoutine(r)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedRoutine.id === r.id
                ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{r.title}</span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
                {r.difficulty}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{r.daysPerWeek}</p>
          </button>
        ))}
      </div>

      {/* Selected Routine Overview */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {selectedRoutine.title}
        </h3>
        <p className="text-xs text-slate-600">{selectedRoutine.description}</p>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3.5">
        {selectedRoutine.exercises.map((ex) => (
          <div
            key={ex.id}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{ex.name}</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {ex.category} • {ex.equipment}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Target: {ex.sets} sets × {ex.reps}</p>
              </div>

              {/* Set Tracker Checkboxes */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: ex.sets }).map((_, setIdx) => {
                  const setNum = setIdx + 1;
                  const isDone = completedSets[`${ex.id}-set-${setNum}`];
                  return (
                    <button
                      key={setNum}
                      type="button"
                      onClick={() => toggleSet(ex.id, setNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                      }`}
                      title={`Set ${setNum}: Click to mark complete`}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : setNum}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-600">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-normal">{ex.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
