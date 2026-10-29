import React from 'react';
import { PlusCircle, Sparkles, Server, CheckCircle2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNewTaskClick: () => void;
  onDemoClick: () => void;
  hasGeminiKey: boolean;
  onResetSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNewTaskClick,
  onDemoClick,
  hasGeminiKey,
  onResetSession,
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'overview':
        return { title: 'Executive Dashboard', subtitle: 'Real-time orchestration & task metrics' };
      case 'create':
        return { title: 'AI Task Creator', subtitle: 'Formulate natural language autonomous directives' };
      case 'active':
        return { title: 'Task Execution & Results', subtitle: 'Supervised execution workflow and output verification' };
      case 'templates':
        return { title: 'Automation Template Library', subtitle: 'Curated enterprise automation presets' };
      case 'demos':
        return { title: 'Customer Demo Mode', subtitle: 'Guided scenarios for client presentations' };
      case 'history':
        return { title: 'Task History & Logs', subtitle: 'Inspect, reopen, and export task audit records' };
      case 'custom':
        return { title: 'Request Custom Automation', subtitle: 'Generate custom AI architecture specifications' };
      default:
        return { title: 'Mesara AI AgentHub', subtitle: 'Automate Work. Accelerate Growth.' };
    }
  };

  const { title, subtitle } = getViewTitle();

  return (
    <header className="h-16 bg-[#080D1A]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Gemini Engine Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            hasGeminiKey
              ? 'bg-blue-950/40 border-blue-500/30 text-blue-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}
          title={
            hasGeminiKey
              ? 'Gemini 3.8 Flash is configured securely on the server.'
              : 'Demo mode active. Realistic deterministic outputs enabled.'
          }
        >
          <Server className="w-3.5 h-3.5" />
          <span>{hasGeminiKey ? 'Gemini 3.8 Flash Active' : 'Demo Engine Active'}</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasGeminiKey ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
        </div>

        {/* Demo Mode Button */}
        <button
          onClick={onDemoClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Demo Scenarios</span>
        </button>

        {/* Reset Session History */}
        <button
          onClick={onResetSession}
          title="Reset session task history"
          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Primary CTA */}
        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>
    </header>
  );
};
