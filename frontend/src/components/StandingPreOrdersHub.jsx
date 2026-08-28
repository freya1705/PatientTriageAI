import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Filter
} from 'lucide-react';

export const StandingPreOrdersHub = () => {
  const { preordersList, handleApprovePreorder, handleDismissPreorder, viewPatientDetail } = useTriage();
  const [filterType, setFilterType] = useState('ALL');
  const [dismissingOrderId, setDismissingOrderId] = useState(null);
  const [dismissReason, setDismissReason] = useState('');

  const filteredOrders = preordersList.filter((o) => {
    if (filterType === 'DRAFTS') return o.status === 'AUTO_DRAFTED';
    if (filterType === 'APPROVED') return o.status === 'APPROVED_AND_ROUTED';
    if (filterType === 'STAT') return o.priority?.includes('STAT');
    return true;
  });

  const confirmDismiss = (orderId) => {
    if (!dismissReason.trim()) return;
    handleDismissPreorder(orderId, dismissReason);
    setDismissingOrderId(null);
    setDismissReason('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              AUTONOMOUS STANDING PRE-ORDER HUB
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Fast-Track Diagnostics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-drafts actionable diagnostic orders before physician assignment &bull; Non-Device CDS (21 U.S.C. § 360aaa-1).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          {[
            { id: 'ALL', label: `All (${preordersList.length})` },
            { id: 'DRAFTS', label: `Drafts (${preordersList.filter((o) => o.status === 'AUTO_DRAFTED').length})` },
            { id: 'STAT', label: 'STAT Only' },
            { id: 'APPROVED', label: 'Approved' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pre-Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No orders match the selected filter.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isDraft = ord.status === 'AUTO_DRAFTED';
            const isApproved = ord.status === 'APPROVED_AND_ROUTED';
            const isDismissed = ord.status === 'DISMISSED';

            return (
              <div
                key={ord.order_id}
                className="bg-slate-50/80 border border-slate-200 rounded-xl p-4.5 space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ord.order_id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {ord.patient_name} ({ord.patient_id})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      Level {ord.triage_level}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                        ord.priority?.includes('STAT')
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ord.priority}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isDismissed
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                      }`}
                    >
                      {isApproved ? '✓ Dispatched to Tech' : isDismissed ? 'Dismissed' : '⚡ Auto-Drafted'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span>{ord.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Clinical Rationale:</strong> {ord.rationale}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Target Team: <strong>{ord.target_team}</strong>
                  </p>
                </div>

                {/* Dismiss Form Modal/Inline */}
                {dismissingOrderId === ord.order_id && (
                  <div className="bg-white border border-rose-200 rounded-lg p-3 space-y-2 text-xs">
                    <label className="font-bold text-slate-800">
                      Mandatory Justification for Dismissing Pre-Order:
                    </label>
                    <input
                      type="text"
                      value={dismissReason}
                      onChange={(e) => setDismissReason(e.target.value)}
                      placeholder="e.g., Blood draw already performed at intake / Attending cancelled order"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => setDismissingOrderId(null)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmDismiss(ord.order_id)}
                        disabled={!dismissReason.trim()}
                        className="px-3 py-1 rounded bg-rose-600 text-white font-bold disabled:opacity-50"
                      >
                        Confirm Dismissal
                      </button>
                    </div>
                  </div>
                )}

                {/* 1-Click Action Hub */}
                {isDraft && dismissingOrderId !== ord.order_id && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    <button
                      onClick={() => viewPatientDetail(ord.patient_id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setDismissingOrderId(ord.order_id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
                      >
                        Dismiss with Reason
                      </button>

                      <button
                        onClick={() => handleApprovePreorder(ord.order_id)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Route to Tech</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
