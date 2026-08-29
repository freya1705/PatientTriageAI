import React, { useState, useEffect } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  ShieldCheck,
  Search,
  Clock,
  QrCode,
  Users,
  RotateCcw,
  Zap
} from 'lucide-react';

export const Header = () => {
  const {
    queueData,
    activeNurseName,
    setActiveTab,
    viewPatientDetail,
    openPatientPortalCompanion,
    handleResetData
  } = useTriage();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allPatients = queueData?.all_patients || [];
  const totalWaiting = allPatients.length;

  const urgentCount = allPatients.filter(
    (p) => p.action_badge === 'ESCALATE' || p.action_badge === 'IMMEDIATE' || (p.risk_score || 0) >= 70
  ).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const term = searchInput.toLowerCase();
    const found = allPatients.find(
      (p) => p.id.toLowerCase().includes(term) || p.name.toLowerCase().includes(term)
    );
    if (found) {
      viewPatientDetail(found.id);
      setSearchInput('');
    } else {
      setActiveTab('all-waiting');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none">
      {/* Left: Brand / Mode Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-xs tracking-wider text-slate-900 uppercase">
            LIVE MONITORING
          </span>
        </div>

        <span className="hidden sm:inline-block text-slate-300">|</span>

        <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
          {totalWaiting} Waiting &bull; <strong className="text-rose-600">{urgentCount} Need Action</strong>
        </span>
      </div>

      {/* Center: Global Quick Patient Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search patient…"
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
        />
      </form>

      {/* Right: Clock & Patient Companion QR button */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center space-x-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* Patient Transparency Portal Modal Trigger */}
        <button
          onClick={() => openPatientPortalCompanion('P-017')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition-colors flex items-center space-x-1.5 shadow-2xs"
          title="Patient QR Portal"
        >
          <QrCode className="w-3.5 h-3.5 text-cyan-700" />
          <span className="hidden sm:inline">Patient QR</span>
        </button>

        {/* Reset Dataset */}
        <button
          onClick={handleResetData}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          title="Reset demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
