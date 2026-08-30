import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  CheckSquare,
  Users,
  Compass,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { activeTab, setActiveTab, queueData } = useTriage();

  const allPatients = queueData?.all_patients || [];
  const actNowCount = allPatients.filter(
    (p) =>
      p.action_badge === 'ESCALATE' ||
      p.action_badge === 'IMMEDIATE' ||
      p.action_badge === 'REASSESS' ||
      (p.risk_score || 0) >= 70,
  ).length;

  const navItems = [
    {
      id: 'worklist',
      label: 'Worklist',
      icon: CheckSquare,
      badge: actNowCount > 0 ? `${actNowCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      id: 'all-waiting',
      label: 'Patients',
      icon: Users,
      badge: `${allPatients.length}`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'command-center',
      label: 'Command Center',
      icon: Compass,
    },
    {
      id: 'audit',
      label: 'Audit',
      icon: FileText,
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          {!isCollapsed ? (
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => setActiveTab('worklist')}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-black text-sm text-slate-900 tracking-tight">
                  Patient<span className="text-cyan-700">Triage</span>
                </span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                  Safety Copilot
                </p>
              </div>
            </div>
          ) : (
            <div
              className="w-full flex justify-center cursor-pointer"
              onClick={() => setActiveTab('worklist')}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Minimal Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'worklist' &&
                (activeTab === 'dashboard' || activeTab === 'control-tower'));

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Minimal Footer Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-700">
              Live Monitoring
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Continuous Risk Surveillance
          </p>
        </div>
      )}
    </aside>
  );
};
