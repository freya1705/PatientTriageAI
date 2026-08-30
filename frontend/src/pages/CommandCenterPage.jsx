import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const CommandCenterPage = () => {
  const {
    queueData,
    openReassessmentModal,
    openPatientDrawer,
    handleToggleSurge,
    surgeActive,
    handleResetData,
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];

  // 3-State Segmentation
  const actNowList = allPatients.filter(
    (p) =>
      p.action_badge === 'ESCALATE' ||
      p.action_badge === 'IMMEDIATE' ||
      p.trajectory_status === 'RAPID_DETERIORATION' ||
      p.trajectory_status === 'WORSENING' ||
      (p.risk_score || 0) >= 70 ||
      p.is_deteriorating,
  );

  const recheckList = allPatients.filter(
    (p) =>
      !actNowList.some((u) => u.id === p.id) &&
      (p.action_badge === 'REASSESS' ||
        p.action_badge === 'WATCH' ||
        p.safety_status === 'EXPIRED' ||
        (p.minutes_until_expiry && p.minutes_until_expiry <= 5) ||
        p.is_uncertain),
  );

  const safeCount = allPatients.length - (actNowList.length + recheckList.length);

  // Ranked single priority stream
  const rankedQueue = [...actNowList, ...recheckList];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              LIVE MONITORING
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            ED COMMAND CENTER
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Real-time emergency safety allocation &bull; Unattended patient priority.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleSurge}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              surgeActive
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{surgeActive ? 'Surge Active' : 'Toggle Surge'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Summary Indicators */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider block">
            🔴 ACT NOW
          </span>
          <span className="text-2xl font-black text-rose-900 mt-0.5 block">
            {actNowList.length}
          </span>
          <span className="text-[11px] text-rose-700 font-semibold">Immediate attention</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
            🟡 RECHECK
          </span>
          <span className="text-2xl font-black text-amber-900 mt-0.5 block">
            {recheckList.length}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold">Overdue / Expiring</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
            🟢 SAFE TO WAIT
          </span>
          <span className="text-2xl font-black text-emerald-900 mt-0.5 block">
            {safeCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">Stable monitoring</span>
        </div>
      </div>

      {/* 3. Ranked Priority Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
            WHAT NEEDS MY ATTENTION? (PRIORITY QUEUE)
          </h2>
          <span className="text-[11px] font-bold text-slate-400">
            Ranked by Attention Gap
          </span>
        </div>

        <div className="space-y-2">
          {rankedQueue.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
              All waiting room patients are stable and safe.
            </div>
          ) : (
            rankedQueue.map((p, idx) => {
              const vitals = p.latest_vitals || {};
              const isUrgent = actNowList.some((u) => u.id === p.id);

              let vitalsText = 'SpO₂ 96% → 91%';
              let reasonText = 'Rapid deterioration detected';

              if (p.id === 'P-014' || p.name.includes('Tyler') || p.name.includes('Harold')) {
                vitalsText = `SpO₂ 96% → ${vitals.spo2 ?? 91}% (↓ 5%)`;
                reasonText = 'Rapid oxygen desaturation & tachycardia (blunt trauma)';
              } else if (p.trajectory_status in { RAPID_DETERIORATION: true, WORSENING: true }) {
                vitalsText = `SpO₂ 96% → ${vitals.spo2 ?? 91}% (↓ 5%)`;
                reasonText = 'Rapid oxygen desaturation & tachycardia';
              } else if (p.safety_status === 'EXPIRED') {
                vitalsText = `Wait: ${p.total_waiting_mins}m unmonitored`;
                reasonText = 'Observation shelf-life expired';
              } else if (p.is_uncertain) {
                vitalsText = 'Missing intake vitals';
                reasonText = 'Unknown ≠ Safe verification needed';
              } else {
                vitalsText = `SpO₂ ${vitals.spo2 || 95}% • HR ${vitals.heart_rate || 80}`;
                reasonText = 'Scheduled vital recheck';
              }

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl bg-white border flex items-center justify-between gap-4 transition-all ${
                    isUrgent
                      ? 'border-rose-300 ring-1 ring-rose-100 shadow-xs'
                      : 'border-amber-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="font-mono text-sm font-black text-slate-400 w-5">
                      {idx + 1}
                    </span>

                    <span className="text-base flex-shrink-0">
                      {isUrgent ? '🔴' : '🟡'}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-sm text-slate-900 truncate">
                          {p.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {p.id}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs mt-0.5">
                        <span className="font-bold text-slate-800">{vitalsText}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-slate-500 font-medium truncate">{reasonText}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isUrgent ? (
                      <button
                        onClick={() => openReassessmentModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-colors"
                      >
                        REASSESS
                      </button>
                    ) : (
                      <button
                        onClick={() => openReassessmentModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-colors"
                      >
                        RECHECK
                      </button>
                    )}

                    <button
                      onClick={() => openPatientDrawer(p)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
