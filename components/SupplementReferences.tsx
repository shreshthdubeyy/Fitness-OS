'use client';

import React from 'react';
import { SupplementReferences as SupplementType } from '@/lib/types';
import { Pill, Coffee, Fish, Info, ShieldAlert } from 'lucide-react';

interface SupplementReferencesProps {
  supplements: SupplementType;
  weightKg: number;
}

export const SupplementReferences: React.FC<SupplementReferencesProps> = ({
  supplements,
  weightKg,
}) => {
  return (
    <div className="bg-white rounded-[12px] border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Supplement Reference Values</h3>
            <p className="text-xs text-slate-500">Body-weight-based reference heuristics (Informational only)</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
          Reference Only
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Creatine */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-indigo-600" /> Creatine Monohydrate
            </span>
            <span className="text-[10px] font-medium text-slate-500">0.03 g / kg</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">{supplements.creatineGrams}</span>
            <span className="text-xs font-semibold text-slate-500">g / day</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Optional sports reference. Supports intramuscular phosphocreatine stores and strength output.
          </p>
        </div>

        {/* Caffeine */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-600" /> Caffeine Ergogenic Limit
            </span>
            <span className="text-[10px] font-medium text-slate-500">3 mg / kg</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">{supplements.caffeineMg}</span>
            <span className="text-xs font-semibold text-slate-500">mg / day</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Reference ceiling for pre-workout performance. Includes total intake from coffee, tea, and pre-workout.
          </p>
        </div>

        {/* Omega-3 */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Fish className="w-3.5 h-3.5 text-sky-600" /> Omega-3 Fatty Acids
            </span>
            <span className="text-[10px] font-medium text-slate-500">20–30 mg / kg</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">
              {supplements.omega3MgMin}–{supplements.omega3MgMax}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg / day</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Dietary EPA/DHA reference. Focus on whole food sources like fatty fish, flaxseeds, or walnuts.
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <span className="font-semibold text-slate-900">Disclaimer: </span>
          Supplement values are reference heuristics derived from body weight for educational purposes. They are not medical prescriptions. Always consult a healthcare professional before beginning any new supplement regimen.
        </p>
      </div>
    </div>
  );
};
