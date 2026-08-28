import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Film,
  Clock,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react';

export const ReplaySimulationBar = () => {
  const {
    replayTimeline,
    replayStepIndex,
    replayPlaying,
    replaySpeed,
    setReplaySpeed,
    playReplay,
    pauseReplay,
    stepForwardReplay,
    resetReplay,
    applyStep
  } = useTriage();

  const currentStep = replayTimeline[replayStepIndex] || {
    time_str: '10:00 AM',
    phase_name: 'BASELINE_MORNING_CENSUS',
    description: 'Baseline ED waiting room census. All benchmark patients at standard initial triage scores.',
    live_event_msg: '🟢 ED census stable at 20 patients. Baseline monitoring active.'
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-4 shadow-md border border-slate-700 space-y-3">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/60 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black tracking-tight text-white flex items-center space-x-1.5">
                <span>🎬 ED REPLAY SIMULATION</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Interactive Pitch Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Watch how <strong className="text-cyan-300 font-bold">P-017</strong> deteriorates over 90 mins, triggers Attention Gap, and surges from #17 → #1 in real time.
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {replayPlaying ? (
            <button
              onClick={pauseReplay}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={playReplay}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center space-x-1.5 shadow-xs transition-all animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START SIMULATION</span>
            </button>
          )}

          <button
            onClick={stepForwardReplay}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center space-x-1 transition-all"
            title="Advance 1 simulation step"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Next Step</span>
          </button>

          <button
            onClick={resetReplay}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 flex items-center space-x-1 transition-all"
            title="Reset to 10:00 AM baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-[11px]">
            <span className="text-slate-400">Speed:</span>
            {[
              { label: '1x', val: 4000 },
              { label: '2x', val: 2000 },
              { label: '3x', val: 1000 }
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setReplaySpeed(s.val)}
                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                  replaySpeed === s.val ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Steps Scrubber */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
        {replayTimeline.map((step, idx) => {
          const isActive = idx === replayStepIndex;
          const isPassed = idx < replayStepIndex;
          return (
            <button
              key={step.step_index}
              onClick={() => applyStep(idx)}
              className={`p-2 rounded-lg text-left transition-all border ${
                isActive
                  ? 'bg-indigo-600/80 border-indigo-400 text-white ring-2 ring-indigo-400/50 shadow-sm'
                  : isPassed
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className={isActive ? 'text-indigo-200' : 'text-slate-300'}>{step.time_str}</span>
                <span className={`px-1 py-0.2 rounded text-[9px] ${isActive ? 'bg-indigo-400 text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                  #{step.target_rank}
                </span>
              </div>
              <div className="text-[11px] font-extrabold truncate mt-0.5">
                {step.step_index === 0 && 'Morning Baseline'}
                {step.step_index === 1 && 'Waiting (35m)'}
                {step.step_index === 2 && 'Staleness Expired'}
                {step.step_index === 3 && 'SpO₂ 91% Drop'}
                {step.step_index === 4 && 'Surge to #1'}
                {step.step_index === 5 && 'RN Reassessment'}
                {step.step_index === 6 && 'Stabilized'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Step Event Ticker Bar */}
      <div className="bg-slate-950/80 border border-slate-700 rounded-lg p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-cyan-300 font-bold">
            [{currentStep.time_str}] {currentStep.phase_name}:
          </span>
          <span className="text-slate-200 font-medium">
            {currentStep.description}
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-[11px] text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
          <Activity className="w-3.5 h-3.5" />
          <span>{currentStep.vitals_delta}</span>
        </div>
      </div>
    </div>
  );
};
