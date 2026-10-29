import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  PlayCircle,
  Layers,
  History,
  Sparkles,
  FileCode2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  activeTaskCount: number;
  totalCompletedCount: number;
  onQuickDemoClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  activeTaskCount,
  totalCompletedCount,
  onQuickDemoClick,
}) => {
  const navItems = [
    { id: 'overview', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create New Task', icon: PlusCircle, badge: 'AI Prompt' },
    { id: 'active', label: 'Task Execution', icon: PlayCircle, badge: activeTaskCount > 0 ? `${activeTaskCount} active` : undefined },
    { id: 'templates', label: 'Template Library', icon: Layers, badge: '8 presets' },
    { id: 'demos', label: 'Customer Demo Mode', icon: Sparkles, highlight: true },
    { id: 'history', label: 'Task History', icon: History, count: totalCompletedCount },
    { id: 'custom', label: 'Custom Automation', icon: FileCode2 },
  ];

  return (
    <aside className="w-64 bg-[#0A0F1D] border-r border-slate-800/80 flex flex-col h-screen shrink-0 sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight font-sans">
                Mesara AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight">AgentHub Enterprise</p>
          </div>
        </div>
        <p className="mt-2.5 text-[11px] text-blue-300/80 font-medium tracking-wide">
          Automate Work. Accelerate Growth.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : item.highlight
                  ? 'text-cyan-300 hover:bg-slate-800/60 hover:text-cyan-200'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-blue-400'
                      : item.highlight
                      ? 'text-cyan-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
                  {item.badge}
                </span>
              )}
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Demo Quick Action */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-b from-blue-950/40 to-slate-900/60 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold text-white">Customer Live Demo</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          3 pre-configured scenarios ready to demonstrate real AI outputs.
        </p>
        <button
          onClick={onQuickDemoClick}
          className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Launch Demo Scenarios</span>
        </button>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080C17] text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Online
          </span>
          <span className="text-slate-500 font-mono text-[10px]">v1.0 Demo</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>Human-in-the-Loop Safe Mode</span>
        </div>
      </div>
    </aside>
  );
};
