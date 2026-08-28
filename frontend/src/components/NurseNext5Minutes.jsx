import React from "react";
import { useTriage } from "../context/TriageContext";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  Activity,
  Zap,
  UserCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { SafetyClock } from "./SafetyClock";

export const NurseNext5Minutes = () => {
  const {
    queueData,
    viewPatientDetail,
    handleClosedLoopReassess,
    openCounterfactualModal,
    openPatientDrawer,
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];
  const topPatients = queueData.top_action_queue || allPatients.slice(0, 4);

  // Check for any patient sitting alone because attendant stepped away
  const awayPatient = allPatients.find((p) => p.attendant_away);

  // Micro-task schedule based on highest attention gap patients
  const microTasks = [
    ...(awayPatient
      ? [
          {
            timeBudget: "30 sec",
            actionTitle: "Spot-Check Unattended Waiting Patient",
            reason: `Family attendant stepped away; ${awayPatient.name} (${awayPatient.id}) sitting unmonitored`,
            patient: awayPatient,
            urgency: "HIGH",
            badgeColor: "bg-orange-50 text-orange-800 border-orange-200",
          },
        ]
      : []),
    {
      timeBudget: "90 sec",
      actionTitle: "Bedside Reassessment & O₂ Titration",
      reason: "Acute vital velocity drop (SpO₂ 91% ↓)",
      patient: topPatients[0] || allPatients[0],
      urgency: "HIGH",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      timeBudget: "60 sec",
      actionTitle: "Physician Review & Lactate Screen",
      reason: "Prolonged wait without clinical attendance",
      patient: topPatients[1] || allPatients[1],
      urgency: "MEDIUM",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      timeBudget: "45 sec",
      actionTitle: "Acquire Repeat Vitals & ECG",
      reason: "Safety Clock expired; observations stale",
      patient: topPatients[2] || allPatients[2],
      urgency: "MEDIUM",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      timeBudget: "30 sec",
      actionTitle: "Confirm Symptom Progression",
      reason: "Initial intake uncertainty; verify pain delta",
      patient: topPatients[3] || allPatients[3],
      urgency: "LOW",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
  ].filter((t) => t.patient);

  return (
    <div className="space-y-6">
      {/* View Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-blue-200 font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">
                NURSE ACTION VIEW: YOUR NEXT 5 MINUTES
              </h2>
              <p className="text-xs text-blue-200">
                Converting raw risk scores into an actionable, prioritized
                clinical workflow schedule.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-blue-950/60 px-3.5 py-2 rounded-xl border border-blue-800 text-xs">
          <Clock className="w-4 h-4 text-cyan-300" />
          <span>
            Total Time Budget: <strong>4m 45s</strong> (4 Micro-Actions)
          </span>
        </div>
      </div>

      {/* Micro-Task Cards */}
      <div className="space-y-3">
        {microTasks.map((task, idx) => {
          const p = task.patient;
          const vitals = p.latest_vitals || {};
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Column: Number & Time Budget */}
              <div className="flex items-start space-x-3.5 min-w-[240px]">
                <div className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-800 flex items-center justify-center text-sm border border-slate-200 flex-shrink-0">
                  #{idx + 1}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                      ⏱️ {task.timeBudget}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {p.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {task.actionTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient: <strong>{p.name}</strong> ({p.age}y &bull;{" "}
                    {p.chief_complaint})
                  </p>
                </div>
              </div>

              {/* Center Column: Live Parameters & Reason */}
              <div className="flex-1 min-w-[200px] space-y-1.5">
                <div className="text-xs text-slate-700 font-medium">
                  <strong>Trigger:</strong> {task.reason}
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-600">
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    SpO₂: <strong>{vitals.spo2 ?? 96}%</strong>
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    HR: <strong>{vitals.heart_rate ?? 90} bpm</strong>
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    Wait: <strong>{p.total_waiting_mins}m</strong>
                  </span>
                </div>
              </div>

              {/* Safety Clock */}
              <div className="hidden sm:block flex-shrink-0">
                <SafetyClock
                  elapsedMins={p.elapsed_since_vital || 0}
                  minutesUntilExpiry={p.minutes_until_expiry ?? 15}
                  safetyStatus={p.safety_status}
                  size="compact"
                />
              </div>

              {/* Right Column: 1-Click Action Buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleClosedLoopReassess(p.id)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute ({task.timeBudget})</span>
                </button>

                <button
                  onClick={() => openCounterfactualModal(p)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
                  title="View Counterfactual 'What If?'"
                >
                  🔮 Forecast
                </button>

                <button
                  onClick={() => viewPatientDetail(p.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Open Dossier"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
