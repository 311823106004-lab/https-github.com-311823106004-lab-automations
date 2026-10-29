import React, { useState } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { TaskExecutionResult } from '../types';

interface TaskHistoryProps {
  tasks: TaskExecutionResult[];
  onInspectTask: (task: TaskExecutionResult) => void;
  onDeleteTask: (taskId: string) => void;
  onClearHistory: () => void;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({
  tasks,
  onInspectTask,
  onDeleteTask,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesara_agent_session_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Records</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Session Task History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inspect, re-examine deliverables, or export audit logs generated during this presentation session.
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-semibold border border-red-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Storage Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-500/20 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Presentation Mode Notice:</strong> Records are isolated to your current browser session. Enterprise production deployments synchronize with dedicated HIPAA/SOC-2 Firestore databases.
          </span>
        </div>
        <span className="text-[11px] font-mono text-blue-400 shrink-0 hidden sm:inline">
          {tasks.length} saved
        </span>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1120] border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, ID or summary keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg bg-[#070B14] border border-slate-700 text-xs text-white px-2.5 py-1.5 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="csv-analysis">CSV Analysis</option>
            <option value="email-drafting">Email Drafting</option>
            <option value="business-proposal">Business Proposal</option>
            <option value="sales-reporting">Sales Reporting</option>
            <option value="document-summary">Document Summary</option>
            <option value="feedback-analysis">Feedback Analysis</option>
          </select>
        </div>
      </div>

      {/* Task List Table */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Task History Records Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tasks you formulate or launch in Customer Demo Mode will be securely cataloged here with full execution telemetry.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0B1120] border border-slate-800 overflow-hidden shadow-xl divide-y divide-slate-800/80">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {task.taskId}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {task.category.replace('-', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(task.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight truncate">
                  {task.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-1">
                  {task.summary}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Success
                  </span>
                  <span>•</span>
                  <span>{(task.durationMs / 1000).toFixed(2)}s runtime</span>
                  {task.csvStats && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-400 flex items-center gap-1">
                        <FileSpreadsheet className="w-3 h-3" />
                        {task.csvStats.rowCount} CSV records analyzed
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-slate-500">
                    {task.isRealAI ? 'Gemini 3.8 Flash' : 'Deterministic Mode'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onInspectTask(task)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Deliverable</span>
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
