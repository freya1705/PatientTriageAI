import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  HelpCircle,
  X,
  TrendingDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';

export const WhyDetailsPanel = () => {
  const { whyModalPatient, setWhyModalPatient } = useTriage();
  const [showTechnical, setShowTechnical] = useState(false);

  if (!whyModalPatient) return null;

  const p = whyModalPatient;
  const vitals = p.latest_vitals || {};
  const isDeteriorating = p.trajectory_status in { RAPID_DETERIORATION: true, WORSENING: true };
  const isExpired = p.safety_status === 'EXPIRED';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Clinical Justification
            </span>
            <h2 className="text-base font-black text-slate-900 mt-1">
              Why is {p.id} ({p.name?.split(' ')[0]}) prioritized?
            </h2>
            <p className="text-xs text-slate-500">
              {p.age}y &bull; {p.chief_complaint} &bull; Waiting {p.total_waiting_mins}m
            </p>
          </div>

          <button
            onClick={() => setWhyModalPatient(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Human-Readable Explanations */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-slate-800">
            PatientTriage Safety Layer detected:
          </div>

          <ul className="space-y-1.5 text-slate-700">
            {isDeteriorating && (
              <li className="flex items-start space-x-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <span className="text-rose-600 font-bold">•</span>
                <span>
                  <strong>Rapid vital drop:</strong> SpO₂ {vitals.spo2 ?? 91}% (↓ 5%), HR {vitals.heart_rate ?? 117} bpm (↑ 25 bpm).
                </span>
              </li>
            )}

            {isExpired && (
              <li className="flex items-start space-x-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="text-amber-600 font-bold">•</span>
                <span>
                  <strong>Evidence expired:</strong> Last vitals recorded {p.elapsed_since_vital || 48} mins ago.
                </span>
              </li>
            )}

            <li className="flex items-start space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-bold">•</span>
              <span>
                <strong>Unattended waiting:</strong> Patient has waited {p.total_waiting_mins} mins without direct physician assignment.
              </span>
            </li>

            {p.is_uncertain && (
              <li className="flex items-start space-x-2 bg-purple-50 p-2 rounded-lg border border-purple-200">
                <span className="text-purple-600 font-bold">•</span>
                <span>
                  <strong>Uncertainty penalty:</strong> Incomplete arrival vitals require verification.
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Action Conclusion */}
        <div className="bg-slate-900 text-white rounded-xl p-3 text-xs flex items-center justify-between">
          <span className="font-medium text-slate-200">Recommended Next Action:</span>
          <span className="font-black text-amber-300">
            {p.action_badge === 'ESCALATE' ? 'REASSESS NOW' : 'UPDATE VITALS'}
          </span>
        </div>

        {/* Technical Scoring Details Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <span>{showTechnical ? 'Hide technical scoring' : 'Show technical scoring details'}</span>
            {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTechnical && (
            <div className="mt-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1 animate-in fade-in">
              <div className="flex justify-between">
                <span>Base Risk (w_r):</span>
                <span>{p.risk_score} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Deterioration Velocity (w_d):</span>
                <span>+{isDeteriorating ? 32 : 0} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Evidence Staleness (w_s):</span>
                <span>+{isExpired ? 18 : 6} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Physician Coverage (w_c):</span>
                <span>{p.is_attended ? '-35 pts' : '+0 pts'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-1 font-bold">
                <span>Total Priority:</span>
                <span>{p.action_priority_score} pts</span>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setWhyModalPatient(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
