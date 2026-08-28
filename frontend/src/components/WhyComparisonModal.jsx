import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  HelpCircle,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserX,
  Scale,
  X,
  Activity
} from 'lucide-react';

export const WhyComparisonModal = ({ p1Id, p2Id, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!p1Id || !p2Id) return;
    const fetchComparison = async () => {
      try {
        setLoading(true);
        const res = await api.getWhyComparison(p1Id, p2Id);
        setData(res);
      } catch (err) {
        console.error('Failed to load why comparison:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [p1Id, p2Id]);

  if (!p1Id || !p2Id) return null;

  const c1 = data?.candidate_1;
  const c2 = data?.candidate_2;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-800 flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200 uppercase tracking-wider">
                Explainability Matrix
              </span>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                "Why #1?" — Head-to-Head Score Breakdown
              </h2>
            </div>
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
            <Activity className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Decomposing Attention-Gap coefficients...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Comparison Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-slate-100 p-3 font-bold text-slate-700 border-b border-slate-200">
                <span>Scoring Factor</span>
                <span className="text-cyan-900 font-extrabold">{c1?.id} ({c1?.name?.split(' ')[0]})</span>
                <span className="text-slate-600">{c2?.id} ({c2?.name?.split(' ')[0]})</span>
              </div>

              <div className="divide-y divide-slate-200 font-mono">
                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-sans text-slate-600 font-medium">Deterioration (w_d)</span>
                  <span className="text-rose-600 font-bold">+{c1?.scores?.deterioration}</span>
                  <span className="text-slate-500">+{c2?.scores?.deterioration}</span>
                </div>

                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-sans text-slate-600 font-medium">Staleness (w_s)</span>
                  <span className="text-amber-600 font-bold">+{c1?.scores?.staleness}</span>
                  <span className="text-slate-500">+{c2?.scores?.staleness}</span>
                </div>

                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-sans text-slate-600 font-medium">Waiting Hazard</span>
                  <span className="text-slate-700 font-bold">+{c1?.scores?.waiting_hazard}</span>
                  <span className="text-slate-500">+{c2?.scores?.waiting_hazard}</span>
                </div>

                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-sans text-slate-600 font-medium">Uncertainty (w_u)</span>
                  <span className="text-purple-600 font-bold">+{c1?.scores?.uncertainty}</span>
                  <span className="text-slate-500">+{c2?.scores?.uncertainty}</span>
                </div>

                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-sans text-slate-600 font-medium">Physician Coverage (w_c)</span>
                  <span className="text-slate-500">{c1?.scores?.coverage_discount}</span>
                  <span className="text-emerald-700 font-bold">{c2?.scores?.coverage_discount}</span>
                </div>

                <div className="grid grid-cols-3 p-3 items-center bg-cyan-50/60 font-sans font-black text-sm">
                  <span className="text-slate-900">Total Priority</span>
                  <span className="text-cyan-900">{c1?.scores?.total_score} pts</span>
                  <span className="text-slate-600">{c2?.scores?.total_score} pts</span>
                </div>
              </div>
            </div>

            {/* Verdict Explanation Box */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3.5 text-xs text-cyan-950 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-cyan-900">
                <HelpCircle className="w-4 h-4 text-cyan-700" />
                <span>Clinical Priority Justification:</span>
              </div>
              <p className="leading-relaxed">
                {data?.verdict}
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Close Comparison
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
