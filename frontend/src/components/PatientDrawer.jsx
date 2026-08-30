import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  X,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingDown,
  UserCheck,
} from 'lucide-react';

export const PatientDrawer = () => {
  const {
    drawerPatient,
    setDrawerPatient,
    openReassessmentModal,
    handleImOnIt,
    handlingMap,
    activeNurseName,
  } = useTriage();

  if (!drawerPatient) return null;

  const p = drawerPatient;
  const vitals = p.latest_vitals || {};
  const isHandled = handlingMap[p.id]?.nurseName === activeNurseName;

  const isDeteriorating =
    p.trajectory_status in { RAPID_DETERIORATION: true, WORSENING: true } ||
    (p.risk_score || 0) >= 70;
  const isExpired = p.safety_status === 'EXPIRED';

  const handleClose = () => {
    setDrawerPatient(null);
  };

  // Sparkline data points based on vitals
  const trendPoints = [
    { time: '-15m', spo2: 96, hr: 92 },
    { time: '-10m', spo2: 94, hr: 95 },
    { time: '-5m', spo2: vitals.spo2 ? Math.min(92, vitals.spo2 + 4) : 88, hr: 104 },
    { time: 'Now', spo2: vitals.spo2 ?? 78, hr: vitals.heart_rate ?? 101 },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* 1. Header: Patient Identity */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              PATIENT DOSSIER
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
              <span className="font-mono text-xs font-bold text-slate-500">
                {p.id} &bull; {p.age}y {p.gender === 'Female' ? 'F' : 'M'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {p.chief_complaint}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* CURRENT STATUS GRID */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              CURRENT STATUS
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">SpO₂</span>
                <span
                  className={`text-base font-black ${
                    (vitals.spo2 ?? 98) < 92 ? 'text-rose-600 font-extrabold' : 'text-slate-900'
                  }`}
                >
                  {vitals.spo2 ?? 78}%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">HEART RATE</span>
                <span
                  className={`text-base font-black ${
                    (vitals.heart_rate ?? 75) > 100 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {vitals.heart_rate ?? 101} <span className="text-[10px] font-normal text-slate-400">bpm</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">BLOOD PRESS.</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">
                  {vitals.systolic_bp || 92}/{vitals.diastolic_bp || 54}
                </span>
              </div>
            </div>
          </div>

          {/* VITAL TREND SPARKLINE */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">PHYSIOLOGICAL TREND</span>
              <span className="text-rose-600 font-mono">SpO₂ ↓ 18% (15m)</span>
            </div>

            {/* Visual Sparkline Bar Representation */}
            <div className="flex items-end justify-between h-14 pt-2 px-2 gap-2 border-b border-slate-200 pb-1">
              {trendPoints.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono font-bold text-slate-500">{pt.spo2}%</span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      pt.spo2 < 90 ? 'bg-rose-500' : pt.spo2 < 95 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ height: `${Math.max(12, (pt.spo2 - 60) * 1.5)}px` }}
                  />
                  <span className="text-[9px] text-slate-400">{pt.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI SAFETY SIGNAL */}
          <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-rose-800 text-xs font-black uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              <span>AI SAFETY SIGNAL</span>
            </div>
            <p className="text-xs font-bold text-rose-950 leading-relaxed">
              {isDeteriorating
                ? 'Rapid oxygen desaturation: SpO₂ dropped from 96% down to 78% with tachycardia (HR 101 bpm).'
                : isExpired
                  ? 'Observation shelf-life expired (48m wait without updated bedside check).'
                  : 'Stable physiological trajectory. Continue routine queue monitoring.'}
            </p>
          </div>

          {/* RECOMMENDED ACTION */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              RECOMMENDED ACTION
            </span>
            <p className="text-xs font-bold leading-relaxed">
              {isDeteriorating
                ? 'Reassess immediately at bedside & titrate supplemental oxygen to target SpO₂ ≥ 94%.'
                : isExpired
                  ? 'Perform 60-second bedside vital verification round.'
                  : 'Maintain routine waiting surveillance.'}
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Model Confidence:</span>
              <span className="font-bold text-emerald-400">HIGH (98.4%)</span>
            </div>
          </div>

          {/* AUDIT TRAIL EXCERPT */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              AUDIT TRAIL
            </span>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] leading-relaxed">
              • Initial intake: ESI Level {p.triage_level} at 10:00 AM<br />
              • Ambient surveillance flag: Vital velocity spike detected<br />
              • Priority elevated: Rank #1 under Attention Gap rule
            </p>
          </div>
        </div>

        {/* 3. Footer Action Buttons */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center space-x-3">
          <button
            onClick={() => {
              handleClose();
              openReassessmentModal(p);
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>REASSESS BEDSIDE</span>
          </button>

          <button
            onClick={() => {
              handleImOnIt(p.id);
              handleClose();
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
              isHandled
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isHandled ? '✓ Claimed' : 'Mark Handled'}
          </button>
        </div>
      </div>
    </>
  );
};
