import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Radio,
  AlertTriangle,
  Heart,
  QrCode,
  X,
  BellRing,
} from "lucide-react";

export const PatientTransparencyCompanion = ({ patientId, onClose }) => {
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assistanceRequested, setAssistanceRequested] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    const fetchPortal = async () => {
      try {
        setLoading(true);
        const res = await api.getPatientPortalView(patientId);
        setPortalData(res);
      } catch (err) {
        console.error("Failed to load portal view:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortal();
  }, [patientId]);

  if (!patientId) return null;

  const handleNurseRequest = () => {
    setAssistanceRequested(true);
    setTimeout(() => setAssistanceRequested(false), 6000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Mobile Phone Mockup Frame */}
      <div className="bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 max-w-sm w-full animate-in fade-in zoom-in duration-150 relative">
        {/* Speaker / Camera Notch */}
        <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-8 h-1 rounded-full bg-slate-800"></div>
        </div>

        {/* Screen Container */}
        <div className="bg-white rounded-[32px] overflow-hidden text-slate-900 flex flex-col max-h-[80vh] overflow-y-auto">
          {/* Mobile App Header */}
          <div className="bg-gradient-to-r from-cyan-800 to-slate-900 text-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-5 h-5 text-cyan-300" />
                <span className="font-bold text-xs tracking-tight">
                  PatientTriage Companion
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-black">
                {portalData?.patient_name || "Freya Jadhav"}
              </h3>
              <p className="text-[11px] text-cyan-200">
                Care Tracker &bull; Waiting{" "}
                {portalData?.wait_elapsed_mins || 35} mins
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4 text-xs">
            {/* Ambient Monitoring Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 animate-pulse">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide">
                  Ambient Safety Shield Active
                </div>
                <div className="text-[11px] text-emerald-900 font-medium">
                  Continuous sensor surveillance verifying your clinical
                  stability.
                </div>
              </div>
            </div>

            {/* Care Progress Timeline */}
            <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200">
                Live Care Progress
              </div>

              <div className="space-y-3 pt-1">
                {portalData?.care_phases?.map((ph) => (
                  <div key={ph.step} className="flex items-start space-x-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 ${
                        ph.completed
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-200"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {ph.completed ? "✓" : ph.step}
                    </div>
                    <div>
                      <div
                        className={`font-bold ${ph.completed ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {ph.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {ph.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Next Step & Safety Status */}
            <div className="bg-cyan-50/80 border border-cyan-200 rounded-xl p-3 space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-cyan-900 flex items-center justify-between">
                <span>Next Safety Milestone</span>
                <span className="text-cyan-700 font-mono">
                  Continuous Safety
                </span>
              </div>
              <div className="text-xs font-bold text-cyan-950">
                Scheduled Vital Re-Check: ~10-15 mins
              </div>
              <p className="text-[11px] text-cyan-800 leading-snug">
                A triage nurse will complete a bedside spot-check to confirm
                your vitals remain safe while waiting.
              </p>
            </div>

            {/* Why Does the Queue Move? — Plain Language De-escalation Explainer */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  Why did someone who arrived after me get seen first?
                </span>
              </div>
              <div className="text-[11px] text-amber-900 space-y-1.5 leading-relaxed">
                <p>
                  Emergency rooms treat by{" "}
                  <strong>medical urgency, not arrival time</strong>. If an
                  incoming ambulance or a patient with sudden chest pain or
                  breathing difficulty arrives, clinicians must stabilize them
                  immediately.
                </p>
                <p>
                  <strong>You are not forgotten:</strong> Our safety copilot
                  continuously tracks your vitals. If your condition changes,
                  your priority updates in real time.
                </p>
              </div>
            </div>

            {/* Transparent Objective Queue Status Note */}
            {portalData?.queue_transparency_note && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Clinical Queue Transparency</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  {portalData.queue_transparency_note}
                </p>
              </div>
            )}

            {/* Assistance Alert Trigger */}
            {assistanceRequested ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-center space-y-1 animate-in fade-in">
                <BellRing className="w-5 h-5 text-rose-600 mx-auto animate-bounce" />
                <div className="font-bold text-xs">
                  Nurse Review Dispatched!
                </div>
                <p className="text-[11px] text-rose-700">
                  Triage Nurse Sarah Chen has been notified to check on you at
                  your waiting chair.
                </p>
              </div>
            ) : (
              <button
                onClick={handleNurseRequest}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors flex items-center justify-center space-x-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Immediate Nurse Review</span>
              </button>
            )}

            <div className="text-[10px] text-center text-slate-400">
              Scanned via Triage Wristband QR &bull; No App Install Required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
