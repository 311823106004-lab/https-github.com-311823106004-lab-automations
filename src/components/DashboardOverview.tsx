import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  FileCheck2,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { TaskExecutionResult, AutomationTemplate } from '../types';
import { AUTOMATION_TEMPLATES } from '../data/templatesAndDemos';

interface DashboardOverviewProps {
  tasks: TaskExecutionResult[];
  onNewTaskClick: () => void;
  onDemoClick: () => void;
  onSelectTemplate: (template: AutomationTemplate) => void;
  onInspectTask: (task: TaskExecutionResult) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  tasks,
  onNewTaskClick,
  onDemoClick,
  onSelectTemplate,
  onInspectTask,
}) => {
  // Demonstration baseline metrics + session tasks
  const sessionCompleted = tasks.filter((t) => t.status === 'completed').length;
  const sessionTotal = tasks.length;

  const totalTasksDisplay = 148 + sessionTotal;
  const completedTasksDisplay = 142 + sessionCompleted;
  const awaitingReviewDisplay = 3;
  const successRate = '99.2%';
  const avgDuration = tasks.length > 0
    ? `${(tasks.reduce((acc, t) => acc + t.durationMs, 0) / tasks.length / 1000).toFixed(1)}s`
    : '2.1s';

  const quickTemplates = AUTOMATION_TEMPLATES.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Presentation Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C152E] via-[#0F1E3D] to-[#0A1329] border border-blue-500/20 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mesara AI Enterprise Demonstration Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Automate Work. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Accelerate Growth.</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the Mesara AI AgentHub. Experience autonomous enterprise AI agents that analyze real data, draft executive deliverables, and orchestrate complex business workflows under strict human supervision.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onNewTaskClick}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Task</span>
            </button>
            <button
              onClick={onDemoClick}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 font-semibold text-sm border border-cyan-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              <span>Try Live Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Operational Telemetry
          </h3>
          <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
            *Includes sample benchmark data + {sessionTotal} active session tasks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Tasks */}
          <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Tasks Created</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">{totalTasksDisplay}</span>
              <span className="text-xs text-emerald-400 font-medium flex items-center">
                +14% vs last mo
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Autonomous workflow requests</p>
          </div>

          {/* Card 2: Tasks Completed */}
          <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Tasks Completed</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">{completedTasksDisplay}</span>
              <span className="text-xs text-slate-400 font-medium">
                {successRate} success rate
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Validated deliverables produced</p>
          </div>

          {/* Card 3: Tasks Requiring Review */}
          <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Tasks Requiring Review</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-300 font-mono">{awaitingReviewDisplay}</span>
              <span className="text-xs text-slate-400 font-medium">Human sign-off gate</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Awaiting supervisor approval</p>
          </div>

          {/* Card 4: Avg Execution Speed */}
          <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Avg Execution Duration</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">{avgDuration}</span>
              <span className="text-xs text-cyan-400 font-medium">Deterministic pipeline</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Average response generation</p>
          </div>
        </div>
      </div>

      {/* Explanatory Section: How the Automation Agent Works */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Architecture & Safety Protocol</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              How the Mesara AI Automation Agent Works
            </h3>
          </div>
          <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80">
            Enterprise Guardrails Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  01
                </span>
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">Input</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">Natural Intent Parsing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                User specifies business tasks in plain English. Attach CSV, PDF, or text data for targeted processing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
              Zero code required
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  02
                </span>
                <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">Reasoning</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">Structured Agent Planning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini 3.8 Flash dissects requirements into discrete steps, inputs, risks, and external integration requirements.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
              Clear risk & scope audit
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-blue-500/30 flex flex-col justify-between relative shadow-lg shadow-blue-500/5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  03
                </span>
                <span className="text-[10px] text-cyan-300 font-medium uppercase tracking-wider">Human-in-the-Loop</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">Supervisor Approval</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The user reviews and edits the execution plan. The agent is never permitted to execute without explicit user confirmation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Strict safety gate
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  04
                </span>
                <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Output</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">Execution & Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic code computes real statistics (e.g. CSV analysis) and synthesizes publication-grade deliverables.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
              TXT & CSV download ready
            </div>
          </div>
        </div>
      </div>

      {/* Quick-Start Automation Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Quick-Start Automation Templates
            </h3>
            <p className="text-xs text-slate-400">
              Pre-configured business agents designed for immediate customer demonstration.
            </p>
          </div>
          <button
            onClick={() => onSelectTemplate(AUTOMATION_TEMPLATES[0])}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          >
            <span>View all 8 templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="p-5 rounded-xl bg-[#0D1527] border border-slate-800 hover:border-blue-500/50 hover:bg-[#101A33] transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {template.badge}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition mb-1.5">
                  {template.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="text-[11px] text-slate-500">Click to load</span>
                <span className="text-blue-400 group-hover:translate-x-0.5 transition font-semibold text-[11px]">
                  Use Template &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Task Activity */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Task Activity</h3>
            <p className="text-xs text-slate-400">
              Audit log of completed autonomous tasks executed during this session.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {tasks.length} task{tasks.length === 1 ? '' : 's'} recorded
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-10 text-center rounded-xl bg-[#0E1628]/60 border border-dashed border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">No session tasks executed yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Run one of the 3 ready customer demonstrations or compose a natural language task.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={onDemoClick}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 transition cursor-pointer"
              >
                Launch Customer Demo
              </button>
              <button
                onClick={onNewTaskClick}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Create Custom Task
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                onClick={() => onInspectTask(task)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-lg transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{task.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono text-blue-400">{task.taskId}</span>
                      <span>•</span>
                      <span className="capitalize">{task.category.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{(task.durationMs / 1000).toFixed(1)}s execution</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    Completed
                  </span>
                  <span className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
