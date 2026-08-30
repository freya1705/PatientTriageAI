import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import { ActionQueue } from '../components/ActionQueue';
import { Activity } from 'lucide-react';

export const NurseWorklist = ({ initialFilter = 'ALL' }) => {
  const { queueData, loading } = useTriage();
  const [filterMode, setFilterMode] = useState(initialFilter);

  if (loading && !queueData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading worklist…</p>
        </div>
      </div>
    );
  }

  const allPatients = queueData?.all_patients || [];

  // Count exactly 3 states
  const actNowCount = allPatients.filter(
    (p) =>
      p.action_badge === 'ESCALATE' ||
      p.action_badge === 'IMMEDIATE' ||
      p.trajectory_status === 'RAPID_DETERIORATION' ||
      p.trajectory_status === 'WORSENING' ||
      (p.risk_score || 0) >= 70 ||
      p.is_deteriorating,
  ).length;

  const recheckCount = allPatients.filter(
    (p) =>
      !(
        p.action_badge === 'ESCALATE' ||
        p.action_badge === 'IMMEDIATE' ||
        p.trajectory_status === 'RAPID_DETERIORATION' ||
        p.trajectory_status === 'WORSENING' ||
        (p.risk_score || 0) >= 70 ||
        p.is_deteriorating
      ) &&
      (p.action_badge === 'REASSESS' ||
        p.action_badge === 'WATCH' ||
        p.safety_status === 'EXPIRED' ||
        (p.minutes_until_expiry && p.minutes_until_expiry <= 5) ||
        p.is_uncertain),
  ).length;

  const safeCount = allPatients.length - (actNowCount + recheckCount);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Master Header: Title & 3 Compact Status Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            MY WORKLIST
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Patients whose risk changed while waiting.
          </p>
        </div>

        {/* ONLY 3 Compact Summary Indicators */}
        <div className="flex items-center space-x-2 text-xs font-black">
          {/* 🔴 ACT NOW */}
          <button
            onClick={() => setFilterMode(filterMode === 'ACTION_NOW' ? 'ALL' : 'ACTION_NOW')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all shadow-xs ${
              filterMode === 'ACTION_NOW'
                ? 'bg-rose-600 text-white border-rose-700 ring-2 ring-rose-200'
                : actNowCount > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                  : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>🔴 ACT NOW</span>
            <span className="font-mono text-sm">{actNowCount}</span>
          </button>

          {/* 🟡 RECHECK */}
          <button
            onClick={() => setFilterMode(filterMode === 'RECHECK' ? 'ALL' : 'RECHECK')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all shadow-xs ${
              filterMode === 'RECHECK'
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-200'
                : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>🟡 RECHECK</span>
            <span className="font-mono text-sm">{recheckCount}</span>
          </button>

          {/* 🟢 SAFE TO WAIT */}
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all shadow-xs ${
              filterMode === 'ALL'
                ? 'bg-slate-900 text-white border-slate-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>🟢 SAFE TO WAIT</span>
            <span className="font-mono text-sm">{safeCount}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Patient Action Queue */}
      <div>
        <ActionQueue filterMode={filterMode} />
      </div>
    </div>
  );
};
