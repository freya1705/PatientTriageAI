import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Zap,
  ArrowRight,
  Activity,
  X
} from 'lucide-react';

export const CounterfactualWidget = ({ patient, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patient) return;
    const fetchCounterfactual = async () => {
      try {
        setLoading(true);
        const res = await api.getCounterfactualView(patient.id);
        setData(res);
      } catch (err) {
        console.error('Failed to load counterfactual projection:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounterfactual();
  }, [patient]);

  if (!patient) return null;

  const proj = data?.counterfactual_projection;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                🔮 What-If Forecast
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">
                {patient.id}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              What happens in the next 20 minutes?
            </h2>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{patient.name}</strong> ({patient.age}y &bull; {patient.chief_complaint})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-2">
            <Activity className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Simulating physiological trajectories...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Core Philosophy Banner */}
            <div className="bg-purple-900 text-white rounded-xl p-3.5 flex items-center space-x-3 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-800 flex items-center justify-center flex-shrink-0 text-purple-200 font-black">
                AI
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-purple-200 uppercase tracking-wide text-[10px]">
                  Causal Safety Decision Support
                </div>
                <div className="text-slate-100 font-medium">
                  PatientTriage doesn't just ask <em>"Who is risky?"</em> — it asks <strong className="text-yellow-300">"Who becomes unsafe if we keep waiting?"</strong>
                </div>
              </div>
            </div>

            {/* Side-by-Side Trajectories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Path A: Inaction (Deterioration) */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200/80">
                  <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-xs">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span>If No Action</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                    High Hazard
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-rose-900 font-semibold">
                    Expected Risk Trajectory:
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {proj?.inaction_trajectory?.map((pt, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/80 px-2.5 py-1.5 rounded border border-rose-100">
                        <span className="text-slate-600 font-sans font-medium">{pt.time}</span>
                        <span className="text-rose-700 font-bold">Risk {pt.risk}</span>
                        <span className="text-slate-500 text-[11px]">SpO₂ {pt.spo2}% &bull; HR {pt.hr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-900 font-medium">
                  <strong>⚠️ Potential Concern:</strong> {proj?.potential_concern}
                </div>
              </div>

              {/* Path B: Immediate Intervention */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span>If You Act Now</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    Safe Path
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-emerald-900 font-semibold">
                    Expected Recovery Trajectory:
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {proj?.intervention_trajectory?.map((pt, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/80 px-2.5 py-1.5 rounded border border-emerald-100">
                        <span className="text-slate-600 font-sans font-medium">{pt.time}</span>
                        <span className="text-emerald-700 font-bold">Risk {pt.risk}</span>
                        <span className="text-slate-500 text-[11px]">SpO₂ {pt.spo2}% &bull; HR {pt.hr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 font-medium">
                  <strong>✓ Recommended Action:</strong> {proj?.recommended_intervention}
                </div>
              </div>
            </div>

            {/* Summary Callout */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>
                  Immediate action achieves <strong>~{proj?.expected_risk_reduction_pct}% risk reduction</strong> and resets safety validity window.
                </span>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Close Projection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
