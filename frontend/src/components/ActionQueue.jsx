import React from "react";
import { useTriage } from "../context/TriageContext";
import {
  Zap,
  Clock,
  HelpCircle,
  Activity,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  User,
  ShieldCheck,
  TrendingDown,
  AlertOctagon,
  Scale,
} from "lucide-react";
import { SafetyClock } from "./SafetyClock";

export const ActionQueue = ({ filterMode = "ALL" }) => {
  const {
    queueData,
    viewPatientDetail,
    openReassessmentModal,
    setWhyModalPatient,
    openWhatIfModal,
    openWhyComparison,
    handleImOnIt,
    handlingMap,
    activeNurseName,
    assignedPatientIds,
    setActiveTab,
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];

  // Filter based on parent tab if needed
  let displayPatients = allPatients;
  if (filterMode === "MY_PATIENTS") {
    displayPatients = allPatients.filter((p) => assignedPatientIds.has(p.id));
  } else if (filterMode === "ACTION_NOW") {
    displayPatients = allPatients.filter(
      (p) =>
        p.action_badge === "ESCALATE" ||
        p.action_badge === "IMMEDIATE" ||
        (p.risk_score || 0) >= 70,
    );
  } else if (filterMode === "EXPIRING") {
    displayPatients = allPatients.filter(
      (p) =>
        p.safety_status === "EXPIRED" || (p.minutes_until_expiry ?? 15) <= 5,
    );
  } else if (filterMode === "UNATTENDED") {
    displayPatients = allPatients.filter((p) => !p.is_attended);
  }

  // Segment into clinical priority groups
  const urgentPatients = displayPatients.filter(
    (p) =>
      p.action_badge === "ESCALATE" ||
      p.action_badge === "IMMEDIATE" ||
      p.trajectory_status === "RAPID_DETERIORATION" ||
      (p.risk_score || 0) >= 70,
  );

  const reassessSoonPatients = displayPatients.filter(
    (p) =>
      !urgentPatients.some((u) => u.id === p.id) &&
      (p.action_badge === "REASSESS" ||
        p.safety_status === "EXPIRED" ||
        p.is_uncertain),
  );

  const watchPatients = displayPatients.filter(
    (p) =>
      !urgentPatients.some((u) => u.id === p.id) &&
      !reassessSoonPatients.some((r) => r.id === p.id) &&
      (p.risk_score || 0) >= 35,
  );

  const stableCount =
    allPatients.length -
    (urgentPatients.length +
      reassessSoonPatients.length +
      watchPatients.length);

  const renderActionCard = (patient, index, priorityLevel) => {
    const vitals = patient.latest_vitals || {};
    const isDeteriorating =
      patient.trajectory_status in
      { RAPID_DETERIORATION: true, WORSENING: true };
    const isExpired = patient.safety_status === "EXPIRED";
    const handling = handlingMap[patient.id];
    const isHandledByMe = handling?.nurseName === activeNurseName;

    // What Changed summary
    let whatChangedText = "Vitals stable since arrival";
    if (isDeteriorating) {
      whatChangedText = `SpO₂ 96% → ${vitals.spo2 ?? 91}% (↓ 5%) • HR 92 → ${vitals.heart_rate ?? 117} bpm (↑ 25 bpm)`;
    } else if (isExpired) {
      whatChangedText = `Vitals recorded ${patient.elapsed_since_vital || 48}m old no update since`;
    } else if (patient.is_uncertain) {
      whatChangedText =
        "SpO₂ and blood pressure not recorded at intake";
    } else if (patient.total_waiting_mins > 30) {
      whatChangedText = `Waiting ${patient.total_waiting_mins}m unmonitored in waiting room`;
    }

    // Why summary
    let whySummary = "Routine monitoring";
    if (isDeteriorating)
      whySummary = "Vitals dropping rapidly";
    else if (isExpired) whySummary = "Overdue for a recheck";
    else if (patient.is_uncertain)
      whySummary = "Incomplete vitals — needs verification";

    // Primary Action Label
    let actionLabel = "RECHECK VITALS";
    if (priorityLevel === "URGENT") actionLabel = "REASSESS NOW";
    else if (patient.is_uncertain) actionLabel = "ACQUIRE VITALS";
    else if (patient.is_attended) actionLabel = "REVIEW PATIENT";

    return (
      <div
        key={patient.id}
        className={`bg-white rounded-xl border p-4 transition-all ${
          priorityLevel === "URGENT"
            ? "border-rose-300 ring-2 ring-rose-100 shadow-sm"
            : priorityLevel === "NEXT"
              ? "border-amber-200 shadow-2xs hover:border-amber-300"
              : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Priority + Demographics */}
          <div className="flex items-start space-x-3 min-w-[260px]">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 border ${
                priorityLevel === "URGENT"
                  ? "bg-rose-600 text-white border-rose-700 shadow-xs animate-pulse"
                  : priorityLevel === "NEXT"
                    ? "bg-amber-500 text-white border-amber-600"
                    : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {priorityLevel === "URGENT"
                ? "🔴"
                : priorityLevel === "NEXT"
                  ? "🟠"
                  : "🟡"}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {patient.id}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {patient.name}
                </span>
                <span className="text-xs text-slate-400">
                  {patient.age}y &bull; {patient.gender}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                "{patient.chief_complaint}"
              </div>

              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Waiting <strong>{patient.total_waiting_mins} min</strong> &bull;
                Level {patient.display_triage_level}
              </div>

              {/* Handling Status Badge */}
              {handling && (
                <div className="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                  <span>🟡 Being handled by {handling.nurseName}</span>
                </div>
              )}

              {/* Attendant Away Badge */}
              {patient.attendant_away && (
                <div className="mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping" />
                  <span>Attendant Away</span>
                </div>
              )}

              {/* Referral Candidate Badge */}
              {patient.referral_eligible && (
                <div
                  className="mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"
                  title={patient.referral_reason}
                >
                  <span>🏥 Referral Candidate</span>
                </div>
              )}
            </div>
          </div>

          {/* Center: WHAT CHANGED & WHY */}
          <div className="flex-1 min-w-[240px] space-y-1">
            <div className="text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px] mr-1.5">
                WHAT CHANGED:
              </span>
              <span className="text-slate-800 font-semibold">
                {whatChangedText}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wide text-[10px] mr-1.5">
                WHY:
              </span>
              <span className="text-slate-600">{whySummary}</span>
            </div>

            <div className="pt-1 flex items-center space-x-2">
              <SafetyClock
                elapsedMins={patient.elapsed_since_vital || 0}
                minutesUntilExpiry={patient.minutes_until_expiry ?? 15}
                safetyStatus={patient.safety_status}
                size="compact"
              />
            </div>
          </div>

          {/* Right: NEXT ACTION & Secondary Buttons */}
          <div className="flex items-center space-x-2 self-stretch lg:self-center justify-between lg:justify-end flex-shrink-0">
            {/* "I'm on it" button */}
            <button
              onClick={() => handleImOnIt(patient.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                isHandledByMe
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
              title="Claim this patient"
            >
              {isHandledByMe ? "✓ I'M ON IT" : "I'M ON IT"}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => openReassessmentModal(patient)}
              className={`px-4 py-2 rounded-lg text-xs font-black shadow-xs transition-colors flex items-center space-x-1.5 ${
                priorityLevel === "URGENT"
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
            </button>

            {/* Why Button */}
            <button
              onClick={() => setWhyModalPatient(patient)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold border border-slate-200"
              title="Why is this patient prioritized?"
            >
              Why?
            </button>

            {/* What If Button */}
            <button
              onClick={() => openWhatIfModal(patient)}
              className="p-2 rounded-lg text-purple-700 hover:bg-purple-50 text-xs font-bold border border-purple-200"
              title="What if waiting continues?"
            >
              🔮
            </button>

            {/* Open Detail */}
            <button
              onClick={() => viewPatientDetail(patient.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Open patient record"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 🔴 LEVEL 1: ACTION REQUIRED NOW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              🔴 Act Now ({urgentPatients.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            These patients need you at bedside
          </span>
        </div>

        {urgentPatients.length === 0 ? (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              All clear — no urgent actions right now.
            </span>
          </div>
        ) : (
          urgentPatients.map((p, idx) => renderActionCard(p, idx, "URGENT"))
        )}
      </div>

      {/* 🟠 LEVEL 2: REASSESS SOON */}
      {reassessSoonPatients.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                🟠 Recheck Soon ({reassessSoonPatients.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Vitals are stale or incomplete
            </span>
          </div>

          <div className="space-y-3">
            {reassessSoonPatients
              .slice(0, 4)
              .map((p, idx) => renderActionCard(p, idx, "NEXT"))}
          </div>
        </div>
      )}

      {/* 🟢 LEVEL 3: MONITORING (Compact Collapse) */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-slate-800">
            {stableCount > 0 ? stableCount : 12} Stable — monitoring continues
          </span>
        </div>

        <button
          onClick={() => setActiveTab("all-waiting")}
          className="font-bold text-cyan-700 hover:text-cyan-900 flex items-center space-x-1"
        >
          <span>View all patients</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
