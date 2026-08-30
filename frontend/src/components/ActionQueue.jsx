import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const ActionQueue = ({ filterMode = 'ALL' }) => {
  const {
    queueData,
    openReassessmentModal,
    openPatientDrawer,
    handleImOnIt,
    handlingMap,
    activeNurseName,
    assignedPatientIds,
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];

  // Filter based on parent tab if needed
  let displayPatients = allPatients;
  if (filterMode === 'MY_PATIENTS') {
    displayPatients = allPatients.filter((p) => assignedPatientIds.has(p.id));
  } else if (filterMode === 'ACTION_NOW') {
    displayPatients = allPatients.filter(
      (p) =>
        p.action_badge === 'ESCALATE' ||
        p.action_badge === 'IMMEDIATE' ||
        p.action_badge === 'REASSESS' ||
        p.trajectory_status === 'RAPID_DETERIORATION' ||
        (p.risk_score || 0) >= 70,
    );
  } else if (filterMode === 'EXPIRING' || filterMode === 'RECHECK') {
    displayPatients = allPatients.filter(
      (p) =>
        p.safety_status === 'EXPIRED' ||
        (p.minutes_until_expiry && p.minutes_until_expiry <= 5) ||
        p.action_badge === 'WATCH' ||
        p.is_uncertain,
    );
  } else if (filterMode === 'UNATTENDED') {
    displayPatients = allPatients.filter((p) => !p.is_attended);
  }

  // 3-State Segmentation: ACT NOW, RECHECK, SAFE TO WAIT
  const actNowList = displayPatients.filter(
    (p) =>
      p.action_badge === 'ESCALATE' ||
      p.action_badge === 'IMMEDIATE' ||
      p.trajectory_status === 'RAPID_DETERIORATION' ||
      p.trajectory_status === 'WORSENING' ||
      (p.risk_score || 0) >= 70 ||
      p.is_deteriorating,
  );

  const recheckList = displayPatients.filter(
    (p) =>
      !actNowList.some((u) => u.id === p.id) &&
      (p.action_badge === 'REASSESS' ||
        p.action_badge === 'WATCH' ||
        p.safety_status === 'EXPIRED' ||
        (p.minutes_until_expiry && p.minutes_until_expiry <= 5) ||
        p.is_uncertain),
  );

  const safeList = displayPatients.filter(
    (p) =>
      !actNowList.some((u) => u.id === p.id) &&
      !recheckList.some((r) => r.id === p.id),
  );

  const renderPatientRow = (patient, stateType, rankIndex = null) => {
    const vitals = patient.latest_vitals || {};
    const handling = handlingMap[patient.id];
    const isHandled = !!handling;
    const isHandledByMe = handling?.nurseName === activeNurseName;

    // Clinically consistent scenario data
    let changeVitals = 'Vitals stable since arrival';
    let deltaSub = null;
    let aiSignal = 'Routine baseline surveillance';
    let criticality = 'ROUTINE';

    if (patient.id === 'P-014' || patient.name.includes('Tyler') || patient.name.includes('Harold')) {
      changeVitals = `SpO₂ 96% → ${vitals.spo2 ?? 91}%`;
      deltaSub = `↓ ${96 - (vitals.spo2 ?? 91)}% • HR 92 → ${vitals.heart_rate ?? 127} bpm (↑ 35)`;
      aiSignal = 'Rapid oxygen desaturation following blunt trauma';
      criticality = 'HIGH';
    } else if (patient.trajectory_status in { RAPID_DETERIORATION: true, WORSENING: true } || (patient.risk_score || 0) >= 70) {
      changeVitals = `SpO₂ 96% → ${vitals.spo2 ?? 91}%`;
      deltaSub = `↓ ${96 - (vitals.spo2 ?? 91)}% • HR 90 → ${vitals.heart_rate ?? 118} bpm (↑ 28)`;
      aiSignal = 'Acute physiological velocity shift detected';
      criticality = 'HIGH';
    } else if (patient.safety_status === 'EXPIRED') {
      changeVitals = `Vitals recorded ${patient.elapsed_since_vital || 48}m ago`;
      deltaSub = 'Shelf-life expired • Recheck due';
      aiSignal = 'Unmonitored observation window expired';
      criticality = 'MODERATE';
    } else if (patient.is_uncertain) {
      changeVitals = 'Missing baseline intake vitals';
      deltaSub = 'Unknown ≠ Safe penalty active';
      aiSignal = 'Incomplete physiological data';
      criticality = 'MODERATE';
    } else if (patient.total_waiting_mins > 30) {
      changeVitals = `Waiting ${patient.total_waiting_mins}m in lounge`;
      deltaSub = 'Attendant away spot-check';
      aiSignal = 'Prolonged unattended wait';
      criticality = 'LOW';
    }

    return (
      <div
        key={patient.id}
        className={`bg-white rounded-xl border p-4 transition-all duration-150 ${
          stateType === 'ACT_NOW'
            ? 'border-rose-300 ring-2 ring-rose-50 shadow-xs'
            : stateType === 'RECHECK'
              ? 'border-amber-200 shadow-2xs hover:border-amber-300'
              : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* 1. Left: Severity & Patient Identity */}
          <div className="flex items-start space-x-3 min-w-[250px]">
            {/* Rank or Dot Indicator */}
            {stateType === 'ACT_NOW' && rankIndex !== null ? (
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                #{rankIndex + 1}
              </div>
            ) : (
              <div className="mt-1 flex-shrink-0">
                {stateType === 'RECHECK' && (
                  <span className="inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                )}
                {stateType === 'SAFE' && (
                  <span className="inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                )}
              </div>
            )}

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-slate-900 truncate">
                  {patient.name}
                </h4>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {patient.age}y {patient.gender === 'Female' ? 'F' : 'M'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span className="font-mono font-bold text-slate-700">{patient.id}</span>
                <span>&bull;</span>
                <span className="font-semibold text-slate-600">
                  Level {patient.display_triage_level || patient.triage_level}
                </span>
                {criticality === 'HIGH' && (
                  <span className="px-1.5 py-0.2 rounded font-black text-[9px] bg-rose-100 text-rose-800 border border-rose-200">
                    Criticality: HIGH
                  </span>
                )}
                {patient.attendant_away && (
                  <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px]">
                    Away
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 truncate max-w-[220px]">
                {patient.chief_complaint}
              </p>
            </div>
          </div>

          {/* 2. Center: Clinically Important Change */}
          <div className="flex-1 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 md:pl-4 pt-2 md:pt-0">
            <div className="flex items-baseline space-x-2">
              <span className="text-xs font-black text-slate-900">
                {changeVitals}
              </span>
              {deltaSub && (
                <span
                  className={`text-[11px] font-bold ${
                    stateType === 'ACT_NOW'
                      ? 'text-rose-600'
                      : stateType === 'RECHECK'
                        ? 'text-amber-700'
                        : 'text-slate-500'
                  }`}
                >
                  {deltaSub}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
              <span className="font-bold uppercase tracking-wider text-[9px] text-slate-400">
                AI SIGNAL:
              </span>
              <span className="font-semibold text-slate-700 truncate">{aiSignal}</span>
            </div>
          </div>

          {/* 3. Right: Single Primary Action + Claim Ownership */}
          <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0 pt-2 md:pt-0">
            {/* "I'm on it" Claim Ownership Button */}
            <button
              onClick={() => handleImOnIt(patient.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isHandled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Claim alert ownership"
            >
              {isHandled
                ? `🟢 CLAIMED — ${handling.nurseName || activeNurseName}`
                : "I'm on it"}
            </button>

            {/* ONE Primary Action Button */}
            {stateType === 'ACT_NOW' && (
              <button
                onClick={() => openReassessmentModal(patient)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>REASSESS NOW</span>
              </button>
            )}

            {stateType === 'RECHECK' && (
              <button
                onClick={() => openReassessmentModal(patient)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center space-x-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>RECHECK</span>
              </button>
            )}

            {stateType === 'SAFE' && (
              <button
                onClick={() => openPatientDrawer(patient)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>VIEW</span>
              </button>
            )}

            {/* Secondary Details Link */}
            <button
              onClick={() => openPatientDrawer(patient)}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Open Details Drawer"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 🔴 SECTION 1: ACT NOW (Ranked Priority Queue) */}
      {actNowList.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-900">
              🔴 ACT NOW &bull; {actNowList.length} Patients Not Safe to Wait (Ranked)
            </h3>
          </div>
          <div className="space-y-2">
            {actNowList.map((p, idx) => renderPatientRow(p, 'ACT_NOW', idx))}
          </div>
        </div>
      )}

      {/* 🟡 SECTION 2: RECHECK */}
      {recheckList.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
              🟡 RECHECK SOON &bull; {recheckList.length} Patients Overdue / Expiring
            </h3>
          </div>
          <div className="space-y-2">
            {recheckList.map((p) => renderPatientRow(p, 'RECHECK'))}
          </div>
        </div>
      )}

      {/* 🟢 SECTION 3: SAFE TO WAIT */}
      {safeList.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
              🟢 SAFE TO WAIT &bull; {safeList.length} Patients Stable
            </h3>
          </div>
          <div className="space-y-2">
            {safeList.map((p) => renderPatientRow(p, 'SAFE'))}
          </div>
        </div>
      )}

      {allPatients.length === 0 && (
        <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
          No patients waiting in queue.
        </div>
      )}
    </div>
  );
};
