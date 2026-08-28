import React from 'react';
import { useTriage } from '../context/TriageContext';
import { EDPressureMap } from '../components/EDPressureMap';
import { StandingPreOrdersHub } from '../components/StandingPreOrdersHub';
import { LiveSafetyFeed } from '../components/LiveSafetyFeed';
import {
  Compass,
  Users,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  Bed,
  ShieldCheck
} from 'lucide-react';

export const CommandCenterPage = () => {
  const { queueData, handleToggleSurge, surgeActive, handleResetData } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];
  const totalWaiting = allPatients.length;

  const urgentCount = allPatients.filter(
    (p) => p.action_badge === 'ESCALATE' || p.action_badge === 'IMMEDIATE' || (p.risk_score || 0) >= 70
  ).length;

  const reassessCount = allPatients.filter(
    (p) => p.action_badge === 'REASSESS' || p.safety_status === 'EXPIRED' || p.is_uncertain
  ).length;

  const unattendedHighPriority = allPatients.filter(
    (p) => !p.is_attended && ((p.risk_score || 0) >= 60 || p.action_badge === 'ESCALATE' || p.action_badge === 'REASSESS')
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-cyan-700" />
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              ED COMMAND CENTER & PRESSURE OVERVIEW
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-800 border border-cyan-200">
              Charge Nurse / ED Manager
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department-wide operational safety picture &bull; Real-time bed and human attention allocation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleSurge}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              surgeActive
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{surgeActive ? 'Surge Active (60 ED)' : 'Toggle 3X Surge'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-bold uppercase text-slate-400">Total Waiting</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalWaiting}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">4 MDs &bull; 6 RNs Active</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-bold uppercase text-slate-400">Action Required</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{urgentCount + reassessCount}</div>
          <div className="text-[11px] text-rose-600 mt-0.5 font-medium">{urgentCount} immediate escalation</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-bold uppercase text-slate-400">Unattended High Priority</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{unattendedHighPriority}</div>
          <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Attention Gap Alert</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-bold uppercase text-slate-400">Average Wait Time</div>
          <div className="text-2xl font-black text-slate-800 mt-1">42 min</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Within target window</div>
        </div>
      </div>

      {/* ED Floor Pressure Map */}
      <EDPressureMap />

      {/* Pre-Orders Hub & Live Safety Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StandingPreOrdersHub />
        </div>
        <div>
          <LiveSafetyFeed />
        </div>
      </div>
    </div>
  );
};
