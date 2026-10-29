import React, { useState } from 'react';
import {
  Sparkles,
  PlayCircle,
  FileSpreadsheet,
  Briefcase,
  Mail,
  RotateCcw,
  CheckCircle2,
  Table,
  Zap,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DEMO_PRESETS } from '../data/templatesAndDemos';
import { TaskExecutionResult, UploadedFileInfo } from '../types';

interface CustomerDemoModeProps {
  onRunDemo: (demoKey: 'demoA' | 'demoB' | 'demoC') => void;
  isExecuting: boolean;
  hasGeminiKey: boolean;
  onResetDemos: () => void;
  recentTasks: TaskExecutionResult[];
  onInspectResult: (task: TaskExecutionResult) => void;
}

export const CustomerDemoMode: React.FC<CustomerDemoModeProps> = ({
  onRunDemo,
  isExecuting,
  hasGeminiKey,
  onResetDemos,
  recentTasks,
  onInspectResult,
}) => {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'demoA' | 'demoB' | 'demoC'>('demoA');

  const demoA = DEMO_PRESETS.demoA;
  const demoB = DEMO_PRESETS.demoB;
  const demoC = DEMO_PRESETS.demoC;

  // Check if any of these demos were executed recently
  const lastDemoATask = recentTasks.find((t) => t.category === 'csv-analysis');
  const lastDemoBTask = recentTasks.find((t) => t.category === 'business-proposal');
  const lastDemoCTask = recentTasks.find((t) => t.category === 'email-drafting');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0C1630] via-[#0E1E45] to-[#0A1224] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Prospective Customer Demonstration</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Customer Demo Mode
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Showcase Mesara AI's enterprise agent capabilities live to prospects. Select any of the 3 realistic enterprise scenarios below to observe autonomous planning, real mathematical verification, and executive deliverable synthesis.
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs">
            <span
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 ${
                hasGeminiKey
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              {hasGeminiKey ? 'Real-Time Gemini 3.8 Flash Active' : 'Deterministic Demo Mode'}
            </span>
            <span className="text-slate-400">
              *All fictional company names and sample datasets are clearly demarcated.
            </span>
          </div>
        </div>
      </div>

      {/* 3 Interactive Demo Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DEMO A */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            selectedDemoTab === 'demoA'
              ? 'bg-[#0E172F] border-blue-500 shadow-xl shadow-blue-500/10'
              : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {demoA.badge}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              {demoA.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {demoA.description}
            </p>

            {/* Ingestion Asset Card */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800 text-xs space-y-1 mb-4">
              <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-emerald-400" />
                  {demoA.fileName}
                </span>
                <span className="text-emerald-400 font-mono">15 rows • 7 cols</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Real deterministic row-level sums and averages calculated by server code.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onRunDemo('demoA')}
              disabled={isExecuting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{isExecuting ? 'Agent Processing...' : 'Run Demo A'}</span>
            </button>

            {lastDemoATask && (
              <button
                onClick={() => onInspectResult(lastDemoATask)}
                className="w-full py-1.5 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 text-center transition cursor-pointer"
              >
                Inspect Last Run Deliverable &rarr;
              </button>
            )}
          </div>
        </div>

        {/* DEMO B */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            selectedDemoTab === 'demoB'
              ? 'bg-[#0E172F] border-blue-500 shadow-xl shadow-blue-500/10'
              : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {demoB.badge}
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              {demoB.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {demoB.description}
            </p>

            {/* Input Context Card */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800 text-xs space-y-1 mb-4">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Simulated Discovery Meeting Notes:
              </span>
              <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                Client: Apex Logistics. Problem: 4,200 emails triaged manually. Solution: Mesara AI Support & Dispatch Agent with SAP S/4HANA integration.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onRunDemo('demoB')}
              disabled={isExecuting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{isExecuting ? 'Agent Processing...' : 'Run Demo B'}</span>
            </button>

            {lastDemoBTask && (
              <button
                onClick={() => onInspectResult(lastDemoBTask)}
                className="w-full py-1.5 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 text-center transition cursor-pointer"
              >
                Inspect Last Run Deliverable &rarr;
              </button>
            )}
          </div>
        </div>

        {/* DEMO C */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            selectedDemoTab === 'demoC'
              ? 'bg-[#0E172F] border-blue-500 shadow-xl shadow-blue-500/10'
              : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {demoC.badge}
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              {demoC.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {demoC.description}
            </p>

            {/* Input Context Card */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800 text-xs space-y-1 mb-4">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Simulated Incident Escalation:
              </span>
              <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                Quarter-end reconciliation delay for enterprise CFO. Agent prepares de-escalation response, root cause explanation, and credit offer.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onRunDemo('demoC')}
              disabled={isExecuting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{isExecuting ? 'Agent Processing...' : 'Run Demo C'}</span>
            </button>

            {lastDemoCTask && (
              <button
                onClick={() => onInspectResult(lastDemoCTask)}
                className="w-full py-1.5 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 text-center transition cursor-pointer"
              >
                Inspect Last Run Deliverable &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Presentation Safety Notes */}
      <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Safety & Control Guarantee:</strong> All demonstrations execute in a sandboxed, read-only supervisory environment. Draft emails are never sent without human approval, mathematical data is never hallucinated, and no arbitrary code is ever executed.
        </div>
      </div>
    </div>
  );
};
