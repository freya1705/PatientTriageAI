import React, { useState } from "react";
import { useTriage } from "../context/TriageContext";
import { ActionQueue } from "../components/ActionQueue";
import { LiveSafetyFeed } from "../components/LiveSafetyFeed";
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
  Radio,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

export const NurseWorklist = ({ initialFilter = "ALL" }) => {
  const {
    queueData,
    loading,
    fetchQueue,
    activeNurseName,
  } = useTriage();

  const [filterMode, setFilterMode] = useState(initialFilter);
  const [quickSearch, setQuickSearch] = useState("");
  const [showLiveFeed, setShowLiveFeed] = useState(true);

  if (loading && !queueData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">
            Loading your worklist…
          </p>
        </div>
      </div>
    );
  }

  const allPatients = queueData?.all_patients || [];
  const urgentCount = allPatients.filter(
    (p) => p.action_badge === "ESCALATE" || p.action_badge === "REASSESS",
  ).length;
  const expiringCount = allPatients.filter(
    (p) =>
      p.safety_status === "EXPIRED" ||
      (p.minutes_until_expiry && p.minutes_until_expiry <= 5),
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-cyan-100 text-cyan-900 uppercase tracking-wider">
            Emergency Waiting Room Surveillance
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
            <span>MY WORKLIST</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              RN {activeNurseName}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Surfacing unmonitored deteriorating patients based on vital velocity and evidence shelf-life.
          </p>
        </div>

        {/* Rapid Status Ribbon */}
        <div className="flex items-center space-x-2 text-xs font-bold">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>WAITING: {allPatients.length}</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center space-x-1.5 shadow-xs ${
              urgentCount > 0
                ? "bg-rose-50 border-rose-200 text-rose-800 animate-pulse"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ACTION NEEDED: {urgentCount}</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border font-bold flex items-center space-x-1.5 shadow-xs ${
              expiringCount > 0
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>EXPIRING: {expiringCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Fast Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {[
            { id: "ALL", label: "All Actions" },
            { id: "ACTION_NOW", label: `Action Now (${urgentCount})` },
            { id: "MY_PATIENTS", label: "My Patients" },
            { id: "EXPIRING", label: `Expiring (${expiringCount})` },
            { id: "UNATTENDED", label: "Unattended Only" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                filterMode === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toggle Live Feed Button */}
        <button
          onClick={() => setShowLiveFeed(!showLiveFeed)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border flex items-center space-x-1.5 flex-shrink-0 self-start sm:self-auto ${
            showLiveFeed
              ? "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
          }`}
          title="Toggle Live Clinical Feed"
        >
          {showLiveFeed ? (
            <>
              <PanelRightClose className="w-3.5 h-3.5" />
              <span>Hide Live Feed</span>
            </>
          ) : (
            <>
              <PanelRightOpen className="w-3.5 h-3.5" />
              <span>Show Live Feed</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Main Workspace: Action Queue + Live Safety Feed */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Center: Action Queue */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          <ActionQueue filterMode={filterMode} />
        </div>

        {/* Right Column: Live Safety Feed */}
        {showLiveFeed && (
          <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
            <LiveSafetyFeed />
          </div>
        )}
      </div>
    </div>
  );
};
