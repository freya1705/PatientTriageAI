import React, { useState } from "react";
import { useTriage } from "../context/TriageContext";
import { SafetyClock } from "../components/SafetyClock";
import {
  Search,
  Users,
  Filter,
  Zap,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";

export const SearchAllWaitingPage = () => {
  const {
    queueData,
    viewPatientDetail,
    openReassessmentModal,
    openPatientDrawer,
    handleImOnIt,
    handlingMap,
    fetchQueue,
  } = useTriage();

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];

  const filteredPatients = allPatients.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chief_complaint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      levelFilter === "ALL" ||
      p.display_triage_level.toString() === levelFilter;

    let matchesStatus = true;
    if (statusFilter === "ACTION_NOW") {
      matchesStatus =
        p.action_badge === "ESCALATE" ||
        p.action_badge === "IMMEDIATE" ||
        (p.risk_score || 0) >= 70;
    } else if (statusFilter === "REASSESS") {
      matchesStatus =
        p.action_badge === "REASSESS" || p.safety_status === "EXPIRED";
    } else if (statusFilter === "UNATTENDED") {
      matchesStatus = !p.is_attended;
    }

    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              PATIENT SEARCH & ALL WAITING CENSUS
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete emergency waiting room census ({allPatients.length}{" "}
            Patients).
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center space-x-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient ID, Name, or Chief Complaint..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-semibold">
            {["ALL", "1", "2", "3", "4", "5"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  levelFilter === lvl
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl === "ALL" ? "All ESI" : `L${lvl}`}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="ACTION_NOW">Action Required Now</option>
            <option value="REASSESS">Reassess Due</option>
            <option value="UNATTENDED">Unattended Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Complaint</th>
              <th className="py-3 px-4">Triage Level</th>
              <th className="py-3 px-4">Safety Clock</th>
              <th className="py-3 px-4">Clinical State</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No patients match your search.
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => {
                const isUrgent =
                  p.action_badge === "ESCALATE" ||
                  p.action_badge === "IMMEDIATE" ||
                  (p.risk_score || 0) >= 70;
                const isReassess =
                  p.action_badge === "REASSESS" ||
                  p.safety_status === "EXPIRED";

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.id} &bull; {p.age}y {p.gender}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {p.chief_complaint}
                    </td>

                    <td className="py-3 px-4 font-bold">
                      Level {p.display_triage_level}
                    </td>

                    <td className="py-3 px-4">
                      <SafetyClock
                        elapsedMins={p.elapsed_since_vital || 0}
                        minutesUntilExpiry={p.minutes_until_expiry ?? 15}
                        safetyStatus={p.safety_status}
                        size="compact"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isUrgent
                              ? "bg-rose-100 text-rose-800"
                              : isReassess
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isUrgent
                            ? "🔴 Action Now"
                            : isReassess
                              ? "🟠 Reassess"
                              : "🟢 Stable"}
                        </span>

                        {p.attendant_away && (
                          <div className="text-[10px] font-bold text-orange-700">
                            ⚠️ Attendant Away
                          </div>
                        )}

                        {p.referral_eligible && (
                          <div
                            className="text-[10px] font-bold text-emerald-700"
                            title={p.referral_reason}
                          >
                            🏥 Referral Candidate
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openReassessmentModal(p)}
                          className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs"
                          title="Bedside Reassessment"
                        >
                          Reassess
                        </button>
                        <button
                          onClick={() => openPatientDrawer(p)}
                          className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 border border-slate-200"
                          title="Open Slide-over Details"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => viewPatientDetail(p.id)}
                          className="px-2.5 py-1 rounded bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                          title="Open Full Dossier"
                        >
                          Dossier
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
  );
};
