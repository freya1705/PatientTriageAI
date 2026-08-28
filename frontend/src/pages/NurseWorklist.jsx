import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import { ActionQueue } from '../components/ActionQueue';
import { LiveSafetyFeed } from '../components/LiveSafetyFeed';
import { ReassessmentModal } from '../components/ReassessmentModal';
import { WhyDetailsPanel } from '../components/WhyDetailsPanel';
import { WhatIfWaitingModal } from '../components/WhatIfWaitingModal';
import { SafetyOutcomeModal } from '../components/SafetyOutcomeModal';
import { WhyComparisonModal } from '../components/WhyComparisonModal';
import { PatientTransparencyCompanion } from '../components/PatientTransparencyCompanion';
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Filter,
  UserCheck,
  Zap,
  Radio
} from 'lucide-react';

export const NurseWorklist = ({ initialFilter = 'ALL' }) => {
  const {
    queueData,
    loading,
    fetchQueue,
    activeNurseName,
    whyComparisonPair,
    setWhyComparisonPair,
    portalPatientId,
    setPortalPatientId,
    safetyOutcomeData
  } = useTriage();

  const [filterMode, setFilterMode] = useState(initialFilter);
  const [quickSearch, setQuickSearch] = useState('');

  if (loading && !queueData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading live nurse worklist...</p>
        </div>
      </div>
    );
  }

  const allPatients = queueData?.all_patients || [];
  const totalWaiting = allPatients.length;

  const urgentCount = allPatients.filter(
    (p) => p.action_badge === 'ESCALATE' || p.action_badge === 'IMMEDIATE' || (p.risk_score || 0) >= 70
  ).length;

  const reassessCount = allPatients.filter(
    (p) => p.action_badge === 'REASSESS' || p.safety_status === 'EXPIRED' || p.is_uncertain
  ).length;

  const expiringCount = allPatients.filter(
    (p) => p.safety_status === 'EXPIRED' || (p.minutes_until_expiry ?? 15) <= 5
  ).length;

  const actionNeededTotal = urgentCount + reassessCount;

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Header & Live Shift Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              MY WORKLIST
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
              Shift: {activeNurseName}
            </span>
          </div>

          <div className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
            <span>
              <strong>{totalWaiting}</strong> patients currently waiting
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-rose-600 font-bold">
              {actionNeededTotal} actions require attention
            </span>
          </div>
        </div>

        {/* Compact Status Ribbon */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>WAITING: <strong>{totalWaiting}</strong></span>
          </div>

          <div className="bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-800 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>ACTION NEEDED: <strong>{actionNeededTotal}</strong></span>
          </div>

          <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-amber-800 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>EXPIRING: <strong>{expiringCount}</strong></span>
          </div>

          <div className="bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-900 flex items-center space-x-1.5 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-rose-700" />
            <span>ESCALATE: <strong>{urgentCount}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Fast Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Actions' },
            { id: 'ACTION_NOW', label: `Action Now (${urgentCount})` },
            { id: 'MY_PATIENTS', label: 'My Patients' },
            { id: 'EXPIRING', label: `Expiring (${expiringCount})` },
            { id: 'UNATTENDED', label: 'Unattended Only' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                filterMode === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {actionNeededTotal >= 2 && (
          <button
            onClick={() => {
              const p1 = allPatients[0]?.id;
              const p2 = allPatients[1]?.id;
              if (p1 && p2) setWhyComparisonPair([p1, p2]);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors self-start sm:self-auto"
          >
            Why #1 vs #2?
          </button>
        )}
      </div>

      {/* 3. Main Workspace: Action Queue + Live Safety Feed */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Center: Action Queue */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          <ActionQueue filterMode={filterMode} />
        </div>

        {/* Right Column: Live Safety Feed */}
        <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
          <LiveSafetyFeed />
        </div>
      </div>

      {/* 4. Global Modals */}
      <ReassessmentModal />
      <WhyDetailsPanel />
      <WhatIfWaitingModal />
      {safetyOutcomeData && <SafetyOutcomeModal />}

      {whyComparisonPair && (
        <WhyComparisonModal
          p1Id={whyComparisonPair[0]}
          p2Id={whyComparisonPair[1]}
          onClose={() => setWhyComparisonPair(null)}
        />
      )}

      {portalPatientId && (
        <PatientTransparencyCompanion
          patientId={portalPatientId}
          onClose={() => setPortalPatientId(null)}
        />
      )}
    </div>
  );
};
