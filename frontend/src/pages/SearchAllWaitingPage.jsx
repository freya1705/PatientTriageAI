import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Search,
  Zap,
  RotateCcw,
  Clock,
  Eye,
} from 'lucide-react';

export const SearchAllWaitingPage = () => {
  const {
    queueData,
    openReassessmentModal,
    openPatientDrawer,
    fetchQueue,
  } = useTriage();

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!queueData) return null;

  const allPatients = queueData.all_patients || [];

  const filteredPatients = allPatients.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.chief_complaint && p.chief_complaint.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel =
      levelFilter === 'ALL' ||
      (p.display_triage_level || p.triage_level).toString() === levelFilter;

    let matchesStatus = true;
    const isActNow =
      p.action_badge === 'ESCALATE' ||
      p.action_badge === 'IMMEDIATE' ||
      p.trajectory_status === 'RAPID_DETERIORATION' ||
      p.trajectory_status === 'WORSENING' ||
      (p.risk_score || 0) >= 70 ||
      p.is_deteriorating;

    const isRecheck =
      !isActNow &&
      (p.action_badge === 'REASSESS' ||
        p.action_badge === 'WATCH' ||
        p.safety_status === 'EXPIRED' ||
        (p.minutes_until_expiry && p.minutes_until_expiry <= 5) ||
        p.is_uncertain);

    if (statusFilter === 'ACT_NOW') matchesStatus = isActNow;
    else if (statusFilter === 'RECHECK') matchesStatus = isRecheck;
    else if (statusFilter === 'SAFE') matchesStatus = !isActNow && !isRecheck;
    else if (statusFilter === 'UNATTENDED') matchesStatus = !p.is_attended;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* 1. Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            WAITING ROOM PATIENTS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full emergency department waiting census ({allPatients.length} Patients).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or symptom…"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        {/* Status Filters */}
        {[
          { id: 'ALL', label: 'All Patients' },
          { id: 'ACT_NOW', label: '🔴 Act Now' },
          { id: 'RECHECK', label: '🟡 Recheck' },
          { id: 'SAFE', label: '🟢 Safe to Wait' },
          { id: 'UNATTENDED', label: '⚠️ Unattended' },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setStatusFilter(st.id)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              statusFilter === st.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.label}
          </button>
        ))}

        {/* ESI Level Buttons */}
        <div className="ml-auto flex items-center space-x-1">
          {['ALL', '1', '2', '3', '4', '5'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                levelFilter === lvl
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'All ESI' : `L${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Census Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Complaint</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Safety Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  No matching patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => {
                const isActNow =
                  p.action_badge === 'ESCALATE' ||
                  p.action_badge === 'IMMEDIATE' ||
                  p.trajectory_status === 'RAPID_DETERIORATION' ||
                  p.trajectory_status === 'WORSENING' ||
                  (p.risk_score || 0) >= 70 ||
                  p.is_deteriorating;

                const isRecheck =
                  !isActNow &&
                  (p.action_badge === 'REASSESS' ||
                    p.action_badge === 'WATCH' ||
                    p.safety_status === 'EXPIRED' ||
                    (p.minutes_until_expiry && p.minutes_until_expiry <= 5) ||
                    p.is_uncertain);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {p.id} &bull; {p.age}y {p.gender === 'Female' ? 'F' : 'M'}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-600">
                      {p.chief_complaint}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      Level {p.display_triage_level || p.triage_level}
                    </td>

                    <td className="py-3 px-4">
                      {isActNow && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                          <span>🔴 ACT NOW</span>
                        </span>
                      )}
                      {isRecheck && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>🟡 RECHECK</span>
                        </span>
                      )}
                      {!isActNow && !isRecheck && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>🟢 SAFE TO WAIT</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {isActNow && (
                          <button
                            onClick={() => openReassessmentModal(p)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs"
                          >
                            REASSESS
                          </button>
                        )}
                        {isRecheck && (
                          <button
                            onClick={() => openReassessmentModal(p)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs"
                          >
                            RECHECK
                          </button>
                        )}
                        <button
                          onClick={() => openPatientDrawer(p)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
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
  );
};
