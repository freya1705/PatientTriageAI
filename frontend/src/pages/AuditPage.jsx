import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Search, RefreshCw, Lock } from 'lucide-react';

export const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs(150);
      setLogs(data.audit_logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      (l.patient_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.event_type || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.clinician_role || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.outcome || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.clinician_decision || '').toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === 'ALL' || l.event_type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              CLINICAL AUDIT TRAIL
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronological ledger &bull; Records all AI detections, closed-loop actions & overrides.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Refresh Audit Logs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, role, decision..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="ALL">All Event Types</option>
          <option value="CLOSED_LOOP_REASSESSMENT">Bedside Reassessments</option>
          <option value="CLINICIAN_OVERRIDE">Clinician Overrides</option>
          <option value="PHYSICIAN_ASSIGNMENT">Staff Assignments</option>
          <option value="RAPID_DETERIORATION_ALERT">Deterioration Alerts</option>
          <option value="NEW_PATIENT_INTAKE">Intake Events</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Event / Action</th>
              <th className="py-3 px-4">Clinician Role</th>
              <th className="py-3 px-4">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  {loading ? 'Loading audit records…' : 'No audit records found.'}
                </td>
              </tr>
            ) : (
              filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {l.timestamp ? l.timestamp.slice(11, 19) || l.timestamp : '—'}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {l.patient_id || 'System'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">
                      {l.event_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {l.clinician_decision || l.rationale}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {l.clinician_role || 'Safety Engine'}
                  </td>

                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {l.outcome || 'Logged & Verified'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
