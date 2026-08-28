import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  X,
  TrendingUp,
  Activity
} from 'lucide-react';

export const WhatIfWaitingModal = () => {
  const { whatIfPatient, setWhatIfPatient, openReassessmentModal } = useTriage();

  if (!whatIfPatient) return null;

  const p = whatIfPatient;
  const vitals = p.latest_vitals || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
              Decision Support & Risk Projection
            </span>
            <h2 className="text-base font-black text-slate-900 mt-1">
              What If Waiting Continues for {p.id}?
            </h2>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{p.name}</strong> ({p.age}y &bull; {p.chief_complaint})
            </p>
          </div>

          <button
            onClick={() => setWhatIfPatient(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State vs Inaction Projection */}
        <div className="space-y-3">
          {/* Current State */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] font-extrabold uppercase text-slate-400">CURRENT STATUS</div>
              <div className="font-black text-rose-700 text-sm mt-0.5">
                🔴 REASSESS REQUIRED
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                SpO₂ {vitals.spo2 ?? 91}% &bull; HR {vitals.heart_rate ?? 117} &bull; Waiting {p.total_waiting_mins}m
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] font-bold text-slate-400">CONFIDENCE</span>
              <div className="text-sm font-black text-slate-800">{p.current_confidence ?? 72}%</div>
            </div>
          </div>

          {/* If Inaction Continues */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-rose-900 font-bold">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span>If No New Evidence Is Collected (Next 20 mins):</span>
            </div>

            <ul className="space-y-1 text-rose-800 text-[11px] pl-2 list-disc list-inside">
              <li>
                <strong>Evidence Confidence:</strong> Rapidly decays below 50% as observations age.
              </li>
              <li>
                <strong>Waiting Hazard:</strong> Accumulating unmonitored hypoxemia risks clinical decompensation.
              </li>
              <li>
                <strong>Potential Concern:</strong> Patient may cross acute critical thresholds without timely notice.
              </li>
            </ul>
          </div>

          {/* If Intervened Now */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>If Reassessed Now:</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Acquiring fresh vitals resets the safety validity clock, resolves clinical uncertainty, and stabilizes triage priority.
            </p>
          </div>
        </div>

        {/* Disclaimer Callout */}
        <p className="text-[10px] text-slate-400 italic">
          * This is clinical decision support to prioritize nurse attention, not deterministic outcome prediction.
        </p>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => setWhatIfPatient(null)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>

          <button
            onClick={() => {
              const target = whatIfPatient;
              setWhatIfPatient(null);
              openReassessmentModal(target);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>REASSESS PATIENT NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
