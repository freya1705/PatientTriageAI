import React from "react";
import { useTriage } from "../context/TriageContext";
import {
  LayoutGrid,
  Users,
  AlertOctagon,
  ShieldCheck,
  Zap,
  Activity,
  Bed,
  MapPin,
  UserX,
  UserCheck,
} from "lucide-react";

export const EDPressureMap = () => {
  const {
    queueData,
    viewPatientDetail,
    openCounterfactualModal,
    handleClosedLoopReassess,
    handleToggleAttendant,
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];

  const waitingBayPatients = allPatients.filter((p) => !p.is_attended);
  const treatmentBayPatients = allPatients.filter((p) => p.is_attended);

  const getNodeColor = (p) => {
    if (
      p.action_badge === "ESCALATE" ||
      p.action_badge === "IMMEDIATE" ||
      (p.risk_score || 0) >= 75
    ) {
      return {
        bg: "bg-rose-500 text-white ring-4 ring-rose-400/50 animate-pulse",
        border: "border-rose-600",
        label: "🔴 Escalation",
      };
    } else if (p.action_badge === "REASSESS" || p.safety_status === "EXPIRED") {
      return {
        bg: "bg-amber-500 text-white ring-2 ring-amber-300",
        border: "border-amber-600",
        label: "🟠 Reassess",
      };
    } else if (p.is_uncertain) {
      return {
        bg: "bg-purple-500 text-white",
        border: "border-purple-600",
        label: "🟣 Uncertain",
      };
    } else if ((p.risk_score || 0) >= 40) {
      return {
        bg: "bg-yellow-400 text-slate-900",
        border: "border-yellow-500",
        label: "🟡 Watch",
      };
    } else {
      return {
        bg: "bg-emerald-500 text-white",
        border: "border-emerald-600",
        label: "🟢 Stable",
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutGrid className="w-5 h-5 text-purple-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              FLOOR-WIDE ED RESOURCE & WAITING BAY PRESSURE MAP
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time spatial visualization &bull; Pinpoints deteriorating
            patients and unattended patients whose family stepped away.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-2 text-[11px] font-semibold">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Stable</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>Watch</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Expired Validity</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Critical Unattended</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Attendant Away</span>
          </span>
        </div>
      </div>

      {/* Spatial Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone 1: Main Waiting Lounge (Unattended) */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                WAITING ROOM & AMBIENT BAY ({waitingBayPatients.length}{" "}
                Patients)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              Optical rPPG + BLE Kiosk Tracking
            </span>
          </div>

          {/* Grid of Chairs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {waitingBayPatients.map((p, idx) => {
              const node = getNodeColor(p);
              return (
                <div
                  key={p.id}
                  onClick={() => viewPatientDetail(p.id)}
                  className={`bg-white border rounded-xl p-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                    p.attendant_away
                      ? "border-orange-300 ring-2 ring-orange-100"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Chair #{idx + 1}
                    </span>
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${node.bg}`}
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {p.chief_complaint}
                    </div>
                  </div>

                  {/* Attendant Away Alert / Toggle Badge */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAttendant(p.id);
                      }}
                      className={`w-full py-1 px-1.5 rounded text-[9px] font-bold flex items-center justify-center space-x-1 border transition-colors ${
                        p.attendant_away
                          ? "bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                      title={
                        p.attendant_away
                          ? "Companion is away (click to mark present)"
                          : "Companion present (click to mark away)"
                      }
                    >
                      {p.attendant_away ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping"></span>
                          <span>Attendant Away</span>
                        </>
                      ) : (
                        <span>Attendant Present</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-100">
                    <span>
                      Risk: <strong>{p.risk_score}</strong>
                    </span>
                    <span
                      className={
                        p.safety_status === "EXPIRED"
                          ? "text-rose-600 font-bold"
                          : "text-slate-500"
                      }
                    >
                      {p.total_waiting_mins}m wait
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone 2: Resuscitation & Active Treatment Bays (Attended) */}
        <div className="bg-cyan-50/50 border border-cyan-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-200">
            <div className="flex items-center space-x-2">
              <Bed className="w-4 h-4 text-cyan-800" />
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-900">
                TREATMENT BAYS ({treatmentBayPatients.length} Active)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-cyan-700">
              Physician Attended
            </span>
          </div>

          <div className="space-y-2.5">
            {treatmentBayPatients.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                No patients currently assigned to treatment bays.
              </div>
            ) : (
              treatmentBayPatients.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => viewPatientDetail(p.id)}
                  className="bg-white border border-cyan-100 rounded-lg p-3 shadow-2xs hover:border-cyan-300 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 font-bold text-cyan-800 text-xs flex items-center justify-center">
                      B{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {p.attending_physician || "Dr. Marcus Vance"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                      In Treatment
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
