import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Activity,
  AlertTriangle,
  Clock,
  UserCheck,
  Zap,
  CheckCircle2,
  FileCheck2,
  Radio
} from 'lucide-react';

export const LiveSafetyFeed = () => {
  const { liveEvents, viewPatientDetail } = useTriage();

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'VITAL_DELTA':
      case 'SIMULATION_STEP_ADVANCE':
        return <Activity className="w-3.5 h-3.5 text-rose-500" />;
      case 'SAFETY_EXPIRY':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'CLINICIAN_ASSIGNED':
        return <UserCheck className="w-3.5 h-3.5 text-cyan-600" />;
      case 'PREORDER_DRAFTED':
      case 'PREORDER_APPROVED':
        return <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'REASSESSMENT_COMPLETE':
      case 'CLOSED_LOOP_REASSESSMENT':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            ⚡ Live Feed
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          Real-Time
        </span>
      </div>

      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {liveEvents.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            Waiting for updates…
          </div>
        ) : (
          liveEvents.slice(0, 10).map((ev, idx) => (
            <div
              key={ev.id || idx}
              onClick={() => ev.patient_id && ev.patient_id !== 'UNKNOWN' && viewPatientDetail(ev.patient_id)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 cursor-pointer flex items-start space-x-2.5 group text-xs"
            >
              <div className="mt-0.5 flex-shrink-0">
                {getEventIcon(ev.event_type)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-slate-600">{ev.actor || 'Safety Engine'}</span>
                  <span>{ev.timestamp ? ev.timestamp.slice(11, 19) || ev.timestamp : 'Just Now'}</span>
                </div>
                <p className="text-slate-800 font-medium group-hover:text-cyan-700 transition-colors leading-snug">
                  {ev.summary}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
