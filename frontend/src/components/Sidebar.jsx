import React from 'react';
import { useTriage } from '../context/TriageContext';
import {
  CheckSquare,
  Users,
  UserCheck,
  UserPlus,
  Compass,
  Film,
  Award,
  FileText,
  BookOpen,
  Lock,
  ChevronLeft,
  ChevronRight,
  Activity,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { activeTab, setActiveTab, queueData, activeNurseName } = useTriage();

  const allPatients = queueData?.all_patients || [];
  const urgentCount = allPatients.filter(
    (p) => p.action_badge === 'ESCALATE' || p.action_badge === 'IMMEDIATE' || (p.risk_score || 0) >= 70
  ).length;

  const navSections = [
    {
      title: 'MY SHIFT',
      items: [
        { id: 'worklist', label: 'Worklist', icon: CheckSquare, badge: urgentCount > 0 ? `${urgentCount} Now` : null, badgeColor: 'bg-rose-100 text-rose-800' },
        { id: 'my-patients', label: 'My Patients', icon: UserCheck },
        { id: 'all-waiting', label: 'All Patients', icon: Users, badge: `${allPatients.length}` },
        { id: 'intake', label: 'New Patient', icon: UserPlus }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'command-center', label: 'Command Center', icon: Compass },
        { id: 'replay-simulation', label: 'Replay Demo', icon: Film, badge: 'Demo' },
        { id: 'evaluation', label: 'AI Impact', icon: Award }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'audit', label: 'Audit Log', icon: FileText },
        { id: 'about-scoring', label: 'How Scoring Works', icon: BookOpen },
        { id: 'privacy', label: 'Privacy & Scale', icon: Lock }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('worklist')}>
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm text-slate-900 tracking-tight">
                    Patient<span className="text-cyan-700">Triage</span>.ai
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">ED Safety Copilot</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center cursor-pointer" onClick={() => setActiveTab('worklist')}>
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
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="p-2 space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'
                    } rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          item.badgeColor || (isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile / Nurse Shift Badge */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              SC
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-slate-900 truncate">{activeNurseName}</p>
              <p className="text-[10px] text-slate-400 truncate">Charge Nurse</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              SC
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
