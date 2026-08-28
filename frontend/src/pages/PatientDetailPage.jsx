import React, { useState, useEffect } from 'react';
import { useTriage } from '../context/TriageContext';
import { api } from '../services/api';
import { SafetyClock } from '../components/SafetyClock';
import {
  ArrowLeft,
  Activity,
  Heart,
  Clock,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  UserX,
  Zap,
  HelpCircle,
  FileCheck2,
  Lock,
  ChevronRight
} from 'lucide-react';

export const PatientDetailPage = () => {
  const {
    selectedPatientId,
    setActiveTab,
    openReassessmentModal,
    openWhatIfModal,
    setWhyModalPatient,
    handleToggleAttending,
    setOverrideModalPatient
  } = useTriage();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedPatientId) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await api.getPatientDetail(selectedPatientId);
        setPatient(data);
      } catch (err) {
        console.error('Failed to load patient detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [selectedPatientId]);

  if (!selectedPatientId || (loading && !patient)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading patient action dossier...</p>
        </div>
      </div>
    );
  }

  const vitals = patient.latest_vitals || {};
  const isDeteriorating = patient.trajectory_status in { RAPID_DETERIORATION: true, WORSENING: true };
  const isExpired = patient.safety_status === 'EXPIRED';

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Back Navigation */}
      <button
        onClick={() => setActiveTab('worklist')}
        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Worklist</span>
      </button>

      {/* Patient Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {patient.id}
            </span>
            <h1 className="text-xl font-black text-slate-900">
              {patient.name}
            </h1>
            <span className="text-xs text-slate-400 font-medium">
              {patient.age}y &bull; {patient.gender}
            </span>
          </div>

          <div className="text-sm font-bold text-slate-700 mt-1">
            "{patient.chief_complaint}"
          </div>

          <div className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
            <span>Waiting: <strong>{patient.total_waiting_mins} min</strong></span>
            <span>&bull;</span>
            <span>Triage: <strong>Level {patient.display_triage_level}</strong></span>
            <span>&bull;</span>
            <span className={patient.is_attended ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
              {patient.is_attended ? '👨⚕️ Attended' : '⚠️ Unattended Waiting Room'}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openReassessmentModal(patient)}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>RECHECK VITALS NOW</span>
          </button>

          <button
            onClick={() => handleToggleAttending(patient.id)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
              patient.is_attended
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {patient.is_attended ? 'Doctor Assigned' : 'Assign Doctor'}
          </button>
        </div>
      </div>

      {/* 2-Column Action Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: WHAT CHANGED & WHY */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>WHAT CHANGED?</span>
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Oxygen Saturation:</span>
                <span className="font-bold font-mono text-slate-900">
                  {isDeteriorating ? `96% → ${vitals.spo2 ?? 91}% (↓ 5%)` : `${vitals.spo2 ?? 96}% (Stable)`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Heart Rate:</span>
                <span className="font-bold font-mono text-slate-900">
                  {isDeteriorating ? `92 → ${vitals.heart_rate ?? 117} bpm (↑ 25 bpm)` : `${vitals.heart_rate ?? 85} bpm`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Blood Pressure:</span>
                <span className="font-bold font-mono text-slate-900">
                  {vitals.systolic_bp ?? 120} / {vitals.diastolic_bp ?? 80} mmHg
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-600 font-medium">Evidence Age:</span>
                <span className="font-mono text-slate-700">
                  {patient.elapsed_since_vital || 8} min old
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800">Why You're Seeing This:</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isDeteriorating
                  ? 'Continuous physiological tracking detected vital velocity degradation. Patient requires bedside verification before potential decompensation.'
                  : isExpired
                  ? 'Observation validity shelf-life has expired. Fresh repeat vitals are recommended to maintain reliable safety coverage.'
                  : 'Patient is waiting in ED lounge under routine continuous surveillance.'}
              </p>
            </div>
          </div>

          {/* Safety Clock Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>RECOMMENDED REASSESSMENT WINDOW</span>
            </h2>

            <SafetyClock
              elapsedMins={patient.elapsed_since_vital || 0}
              minutesUntilExpiry={patient.minutes_until_expiry ?? 15}
              safetyStatus={patient.safety_status}
            />

            <p className="text-[11px] text-slate-500">
              Reassessment recommended before clinical evidence becomes stale.
            </p>
          </div>
        </div>

        {/* Right: NEXT ACTIONS & TIMELINE */}
        <div className="space-y-4">
          {/* Action Hub */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              RECOMMENDED NEXT CLINICAL ACTIONS
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => openReassessmentModal(patient)}
                className="w-full p-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-rose-900">
                    1. Recheck Vitals at Bedside
                  </div>
                  <div className="text-[11px] text-rose-700">
                    Verify SpO₂ and heart rate response
                  </div>
                </div>
                <Zap className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => openWhatIfModal(patient)}
                className="w-full p-3 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-purple-900">
                    2. "What If Waiting Continues?"
                  </div>
                  <div className="text-[11px] text-purple-700">
                    View decision support trajectory
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setOverrideModalPatient(patient)}
                className="w-full p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    3. Clinician Override Authority
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Record justification reason to audit ledger
                  </div>
                </div>
                <Lock className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              RECENT CLINICAL TIMELINE
            </h2>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-mono text-slate-400">10:05 AM</span> &bull; <strong>Initial Triage:</strong> Admitted as ESI Level {patient.display_triage_level}
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-mono text-slate-400">10:28 AM</span> &bull; <strong>Intake Vitals:</strong> Baseline parameters recorded
                </div>
              </div>

              {isDeteriorating && (
                <div className="flex items-start space-x-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-600 mt-1 flex-shrink-0 animate-ping" />
                  <div className="text-rose-900">
                    <span className="font-mono font-bold text-rose-700">11:21 AM</span> &bull; <strong>Vital Velocity Shift:</strong> SpO₂ dropped from 96% to 91%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
