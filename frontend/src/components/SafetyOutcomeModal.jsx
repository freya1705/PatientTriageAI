import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  CheckCircle2,
  Clock,
  TrendingDown,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCheck2,
  X
} from 'lucide-react';

export const SafetyOutcomeModal = () => {
  const { safetyOutcomeData, setSafetyOutcomeData } = useTriage();

  if (!safetyOutcomeData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Closed-Loop Safety Outcome
              </span>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                Clinical Intervention Completed
              </h2>
            </div>
          </div>

          <button
            onClick={() => setSafetyOutcomeData(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{safetyOutcomeData.title || '✓ Reassessment Recorded'}</span>
          </div>
          <p className="text-emerald-800">
            {safetyOutcomeData.message}
          </p>
        </div>

        {/* Before vs After Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Before */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              BEFORE ACTION
            </div>
            <div className="text-2xl font-black text-rose-700">
              Risk {safetyOutcomeData.before_risk}
            </div>
            <div className="text-xs font-mono text-slate-600">
              {safetyOutcomeData.before_vitals}
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
              Escalation Queue
            </span>
          </div>

          {/* After */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
              AFTER ACTION
            </div>
            <div className="text-2xl font-black text-emerald-700">
              Risk {safetyOutcomeData.after_risk}
            </div>
            <div className="text-xs font-mono text-slate-600">
              {safetyOutcomeData.after_vitals}
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
              🟢 {safetyOutcomeData.new_status || 'Stabilized'}
            </span>
          </div>
        </div>

        {/* Response Metrics */}
        <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>
              Time to Intervention: <strong className="text-cyan-300 font-mono">{safetyOutcomeData.time_to_intervention || '3m 42s'}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-emerald-400 font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-{safetyOutcomeData.risk_reduction_points || '29'} pts</span>
          </div>
        </div>

        {/* Footer & Dismiss */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Recorded by: {safetyOutcomeData.actor || 'RN Sarah Chen'} &bull; Audit Ledger Updated
          </span>
          <button
            onClick={() => setSafetyOutcomeData(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
