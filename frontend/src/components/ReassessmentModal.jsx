import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Activity,
  Heart,
  ShieldCheck,
  CheckCircle2,
  X,
  Zap,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const ReassessmentModal = () => {
  const {
    reassessmentTargetPatient,
    closeReassessmentModal,
    handleClosedLoopReassess,
    activeNurseName
  } = useTriage();

  const [spo2, setSpo2] = useState(97);
  const [hr, setHr] = useState(101);
  const [sbp, setSbp] = useState(94);
  const [temp, setTemp] = useState(37.1);
  const [notes, setNotes] = useState('Bedside reassessment completed. Supplemental oxygen administered.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reassessmentTargetPatient) return null;

  const p = reassessmentTargetPatient;
  const vitals = p.latest_vitals || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleClosedLoopReassess(p.id, Number(spo2), Number(hr), Number(sbp));
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                Bedside Reassessment
              </span>
              <span className="font-mono text-xs font-bold text-slate-400">
                {p.id}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-1">
              Recheck Vitals & Recalculate State
            </h2>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{p.name}</strong> ({p.age}y &bull; {p.chief_complaint})
            </p>
          </div>

          <button
            onClick={closeReassessmentModal}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State vs Reassessment Target */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Detected Trigger:</span>
            <div className="font-bold text-rose-700 mt-0.5">
              SpO₂ {vitals.spo2 ?? 91}% &bull; HR {vitals.heart_rate ?? 127} bpm
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400">Clinician:</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {activeNurseName}
            </div>
          </div>
        </div>

        {/* Reassessment Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* SpO2 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>SpO₂ (%)</span>
                <span className="text-[10px] font-normal text-emerald-600 font-mono">Target &gt; 94%</span>
              </label>
              <input
                type="number"
                min="70"
                max="100"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>

            {/* Heart Rate */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Heart Rate (bpm)</span>
                <span className="text-[10px] font-normal text-slate-500 font-mono">Normal 60-100</span>
              </label>
              <input
                type="number"
                min="40"
                max="220"
                value={hr}
                onChange={(e) => setHr(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>

            {/* SBP */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="60"
                max="240"
                value={sbp}
                onChange={(e) => setSbp(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>

            {/* Temp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                min="34.0"
                max="42.0"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Clinical Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Intervention Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={closeReassessmentModal}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Recalculating...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SAVE REASSESSMENT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
