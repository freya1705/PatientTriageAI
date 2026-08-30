import React, { useState } from 'react';
import { useTriage } from '../context/TriageContext';
import {
  Search,
  Ambulance,
  Zap,
  RotateCcw,
  QrCode,
} from 'lucide-react';

export const Header = () => {
  const {
    queueData,
    openPatientDrawer,
    openPatientPortalCompanion,
    handleSimulateDeterioration,
    handleResetData,
    incomingEmsList,
  } = useTriage();

  const [searchInput, setSearchInput] = useState('');

  const allPatients = queueData?.all_patients || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const term = searchInput.toLowerCase();
    const found = allPatients.find(
      (p) =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        (p.chief_complaint && p.chief_complaint.toLowerCase().includes(term)),
    );
    if (found) {
      openPatientDrawer(found);
      setSearchInput('');
    }
  };

  const emsItems = incomingEmsList || [
    {
      unit_id: '108-A',
      patient_name: 'Ramesh Kulkarni',
      eta_minutes: 6,
      triage_level: 2,
    },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Minimal Brand & Live Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-[11px] tracking-wider text-slate-800 uppercase">
            LIVE MONITORING
          </span>
        </div>

        {/* Subtle Incoming Ambulance Alert Strip */}
        {emsItems.length > 0 && (
          <div className="hidden lg:flex items-center space-x-2 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-900">
            <Ambulance className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>
              🚑 {emsItems.length} INCOMING: {emsItems[0].patient_name} • ETA {emsItems[0].eta_minutes}m (Level {emsItems[0].triage_level})
            </span>
          </div>
        )}
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search patient ID or name…"
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
        />
      </form>

      {/* Right: Demo Action Tools & Patient Companion */}
      <div className="flex items-center space-x-2">
        {/* 1-Click Demo Trigger: Simulate Deterioration */}
        <button
          onClick={() => handleSimulateDeterioration('P-014')}
          className="px-3 py-1.5 rounded-lg text-xs font-black bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center space-x-1.5 shadow-xs"
          title="Demo: Simulate acute oxygen drop on P-014"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ Demo: Drop SpO₂</span>
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={() => handleResetData()}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Reset Demo Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Patient Mobile Companion QR */}
        <button
          onClick={() => openPatientPortalCompanion('P-014')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center space-x-1"
          title="Patient Mobile Tracker"
        >
          <QrCode className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden md:inline">Patient QR</span>
        </button>
      </div>
    </header>
  );
};
