import React from "react";
import { useTriage } from "../context/TriageContext";
import {
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
} from "lucide-react";

export const EDControlTowerHeader = () => {
  const {
    queueData,
    controlViewMode,
    setControlViewMode,
    surgeActive,
    handleToggleSurge,
    handleResetData,
    openPatientPortalCompanion,
    incomingEmsList,
    handlePreallocateBay,
  } = useTriage();

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];
  const kpis = queueData.kpis || {};
  const total = allPatients.length;

  // Counts for breakdown strip
  const lowRiskCount = allPatients.filter(
    (p) => (p.risk_score || 0) < 25,
  ).length;
  const stableCount = allPatients.filter(
    (p) => (p.risk_score || 0) >= 25 && (p.risk_score || 0) < 40,
  ).length;
  const watchCount = allPatients.filter(
    (p) => (p.risk_score || 0) >= 40 && (p.risk_score || 0) < 60,
  ).length;
  const reassessCount = allPatients.filter(
    (p) =>
      p.action_badge === "REASSESS" ||
      ((p.risk_score || 0) >= 60 && (p.risk_score || 0) < 75),
  ).length;
  const escalateCount = allPatients.filter(
    (p) =>
      p.action_badge === "ESCALATE" ||
      p.action_badge === "IMMEDIATE" ||
      (p.risk_score || 0) >= 75,
  ).length;
  const uncertainCount = allPatients.filter((p) => p.is_uncertain).length;

  const attentionRequiredCount = Math.max(
    1,
    reassessCount + escalateCount + uncertainCount,
  );
  const shortestWindow = Math.min(
    ...allPatients
      .map((p) => p.minutes_until_expiry ?? 13)
      .filter((m) => m > 0),
    13,
  );

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
              ED CONTROL TOWER
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-50 text-cyan-800 border border-cyan-200">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Who needs attention, why, and what to do next.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleToggleSurge}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              surgeActive
                ? "bg-amber-600 text-white border-amber-600 hover:bg-amber-700 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {surgeActive ? "Surge On (60 pts)" : "Surge Mode"}
            </span>
          </button>

          <button
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* 108 EMS PRE-ARRIVAL BANNER */}
      {incomingEmsList && incomingEmsList.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/95 via-slate-900 to-red-950/95 text-white border border-red-500/40 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-red-300">
                🚨 Incoming Ambulance ({incomingEmsList.length} en route)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Auto-Triage Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomingEmsList.map((ems) => (
              <div
                key={ems.id}
                className="bg-slate-900/90 border border-red-500/30 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase">
                        ETA: {ems.eta_mins} MINS
                      </span>
                      <span className="text-xs font-bold text-white">
                        {ems.ambulance_unit}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">
                      {ems.patient_name} ({ems.age}y {ems.gender}) —{" "}
                      <span className="text-red-300 font-bold">
                        {ems.chief_complaint}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-700">
                      Level {ems.precomputed_triage_level} (
                      {ems.precomputed_category})
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 rounded-lg p-2 text-[11px] font-mono text-slate-300 flex items-center justify-between gap-2">
                  <span>
                    SpO₂:{" "}
                    <strong
                      className={
                        ems.vitals.spo2 < 93 ? "text-red-400" : "text-slate-200"
                      }
                    >
                      {ems.vitals.spo2}%
                    </strong>
                  </span>
                  <span>
                    HR:{" "}
                    <strong
                      className={
                        ems.vitals.heart_rate > 100
                          ? "text-red-400"
                          : "text-slate-200"
                      }
                    >
                      {ems.vitals.heart_rate} bpm
                    </strong>
                  </span>
                  <span>
                    BP:{" "}
                    <strong>
                      {ems.vitals.systolic_bp}/{ems.vitals.diastolic_bp}
                    </strong>
                  </span>
                  <span>
                    RR: <strong>{ems.vitals.resp_rate}</strong>
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 italic line-clamp-2">
                  "{ems.paramedic_notes}"
                </p>

                <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                  <div className="text-xs text-amber-300 font-medium">
                    {ems.pre_allocated_bay ? (
                      <span className="text-emerald-400 font-bold">
                        ✓ Reserved: {ems.pre_allocated_bay}
                      </span>
                    ) : (
                      <span>Recommended: Resus Bay 1</span>
                    )}
                  </div>

                  {!ems.pre_allocated_bay ? (
                    <button
                      onClick={() =>
                        handlePreallocateBay(ems.id, "Resuscitation Bay 1")
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center space-x-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Reserve Bay</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                      Bay Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THREE GIANT HERO NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Number 1: Total Waiting */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {total}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mt-0.5">
              Patients Waiting
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>4 Doctors &bull; 6 Nurses</span>
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
              Need Attention
            </div>
            <div className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1 font-medium">
              <AlertOctagon className="w-3 h-3 text-rose-500" />
              <span>Vitals dropping or overdue</span>
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
              Next Recheck Due
            </div>
            <div className="text-[11px] text-amber-700 mt-1 flex items-center space-x-1 font-medium">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Soonest recheck timer</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* LIVE CENSUS RIBBON — 3 Actionable Groups */}
      {(() => {
        const actNowCount = escalateCount + reassessCount;
        const recheckCount = watchCount + uncertainCount;
        const stableTotal = lowRiskCount + stableCount;
        const capacityPct = queueData?.capacity_pressure_percent ?? 0;

        return (
          <div className="space-y-2">
            {/* Three action group pills */}
            <div className="grid grid-cols-3 gap-2">
              {/* 🔴 Act Now */}
              <div
                className={`rounded-xl p-3 border flex items-center justify-between ${
                  actNowCount > 0
                    ? "bg-rose-50 border-rose-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div
                    className={`text-2xl font-black tracking-tight ${
                      actNowCount > 0 ? "text-rose-700" : "text-slate-400"
                    }`}
                  >
                    {actNowCount}
                  </div>
                  <div
                    className={`text-[10px] font-extrabold uppercase tracking-wide mt-0.5 ${
                      actNowCount > 0 ? "text-rose-800" : "text-slate-500"
                    }`}
                  >
                    🔴 Act Now
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Urgent + Recheck
                  </div>
                </div>
                {actNowCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping self-start mt-1" />
                )}
              </div>

              {/* 🟡 Recheck Soon */}
              <div
                className={`rounded-xl p-3 border flex items-center justify-between ${
                  recheckCount > 0
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div
                    className={`text-2xl font-black tracking-tight ${
                      recheckCount > 0 ? "text-amber-700" : "text-slate-400"
                    }`}
                  >
                    {recheckCount}
                  </div>
                  <div
                    className={`text-[10px] font-extrabold uppercase tracking-wide mt-0.5 ${
                      recheckCount > 0 ? "text-amber-800" : "text-slate-500"
                    }`}
                  >
                    🟡 Recheck Soon
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Watch + Incomplete
                  </div>
                </div>
              </div>

              {/* 🟢 Stable */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-emerald-700 tracking-tight">
                    {stableTotal}
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 mt-0.5">
                    🟢 Stable
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Monitoring only
                  </div>
                </div>
              </div>
            </div>

            {/* ED Pressure Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
                ED Load
              </span>
              <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    capacityPct >= 80
                      ? "bg-rose-500"
                      : capacityPct >= 55
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(capacityPct, 100)}%` }}
                />
              </div>
              <span
                className={`text-[11px] font-black shrink-0 ${
                  capacityPct >= 80
                    ? "text-rose-600"
                    : capacityPct >= 55
                      ? "text-amber-600"
                      : "text-emerald-600"
                }`}
              >
                {capacityPct}%
              </span>
            </div>
          </div>
        );
      })()}

      {/* MULTI-VIEW WORKSPACE SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setControlViewMode("control-tower")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === "control-tower"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-700" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setControlViewMode("nurse-view")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === "nurse-view"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>Nurse Tasks</span>
          </button>

          <button
            onClick={() => setControlViewMode("pressure-map")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === "pressure-map"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-purple-600" />
            <span>Floor Map</span>
          </button>

          <button
            onClick={() => setControlViewMode("preorders")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              controlViewMode === "preorders"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Lab Orders</span>
          </button>
        </div>

        {/* Quick Patient Companion Modal trigger */}
        <button
          onClick={() => openPatientPortalCompanion("P-017")}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <QrCode className="w-4 h-4 text-cyan-700" />
          <span>Patient QR Portal</span>
        </button>
      </div>
    </div>
  );
};
