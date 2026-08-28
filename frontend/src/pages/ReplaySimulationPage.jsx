import React from 'react';
import { useTriage } from '../context/TriageContext';
import { ReplaySimulationBar } from '../components/ReplaySimulationBar';
import { ActionQueue } from '../components/ActionQueue';
import { LiveSafetyFeed } from '../components/LiveSafetyFeed';
import { Film, Sparkles, Activity, Clock, ShieldCheck } from 'lucide-react';

export const ReplaySimulationPage = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              ED REPLAY SIMULATION (DEMO MODE)
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interactive Pitch Demo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Demonstrates how risk changes while waiting &bull; Chronological progression of Patient P-017 from #17 → #1.
          </p>
        </div>
      </div>

      {/* Replay Simulation Bar */}
      <ReplaySimulationBar />

      {/* Active Stream & Feed */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 w-full min-w-0">
          <ActionQueue filterMode="ALL" />
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <LiveSafetyFeed />
        </div>
      </div>
    </div>
  );
};
