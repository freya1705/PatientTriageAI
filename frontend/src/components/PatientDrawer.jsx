import React, { useState } from "react";
import { useTriage } from "../context/TriageContext";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingDown,
  HelpCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  Activity,
  UserCheck,
  UserX,
} from "lucide-react";

/**
 * PatientDrawer — Unified right-side slide-over panel.
 * Replaces: WhyExplanationModal, WhyDetailsPanel, WhatIfWaitingModal, WhyComparisonModal
 *
 * Three tabs:
 *   1. Clinical Summary  — vitals, triage level, age model
 *   2. Why This Rank     — plain-English contributing factors + collapsible score breakdown
 *   3. What Happens Next — recommended actions + inaction projection
 */
export const PatientDrawer = () => {
  const { drawerPatient, setDrawerPatient, openReassessmentModal } =
    useTriage();
  const [activeTab, setActiveTab] = useState("summary");
  const [showScores, setShowScores] = useState(false);

  if (!drawerPatient) return null;

  const p = drawerPatient;
  const vitals = p.latest_vitals || {};
  const isPediatric = p.age < 16;
  const isGeriatric = p.age >= 65;
  const isDeteriorating =
    p.trajectory_status === "RAPID_DETERIORATION" ||
    p.trajectory_status === "WORSENING";
  const isExpired = p.safety_status === "EXPIRED";

  const handleClose = () => {
    setDrawerPatient(null);
    setActiveTab("summary");
    setShowScores(false);
  };

  const tabs = [
    { id: "summary", label: "Clinical Summary" },
    { id: "why", label: "Why This Rank" },
    { id: "next", label: "What Happens Next" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isDeteriorating
                    ? "bg-rose-500 animate-ping"
                    : isExpired
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
              <span className="font-mono text-xs font-bold text-slate-500">
                {p.id}
              </span>
              <span className="font-bold text-slate-900">{p.name}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {p.age}y • {p.gender} • {p.chief_complaint}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-cyan-600 text-cyan-700 bg-cyan-50/40"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ── TAB 1: CLINICAL SUMMARY ── */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              {/* Triage Level + Action Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Triage Level
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    Level {p.display_triage_level}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {p.triage_category}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Priority Score
                  </span>
                  <div className="text-lg font-black text-cyan-800 mt-0.5">
                    {p.action_priority_score} pts
                  </div>
                  <div
                    className={`text-[11px] font-semibold ${
                      p.current_confidence < 60
                        ? "text-purple-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {p.current_confidence}% confidence
                  </div>
                </div>
              </div>

              {/* Latest Vitals */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Latest Vitals
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    {
                      label: "SpO₂",
                      val: vitals.spo2 != null ? `${vitals.spo2}%` : "—",
                      warn: vitals.spo2 != null && vitals.spo2 < 93,
                    },
                    {
                      label: "HR",
                      val:
                        vitals.heart_rate != null
                          ? `${vitals.heart_rate}`
                          : "—",
                      warn:
                        vitals.heart_rate != null && vitals.heart_rate > 110,
                    },
                    {
                      label: "SBP",
                      val: vitals.sbp != null ? `${vitals.sbp}` : "—",
                      warn: vitals.sbp != null && vitals.sbp < 90,
                    },
                    {
                      label: "Temp",
                      val:
                        vitals.temperature != null
                          ? `${vitals.temperature}°C`
                          : "—",
                      warn:
                        vitals.temperature != null && vitals.temperature > 38.5,
                    },
                    {
                      label: "RR",
                      val:
                        vitals.resp_rate != null ? `${vitals.resp_rate}` : "—",
                      warn: vitals.resp_rate != null && vitals.resp_rate > 22,
                    },
                    {
                      label: "GCS",
                      val: vitals.gcs != null ? `${vitals.gcs}` : "—",
                      warn: vitals.gcs != null && vitals.gcs < 14,
                    },
                  ].map(({ label, val, warn }) => (
                    <div
                      key={label}
                      className={`rounded-lg p-2 border ${warn ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}
                    >
                      <div
                        className={`text-[10px] font-bold uppercase ${warn ? "text-rose-500" : "text-slate-400"}`}
                      >
                        {label}
                      </div>
                      <div
                        className={`font-black mt-0.5 ${warn ? "text-rose-700" : "text-slate-800"}`}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age-Specific Model */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs space-y-1">
                <span className="font-bold text-blue-900 block">
                  {isPediatric
                    ? "👶 Pediatric Model (< 16y)"
                    : isGeriatric
                      ? "👴 Geriatric Model (≥ 65y)"
                      : "🧑 Adult Standard Model"}
                </span>
                <p className="text-blue-800 text-[11px]">
                  {isPediatric
                    ? "Calibrated with age-specific vital ranges. Heightened sensitivity to fever, stridor, and respiratory distress."
                    : isGeriatric
                      ? "Calibrated for blunted febrile responses, hypothermia alerts for occult sepsis, and higher susceptibility to occult shock."
                      : "Evaluated against standard clinical shock parameters and presenting symptom acuity."}
                </p>
              </div>

              {/* Attendance & Companion Status */}
              <div className="space-y-2">
                <div
                  className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-semibold ${
                    p.is_attended
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  {p.is_attended ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <UserX className="w-4 h-4" />
                  )}
                  <span>
                    {p.is_attended
                      ? "Physician currently attending"
                      : "⚠️ No physician assigned — unattended in waiting room"}
                  </span>
                </div>

                {p.attendant_away && (
                  <div className="flex items-center space-x-2 p-3 rounded-xl border text-xs font-semibold bg-orange-50 border-orange-200 text-orange-900">
                    <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                    <span>
                      ⚠️ Family Attendant is away (billing / pharmacy / parking)
                    </span>
                  </div>
                )}
              </div>

              {/* Referral Candidate Card (if eligible) */}
              {p.referral_eligible && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                      <span>🏥 Referral Candidate</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-900">
                      RES: {p.referral_eligibility_score || 88}%
                    </span>
                  </div>
                  <p className="text-emerald-800 text-[11px]">
                    {p.referral_reason ||
                      "Low-acuity presentation suitable for community clinic redirection to relieve tertiary ED load."}
                  </p>
                  <div className="text-[10px] font-semibold text-emerald-700">
                    Destination:{" "}
                    {p.referral_facility ||
                      "Primary Health Centre (PHC) / Urgent Care"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: WHY THIS RANK ── */}
          {activeTab === "why" && (
            <div className="space-y-4">
              {/* Primary Reason */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-cyan-900">
                  <ShieldCheck className="w-4 h-4 text-cyan-700" />
                  <span>Primary Safety Reason</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed pl-6">
                  {p.primary_action_reason ||
                    p.primary_rationale ||
                    "Routine monitoring based on triage level and wait time."}
                </p>
              </div>

              {/* Contributing Factors in plain English */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  What the system detected:
                </h3>
                <div className="space-y-2">
                  {isDeteriorating && (
                    <div className="flex items-start space-x-2.5 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs">
                      <TrendingDown className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-rose-800">
                          Rapid vital drop detected
                        </span>
                        <p className="text-rose-700 mt-0.5">
                          Oxygen dropped from 96% → {vitals.spo2 ?? 91}% and
                          heart rate spiked to {vitals.heart_rate ?? 117} bpm.
                          This exceeds safe deterioration thresholds.
                        </p>
                      </div>
                    </div>
                  )}

                  {isExpired && (
                    <div className="flex items-start space-x-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
                      <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-amber-800">
                          Safety check window expired
                        </span>
                        <p className="text-amber-700 mt-0.5">
                          Last vitals were recorded{" "}
                          {p.elapsed_since_vital || 48} minutes ago. The system
                          requires a fresh observation to confirm stability.
                        </p>
                      </div>
                    </div>
                  )}

                  {p.is_uncertain && (
                    <div className="flex items-start space-x-2.5 bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs">
                      <HelpCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-purple-800">
                          Incomplete vital data ("Unknown ≠ Safe")
                        </span>
                        <p className="text-purple-700 mt-0.5">
                          Missing baseline measurements at intake. The system
                          treats unknown values as potential risk — not as
                          normal.
                        </p>
                        {(p.uncertainty_reasons || []).length > 0 && (
                          <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-purple-700">
                            {p.uncertainty_reasons.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  {p.total_waiting_mins > 30 &&
                    !isDeteriorating &&
                    !isExpired && (
                      <div className="flex items-start space-x-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                        <Activity className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-700">
                            Extended unmonitored wait
                          </span>
                          <p className="text-slate-600 mt-0.5">
                            Waiting {p.total_waiting_mins} minutes without a
                            vital re-check. Risk of silent deterioration
                            accumulates over time.
                          </p>
                        </div>
                      </div>
                    )}

                  {(p.contributing_factors || []).map((factor, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                      <span className="text-slate-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsible Score Breakdown */}
              <div>
                <button
                  onClick={() => setShowScores(!showScores)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 flex items-center space-x-1 transition-colors"
                >
                  <span>
                    {showScores ? "Hide" : "Show"} technical score breakdown
                  </span>
                  {showScores ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showScores && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-mono text-[11px] text-slate-700 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Base Risk (w_r):</span>
                      <span>{p.risk_score} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deterioration (w_d):</span>
                      <span className="text-rose-600">
                        +{isDeteriorating ? 32 : 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staleness (w_s):</span>
                      <span className="text-amber-600">
                        +{isExpired ? 22 : 6} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uncertainty (w_u):</span>
                      <span className="text-purple-600">
                        +{p.uncertainty_score || 0} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Physician Coverage (w_c):</span>
                      <span className="text-emerald-600">
                        {p.is_attended ? "-35 pts" : "+0 pts"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-1.5 font-bold text-xs text-slate-900">
                      <span>Total Priority Score:</span>
                      <span>{p.action_priority_score} pts</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: WHAT HAPPENS NEXT ── */}
          {activeTab === "next" && (
            <div className="space-y-4">
              {/* Recommended Action */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Recommended Next Action
                </div>
                <div className="text-base font-black text-amber-300">
                  {p.action_badge === "ESCALATE" ||
                  p.action_badge === "IMMEDIATE"
                    ? "REASSESS PATIENT NOW"
                    : p.is_uncertain
                      ? "ACQUIRE MISSING VITALS"
                      : isExpired
                        ? "COMPLETE VITAL RE-CHECK"
                        : "ROUTINE MONITORING"}
                </div>
                <p className="text-xs text-slate-300">
                  {p.action_badge === "ESCALATE"
                    ? "Immediate bedside nurse reassessment. Consider escalation to attending physician."
                    : p.is_uncertain
                      ? "Record SpO₂, BP, and HR at triage kiosk or via bedside spot-check to resolve uncertainty."
                      : isExpired
                        ? "Safety clock expired. Collect fresh vitals to reset the observation window."
                        : "Continue ambient monitoring. Scheduled re-check within the safety window."}
                </p>
              </div>

              {/* If Inaction Continues */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs space-y-2">
                <div className="font-bold text-rose-900 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>If no action taken in the next 20 minutes:</span>
                </div>
                <ul className="space-y-1.5 text-rose-800 pl-2">
                  <li className="flex items-start space-x-1.5">
                    <span className="mt-1">•</span>
                    <span>
                      <strong>Evidence confidence</strong> continues to decay
                      below 50% as observations age.
                    </span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="mt-1">•</span>
                    <span>
                      <strong>Wait hazard</strong> accumulates — unmonitored
                      physiological changes may cross critical thresholds
                      undetected.
                    </span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="mt-1">•</span>
                    <span>
                      <strong>Priority rank</strong> continues to rise until a
                      fresh assessment is logged.
                    </span>
                  </li>
                </ul>
              </div>

              {/* If Intervened Now */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>If reassessed now:</span>
                </div>
                <p className="text-emerald-800">
                  Fresh vitals reset the safety validity window, resolve
                  clinical uncertainty, and allow the system to accurately
                  recalculate this patient's true priority rank.
                </p>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * This is clinical decision support for nurse prioritization. It
                does not replace professional clinical judgment.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-between bg-slate-50">
          <button
            onClick={handleClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              handleClose();
              openReassessmentModal(p);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Reassess Patient Now</span>
          </button>
        </div>
      </div>
    </>
  );
};
