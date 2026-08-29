import React, { useState } from "react";
import { useTriage } from "../context/TriageContext";
import { EDControlTowerHeader } from "../components/EDControlTowerHeader";
import { ReplaySimulationBar } from "../components/ReplaySimulationBar";
import { ActionQueue } from "../components/ActionQueue";
import { NurseNext5Minutes } from "../components/NurseNext5Minutes";
import { EDPressureMap } from "../components/EDPressureMap";
import { StandingPreOrdersHub } from "../components/StandingPreOrdersHub";
import { LiveSafetyFeed } from "../components/LiveSafetyFeed";
import { SafetySummaryPanel } from "../components/SafetySummaryPanel";
import { CounterfactualWidget } from "../components/CounterfactualWidget";
import { SafetyOutcomeModal } from "../components/SafetyOutcomeModal";
import { PatientTransparencyCompanion } from "../components/PatientTransparencyCompanion";
import { OverrideModal } from "../components/OverrideModal";
import { VitalTrendModal } from "../components/VitalTrendModal";
import { SafetyClock } from "../components/SafetyClock";
import {
  Search,
  RefreshCw,
  Eye,
  TrendingDown,
  Info,
  UserCheck,
  UserX,
  Zap,
  Activity,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  HelpCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

export const Dashboard = () => {
  const {
    queueData,
    loading,
    controlViewMode,
    fetchQueue,
    viewPatientDetail,
    setWhyModalPatient,
    setTrendModalPatient,
    setOverrideModalPatient,
    counterfactualPatient,
    setCounterfactualPatient,
    openCounterfactualModal,
    safetyOutcomeData,
    setSafetyOutcomeData,
    portalPatientId,
    setPortalPatientId,
    handleSimulateDeterioration,
    handleClosedLoopReassess,
    handleToggleAttending,
  } = useTriage();

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [failureCatFilter, setFailureCatFilter] = useState("ALL");
  const [stationFilter, setStationFilter] = useState("ALL");
  const [showRightPanel, setShowRightPanel] = useState(true);

  if (loading && !queueData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  const allPatients = queueData?.all_patients || [];

  const failureCategories = [
    { id: "ALL", label: "All Cases" },
    { id: "CAT_A", label: "Critical" },
    { id: "CAT_B", label: "Hidden Risk" },
    { id: "CAT_C", label: "Incomplete Data" },
    { id: "CAT_D", label: "Deteriorating" },
    { id: "CAT_E", label: "Unmonitored" },
  ];

  const filteredPatients = allPatients.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chief_complaint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      levelFilter === "ALL" ||
      p.display_triage_level.toString() === levelFilter;

    const matchesCategory =
      failureCatFilter === "ALL" ||
      p.failure_mode_category?.code === failureCatFilter;

    let matchesStation = true;
    if (stationFilter === "UNATTENDED") matchesStation = !p.is_attended;
    else if (stationFilter === "ATTENDED") matchesStation = p.is_attended;
    else if (stationFilter === "PEDIATRIC") matchesStation = p.age < 16;
    else if (stationFilter === "GERIATRIC") matchesStation = p.age >= 65;

    return matchesSearch && matchesLevel && matchesCategory && matchesStation;
  });

  const getTriageBadge = (level) => {
    switch (level) {
      case 1:
        return "bg-rose-50 text-rose-700 border-rose-200";
      case 2:
        return "bg-orange-50 text-orange-700 border-orange-200";
      case 3:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 4:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 5:
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. ED Control Tower Header: 3 Giant Numbers + Status Ribbon + Workspace Selector */}
      <EDControlTowerHeader />

      {/* 2. Interactive Pitch Feature: ED Replay Simulation Bar */}
      <ReplaySimulationBar />

      {/* 3. Main Switchable Workspace */}
      {controlViewMode === "nurse-view" && <NurseNext5Minutes />}

      {controlViewMode === "pressure-map" && <EDPressureMap />}

      {controlViewMode === "preorders" && <StandingPreOrdersHub />}

      {controlViewMode === "control-tower" && (
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Center Column: Live Action Priority Queue & Patient Census */}
          <div className="flex-1 w-full space-y-6 min-w-0">
            {/* Dynamic Priority Stream */}
            <ActionQueue />

            {/* Complete Emergency Patient Census Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                      All Patients ({filteredPatients.length} of{" "}
                      {allPatients.length})
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      Auto-Updated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live vitals, recheck timers, and priority scores.
                  </p>
                </div>

                <button
                  onClick={fetchQueue}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors self-start sm:self-auto"
                  title="Force Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Patient ID, Name, or Chief Complaint..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-700 focus:bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Level Filter */}
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 text-xs">
                  {["ALL", "1", "2", "3", "4", "5"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex-shrink-0 ${
                        levelFilter === lvl
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {lvl === "ALL" ? "All ESI" : `L${lvl}`}
                    </button>
                  ))}
                </div>

                {/* Station Filter */}
                <select
                  value={stationFilter}
                  onChange={(e) => setStationFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-700"
                >
                  <option value="ALL">All Stations</option>
                  <option value="UNATTENDED">Unattended Only</option>
                  <option value="ATTENDED">Attended Only</option>
                  <option value="PEDIATRIC">Children (&lt;16)</option>
                  <option value="GERIATRIC">Elderly (65+)</option>
                </select>
              </div>

              {/* Census Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Patient ID</th>
                      <th className="py-2.5 px-3">Patient</th>
                      <th className="py-2.5 px-3">Triage</th>
                      <th className="py-2.5 px-3">Recheck Timer</th>
                      <th className="py-2.5 px-3">Risk</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-8 text-center text-slate-400"
                        >
                          No patients match your active filters.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p) => {
                        const vitals = p.latest_vitals || {};
                        const isExpired = p.safety_status === "EXPIRED";
                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-slate-50/70 transition-colors group"
                          >
                            <td className="py-3 px-3 font-mono font-bold text-slate-800">
                              {p.id}
                              {p.is_overridden ? (
                                <span className="ml-1 text-[9px] text-amber-700 bg-amber-50 px-1 rounded border border-amber-200 font-sans">
                                  Override
                                </span>
                              ) : null}
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                                {p.age}y &bull; {p.gender} &bull;{" "}
                                {p.chief_complaint}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getTriageBadge(p.display_triage_level)}`}
                              >
                                Level {p.display_triage_level}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <SafetyClock
                                elapsedMins={p.elapsed_since_vital || 0}
                                minutesUntilExpiry={
                                  p.minutes_until_expiry ?? 15
                                }
                                safetyStatus={p.safety_status}
                                size="compact"
                              />
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-slate-900 font-mono">
                                  {p.risk_score}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                    p.trajectory_status ===
                                    "RAPID_DETERIORATION"
                                      ? "bg-rose-100 text-rose-800"
                                      : p.trajectory_status === "WORSENING"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {{'RAPID_DETERIORATION': 'Deteriorating', 'WORSENING': 'Worsening', 'IMPROVING': 'Improving', 'STABLE': 'Stable'}[p.trajectory_status] || p.trajectory_status}
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                SpO₂ {vitals.spo2 ?? 96}% &bull; HR{" "}
                                {vitals.heart_rate ?? 85}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-mono font-bold text-slate-900">
                                {p.action_priority_score} pts
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {p.is_attended
                                  ? "👨⚕️ Attended"
                                  : "⚠️ Unattended"}
                              </div>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => handleClosedLoopReassess(p.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                  title="Quick Reassess"
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => openCounterfactualModal(p)}
                                  className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                                  title="What-If Forecast"
                                >
                                  🔮
                                </button>

                                <button
                                  onClick={() => setWhyModalPatient(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                  title="Why this score?"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => viewPatientDetail(p.id)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Live Safety Feed Ticker + Safety Radar */}
          <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
            <LiveSafetyFeed />
            <SafetySummaryPanel />
          </div>
        </div>
      )}

      {/* Global Modals & Overlays */}
      {counterfactualPatient && (
        <CounterfactualWidget
          patient={counterfactualPatient}
          onClose={() => setCounterfactualPatient(null)}
        />
      )}

      {safetyOutcomeData && <SafetyOutcomeModal />}

      {portalPatientId && (
        <PatientTransparencyCompanion
          patientId={portalPatientId}
          onClose={() => setPortalPatientId(null)}
        />
      )}

      <OverrideModal />
      <VitalTrendModal />
    </div>
  );
};
