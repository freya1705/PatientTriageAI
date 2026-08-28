import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SafetyClock = ({
  elapsedMins = 0,
  minutesUntilExpiry = 15,
  safetyStatus = 'VALID',
  size = 'md'
}) => {
  const isExpired = safetyStatus === 'EXPIRED' || minutesUntilExpiry <= 0;
  const isCaution = !isExpired && minutesUntilExpiry <= 5;

  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let barColor = 'bg-emerald-500';
  let statusText = `${Math.max(0, minutesUntilExpiry)}m remaining`;

  if (isExpired) {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    barColor = 'bg-rose-600';
    statusText = 'EXPIRED';
  } else if (isCaution) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    barColor = 'bg-amber-500';
    statusText = `${minutesUntilExpiry}m left`;
  }

  // Calculate percentage of validity window remaining (assuming typical 30m window)
  const percentRemaining = isExpired ? 0 : Math.min(100, Math.max(10, Math.round((minutesUntilExpiry / 30) * 100)));

  if (size === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColor}`}>
        <Clock className="w-3 h-3 flex-shrink-0" />
        <span>{statusText}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1.5 min-w-[140px]">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Safety Clock</span>
        </span>
        <span className={isExpired ? 'text-rose-600 font-extrabold' : isCaution ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>
          {statusText}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentRemaining}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span>Age: {elapsedMins}m</span>
        <span className="text-slate-400">Window: 30m</span>
      </div>
    </div>
  );
};
