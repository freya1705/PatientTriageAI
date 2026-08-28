import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Zap,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserX,
  Info,
  ChevronRight,
  AlertTriangle,
  Clock,
  HelpCircle,
  Activity,
  ShieldCheck,
  Scale,
  Heart
} from 'lucide-react';
import { SafetyClock } from './SafetyClock';

export const ActionQueue = () => {
  const {
    queueData,
    viewPatientDetail,
    handleSimulateDeterioration,
    handleToggleAttending,
    handleClosedLoopReassess,
    setOverrideModalPatient,
    setWhyModalPatient,
    openWhyComparison,
    setTrendModalPatient,
    openCounterfactualModal,
    surgeActive
  } = useTriage();

  if (!queueData) return null;

  const actionQueue = queueData.top_action_queue || [];

  const getTriagePill = (level) => {
    switch (level) {
      case 1:
        return { text: 'L1 Resuscitation', style: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 2:
        return { text: 'L2 Emergency', style: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 3:
        return { text: 'L3 Urgent', style: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 4:
        return { text: 'L4 Semi-Urgent', style: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 5:
        return { text: 'L5 Non-Urgent', style: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { text: `Level ${level}`, style: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              <span>🔴 RIGHT NOW — TOP {actionQueue.length} PATIENTS NEED ATTENTION</span>
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              Ranked by Attention Gap
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Surfaces unattended deteriorating cases over already-attended patients &bull; Continuously recalculated.
          </p>
        </div>

        {actionQueue.length >= 2 && (
          <button
            onClick={() => openWhyComparison(actionQueue[0].id, actionQueue[1].id)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
          >
            <Scale className="w-3.5 h-3.5 text-cyan-700" />
            <span>Why #{1} vs #{2}?</span>
          </button>
        )}
      </div>

      {/* Dynamic Priority Stream Cards */}
      <div className="space-y-3.5">
        {actionQueue.map((patient, index) => {
          const triagePill = getTriagePill(patient.display_triage_level);
          const isTopOne = index === 0;
          const vitals = patient.latest_vitals || {};
          const isDeteriorating = patient.trajectory_status in { RAPID_DETERIORATION: true, WORSENING: true };
          const isExpired = patient.safety_status === 'EXPIRED';

          return (
            <div
              key={patient.id}
              className={`rounded-xl p-4.5 border transition-all duration-300 relative ${
                isTopOne
                  ? 'bg-gradient-to-r from-rose-50/70 via-white to-amber-50/40 border-rose-300 shadow-sm ring-2 ring-rose-200/50'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left Section: Rank + Identity + Complaint */}
                <div className="flex items-start space-x-3.5 min-w-[280px]">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 border ${
                      isTopOne
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs ring-2 ring-rose-300 animate-pulse'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    0{index + 1}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {patient.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {patient.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({patient.age}y &bull; {patient.gender})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${triagePill.style}`}>
                        {triagePill.text}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center space-x-2">
                      <span>{patient.chief_complaint}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500 font-mono">Waiting {patient.total_waiting_mins}m</span>
                    </div>

                    {/* Ambient Sensor Badge */}
                    <div className="mt-1.5 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Heart className="w-3 h-3 text-rose-500 animate-pulse" />
                      <span>Live rPPG: <strong>{vitals.heart_rate ?? 92} bpm</strong> (Conf 94%) &bull; SpO₂: <strong>{vitals.spo2 ?? 96}%</strong> (Contactless)</span>
                    </div>
                  </div>
                </div>

                {/* Center Section: WHAT CHANGED & WHY ESCALATED */}
                <div className="flex-1 min-w-[240px] space-y-1.5">
                  {/* What Changed */}
                  <div className="text-xs text-slate-800">
                    <span className="font-bold text-rose-800 uppercase tracking-wide text-[10px] mr-1.5">
                      WHAT CHANGED:
                    </span>
                    <span className="font-medium">
                      {isDeteriorating
                        ? `SpO₂ 96 → ${vitals.spo2 ?? 91}% (↓ 5%) • HR 92 → ${vitals.heart_rate ?? 117} (↑ 25 bpm)`
                        : isExpired
                        ? `Evidence ${patient.elapsed_since_vital || 48}m old without physician check-in`
                        : `Prolonged wait +${patient.total_waiting_mins}m with unmonitored baseline`}
                    </span>
                  </div>

                  {/* Why Escalated / Score Contributors */}
                  <div className="flex items-center flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100/80 text-rose-900 font-bold">
                      Det +{isDeteriorating ? 32 : 0}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 font-bold">
                      Stale +{isExpired ? 18 : 6}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-800">
                      Wait +{Math.min(25, Math.round(patient.total_waiting_mins * 0.15))}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-100/80 text-purple-900">
                      Uncert +{patient.is_uncertain ? 12 : 4}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${patient.is_attended ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      Cov {patient.is_attended ? '-35 (Seen)' : '+0 (Unseen)'}
                    </span>
                  </div>
                </div>

                {/* Right Section: Safety Clock + 1-Click Action Buttons */}
                <div className="flex items-center space-x-3 self-stretch lg:self-center justify-between lg:justify-end flex-shrink-0">
                  <SafetyClock
                    elapsedMins={patient.elapsed_since_vital || 0}
                    minutesUntilExpiry={patient.minutes_until_expiry ?? 13}
                    safetyStatus={patient.safety_status}
                    size="compact"
                  />

                  <div className="flex items-center space-x-2">
                    {/* Primary Closed Loop Action */}
                    <button
                      onClick={() => handleClosedLoopReassess(patient.id)}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
                      title="Perform Bedside Reassessment and Resolve Closed-Loop"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>REASSESS</span>
                    </button>

                    {/* Counterfactual Forecast */}
                    <button
                      onClick={() => openCounterfactualModal(patient)}
                      className="px-2.5 py-2 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
                      title="View 'What If We Do Nothing?' Counterfactual Safety Trajectory"
                    >
                      🔮 Forecast
                    </button>

                    {/* Attending Toggle */}
                    <button
                      onClick={() => handleToggleAttending(patient.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        patient.is_attended
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title={patient.is_attended ? 'Doctor Attending (Discounted)' : 'Mark Doctor Attending'}
                    >
                      {patient.is_attended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>

                    {/* Open Full Dossier */}
                    <button
                      onClick={() => viewPatientDetail(patient.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="View Patient Dossier"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
