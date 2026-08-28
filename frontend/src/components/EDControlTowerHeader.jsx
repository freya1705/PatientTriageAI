import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Activity,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  FileCheck2,
  QrCode,
  LayoutGrid,
  Stethoscope,
  TrendingDown
} from 'lucide-react';

export const EDControlTowerHeader = () => {
  const {
    queueData,
    controlViewMode,
    setControlViewMode,
    surgeActive,
    handleToggleSurge,
    handleResetData,
    openPatientPortalCompanion
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];
  const kpis = queueData.kpis || {};
  const total = allPatients.length;

  // Counts for breakdown strip
  const lowRiskCount = allPatients.filter((p) => (p.risk_score || 0) < 25).length;
  const stableCount = allPatients.filter((p) => (p.risk_score || 0) >= 25 && (p.risk_score || 0) < 40).length;
  const watchCount = allPatients.filter((p) => (p.risk_score || 0) >= 40 && (p.risk_score || 0) < 60).length;
  const reassessCount = allPatients.filter((p) => p.action_badge === 'REASSESS' || ((p.risk_score || 0) >= 60 && (p.risk_score || 0) < 75)).length;
  const escalateCount = allPatients.filter((p) => p.action_badge === 'ESCALATE' || p.action_badge === 'IMMEDIATE' || (p.risk_score || 0) >= 75).length;
  const uncertainCount = allPatients.filter((p) => p.is_uncertain).length;

  const attentionRequiredCount = Math.max(1, reassessCount + escalateCount + uncertainCount);
  const shortestWindow = Math.min(...allPatients.map((p) => p.minutes_until_expiry ?? 13).filter((m) => m > 0), 13);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* Title & Live Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              ED SAFETY CONTROL TOWER
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-50 text-cyan-800 border border-cyan-200">
              Autonomous Surveillance Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous Attention-Gap Intelligence &bull; Deciding who needs attention, why, and what should happen next.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleToggleSurge}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              surgeActive
                ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{surgeActive ? 'Surge Active (60 ED)' : 'Toggle 3X Surge'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Reset Dataset
          </button>
        </div>
      </div>

      {/* THREE GIANT HERO NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Number 1: Total Waiting */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {total}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mt-0.5">
              Patients Waiting in ED
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>4 Active Physicians &bull; 6 Triage RNs</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Number 2: Requiring Attention */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-rose-700 tracking-tight">
              {attentionRequiredCount}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-800 mt-0.5">
              Patients Requiring Attention
            </div>
            <div className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1 font-medium">
              <AlertOctagon className="w-3 h-3 text-rose-500" />
              <span>Deteriorating or Expired Validity</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* Number 3: Shortest Safety Window */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-amber-800 tracking-tight">
              {shortestWindow} min
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mt-0.5">
              Shortest Safety Window
            </div>
            <div className="text-[11px] text-amber-700 mt-1 flex items-center space-x-1 font-medium">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Safety Clock Expiring Soon</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* LIVE SAFETY BREAKDOWN RIBBON */}
      <div className="bg-slate-900 text-white rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 px-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Census State:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
            {lowRiskCount} LOW RISK
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-emerald-300 border border-slate-700">
            {stableCount} STABLE
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700">
            {watchCount} WATCH
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
            {reassessCount} REASSESS
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-700 animate-pulse">
            {escalateCount} ESCALATE
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800">
            {uncertainCount} UNCERTAIN
          </span>
        </div>
      </div>

      {/* MULTI-VIEW WORKSPACE SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setControlViewMode('control-tower')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === 'control-tower'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-700" />
            <span>Control Tower & Stream</span>
          </button>

          <button
            onClick={() => setControlViewMode('nurse-view')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === 'nurse-view'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>Nurse View (Next 5 Mins)</span>
          </button>

          <button
            onClick={() => setControlViewMode('pressure-map')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === 'pressure-map'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-purple-600" />
            <span>ED Floor Pressure Map</span>
          </button>

          <button
            onClick={() => setControlViewMode('preorders')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === 'preorders'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Pre-Orders Hub</span>
          </button>
        </div>

        {/* Quick Patient Companion Modal trigger */}
        <button
          onClick={() => openPatientPortalCompanion('P-017')}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <QrCode className="w-4 h-4 text-cyan-700" />
          <span>Patient Transparency Companion (Mobile QR)</span>
        </button>
      </div>
    </div>
  );
};
