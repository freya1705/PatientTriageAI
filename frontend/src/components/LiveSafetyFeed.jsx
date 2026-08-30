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
  Radio,
  RefreshCw,
  Ambulance,
  UserX
} from 'lucide-react';

export const LiveSafetyFeed = () => {
  const { liveEvents, fetchLiveFeed, queueData, openPatientDrawer, viewPatientDetail } = useTriage();

  const allPatients = queueData?.all_patients || [];

  const handleEventClick = (patientId) => {
    if (!patientId || patientId === 'UNKNOWN' || patientId === 'SYSTEM') return;
    const found = allPatients.find((p) => p.id === patientId);
    if (found) {
      openPatientDrawer(found);
    } else {
      viewPatientDetail(patientId);
    }
  };

  const getEventBadge = (eventType) => {
    switch (eventType) {
      case 'VITAL_DELTA':
      case 'SIMULATION_STEP_ADVANCE':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-rose-500" />,
          borderColor: 'border-l-rose-500',
          badgeText: 'VITAL DROP',
          badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'SAFETY_EXPIRY':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
          borderColor: 'border-l-amber-500',
          badgeText: 'SAFETY CLOCK',
          badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'CLINICIAN_ASSIGNED':
      case 'PHYSICIAN_ASSIGNMENT':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-cyan-600" />,
          borderColor: 'border-l-cyan-500',
          badgeText: 'STAFF DISPATCH',
          badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200'
        };
      case 'PREORDER_DRAFTED':
      case 'PREORDER_APPROVED':
        return {
          icon: <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />,
          borderColor: 'border-l-purple-500',
          badgeText: 'LAB ORDER',
          badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'REASSESSMENT_COMPLETE':
      case 'CLOSED_LOOP_REASSESSMENT':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
          borderColor: 'border-l-emerald-500',
          badgeText: 'REASSESSED',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'EMS_PRE_ARRIVAL':
        return {
          icon: <Ambulance className="w-3.5 h-3.5 text-blue-600" />,
          borderColor: 'border-l-blue-500',
          badgeText: '108 EMS',
          badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'ATTENDANT_STATUS':
        return {
          icon: <UserX className="w-3.5 h-3.5 text-orange-500" />,
          borderColor: 'border-l-orange-500',
          badgeText: 'ATTENDANT AWAY',
          badgeStyle: 'bg-orange-50 text-orange-700 border-orange-200'
        };
      default:
        return {
          icon: <Radio className="w-3.5 h-3.5 text-slate-400" />,
          borderColor: 'border-l-slate-400',
          badgeText: 'SURVEILLANCE',
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            ⚡ Live Clinical Feed
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchLiveFeed()}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Real-Time
          </span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {liveEvents.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-1">
            <Radio className="w-5 h-5 mx-auto text-slate-300 animate-pulse" />
            <p>Awaiting clinical telemetry events…</p>
          </div>
        ) : (
          liveEvents.slice(0, 12).map((ev, idx) => {
            const badge = getEventBadge(ev.event_type);
            const hasPatient = ev.patient_id && ev.patient_id !== 'UNKNOWN' && ev.patient_id !== 'SYSTEM';

            return (
              <div
                key={ev.id || idx}
                onClick={() => hasPatient && handleEventClick(ev.patient_id)}
                className={`p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200/80 border-l-4 ${badge.borderColor} ${
                  hasPatient ? 'cursor-pointer hover:shadow-xs hover:border-slate-300' : ''
                } space-y-1.5 group text-xs`}
              >
                {/* Meta Top Line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {badge.icon}
                    <span className="font-bold text-slate-700 text-[11px] truncate max-w-[130px]">
                      {ev.actor || 'Safety Engine'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
                    <span className={`px-1.5 py-0.2 rounded font-extrabold text-[9px] border ${badge.badgeStyle}`}>
                      {badge.badgeText}
                    </span>
                    <span>
                      {ev.timestamp ? (ev.timestamp.length > 8 ? ev.timestamp.slice(11, 19) : ev.timestamp) : 'Just Now'}
                    </span>
                  </div>
                </div>

                {/* Summary Text */}
                <p className="text-slate-800 font-semibold leading-relaxed group-hover:text-cyan-900 transition-colors">
                  {ev.summary}
                </p>

                {/* Clickable Patient Pill if Applicable */}
                {hasPatient && (
                  <div className="pt-1 flex items-center justify-between text-[10px] text-cyan-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click to open {ev.patient_id} dossier →</span>
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
