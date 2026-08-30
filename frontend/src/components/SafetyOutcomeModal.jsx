import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  CheckCircle2,
  Clock,
  TrendingDown,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserCheck,
  FileCheck2,
  X,
  Stethoscope,
  Building2,
  AlertTriangle,
} from 'lucide-react';

export const SafetyOutcomeModal = () => {
  const {
    safetyOutcomeData,
    setSafetyOutcomeData,
    handleAssignPhysician,
    setActiveTab,
  } = useTriage();

  const [assignedStatus, setAssignedStatus] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  if (!safetyOutcomeData) return null;

  const esc = safetyOutcomeData.escalation_recommendation || {
    priority: 'HIGH PRIORITY',
    recommended_team: 'ED Physician — Trauma Team',
    physician_name: 'Dr. Sarah Chen, MD (ED Trauma)',
    department: 'Resuscitation Bay 1',
    reason: 'Persistent tachycardia following blunt abdominal trauma.',
    response_target: '≤ 5 min',
  };

  const patientId = safetyOutcomeData.patient_id || 'P-014';
  const patientName = safetyOutcomeData.patient_name || 'Tyler Brooks';

  const handleAssignAndNotify = async () => {
    setIsAssigning(true);
    await handleAssignPhysician(
      patientId,
      esc.physician_name,
      esc.department,
      true,
    );
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setAssignedStatus({
      physician: esc.physician_name,
      time: nowTime,
    });
    setIsAssigning(false);
  };

  const handleViewAudit = () => {
    setSafetyOutcomeData(null);
    setActiveTab('audit');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* 1. Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Closed-Loop Safety Outcome
              </span>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                Bedside Reassessment Completed
              </h2>
            </div>
          </div>

          <button
            onClick={() => setSafetyOutcomeData(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Before vs After Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Before */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              BEFORE REASSESSMENT
            </div>
            <div className="text-xl font-black text-rose-700">
              Risk {safetyOutcomeData.before_risk}
            </div>
            <div className="text-xs font-mono font-bold text-slate-600">
              {safetyOutcomeData.before_vitals || 'SpO₂ 91%, HR 127 bpm'}
            </div>
            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
              🔴 ACT NOW (Rank #1)
            </span>
          </div>

          {/* After */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
              AFTER INTERVENTION
            </div>
            <div className="text-xl font-black text-emerald-700">
              Risk {safetyOutcomeData.after_risk}
            </div>
            <div className="text-xs font-mono font-bold text-slate-600">
              {safetyOutcomeData.after_vitals || 'SpO₂ 97%, HR 101 bpm'}
            </div>
            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
              🟢 Stabilized &bull; Safe to Monitor
            </span>
          </div>
        </div>

        {/* Response Metrics Ribbon */}
        <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Time to Intervention:{' '}
              <strong className="text-cyan-300 font-mono">
                {safetyOutcomeData.time_to_intervention || '3m 42s'}
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-emerald-400 font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-{safetyOutcomeData.risk_reduction_points || '46'} pts</span>
          </div>
        </div>

        {/* 3. CLOSED-LOOP ESCALATION & OWNERSHIP SECTION (HERO DIFFERENTIATOR) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              ESCALATION RECOMMENDATION
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
              🔴 {esc.priority || 'HIGH PRIORITY'}
            </span>
          </div>

          {!assignedStatus ? (
            <div className="space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-800">
                  <span className="font-semibold text-slate-500">Route to:</span>
                  <strong className="text-slate-900 font-bold">
                    {esc.recommended_team} &bull; {esc.physician_name}
                  </strong>
                </div>

                <div className="flex items-start justify-between text-slate-800 gap-2">
                  <span className="font-semibold text-slate-500">Reason:</span>
                  <span className="text-right text-slate-800 font-medium">
                    {esc.reason}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-800">
                  <span className="font-semibold text-slate-500">Response Target:</span>
                  <span className="font-mono font-bold text-rose-700">
                    {esc.response_target}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAssignAndNotify}
                disabled={isAssigning}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {isAssigning ? 'Routing Escalate…' : 'ASSIGN & NOTIFY CLINICIAN'}
                </span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs animate-in fade-in duration-150">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  ✓ Assigned to {assignedStatus.physician}
                </span>
              </div>
              <div className="text-[11px] text-emerald-800 font-mono pl-6">
                ✓ Acknowledged {assignedStatus.time} (Clinical Ownership SLA Locked)
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer Actions */}
        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={handleViewAudit}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            [ VIEW AUDIT TRAIL → ]
          </button>

          <button
            onClick={() => setSafetyOutcomeData(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Done &bull; Return to Worklist
          </button>
        </div>
      </div>
    </div>
  );
};
