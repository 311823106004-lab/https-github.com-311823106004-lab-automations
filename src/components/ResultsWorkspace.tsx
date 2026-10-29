import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  PlusCircle,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Table,
  Cpu,
} from 'lucide-react';
import { TaskExecutionResult } from '../types';

interface ResultsWorkspaceProps {
  result: TaskExecutionResult;
  onRegenerate: () => void;
  onRunAnother: () => void;
}

export const ResultsWorkspace: React.FC<ResultsWorkspaceProps> = ({
  result,
  onRegenerate,
  onRunAnother,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'deliverable' | 'stats' | 'plan'>('deliverable');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = result.output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([result.output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.taskId}_${result.category}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (!result.csvStats) return;
    // Export column summary as CSV
    const headers = ['Column_Name', 'Type', 'Record_Count', 'Sum', 'Mean', 'Median', 'Min', 'Max'];
    const rows = result.csvStats.columns.map((c) => [
      c.name,
      c.type,
      c.count,
      c.sum ?? 'N/A',
      c.mean ?? 'N/A',
      c.median ?? 'N/A',
      c.min ?? 'N/A',
      c.max ?? 'N/A',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.taskId}_calculated_statistics.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render basic Markdown formatting nicely
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-3 font-sans text-slate-200 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-white pt-3 pb-1 border-b border-slate-800">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-extrabold text-blue-300 pt-4 pb-1 border-b border-slate-800">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-black text-white pt-4 pb-2 border-b border-slate-800">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-base font-bold text-cyan-300 pt-2">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const text = trimmed.slice(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+/)?.[0];
            const text = trimmed.replace(/^\d+\.\s/, '');
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="text-xs font-mono font-bold text-blue-400 mt-0.5 shrink-0">
                  {num}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
              </div>
            );
          }

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            return <hr key={idx} className="border-slate-800 my-4" />;
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Standard paragraph
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-xs">$1</code>');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Execution Status Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C152E] via-[#0E1A38] to-[#0A1224] border border-blue-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Execution Completed
              </span>
              <span className="text-xs text-blue-400 font-mono font-medium">
                {result.taskId}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 capitalize">
                {result.category.replace('-', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {result.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Measured Duration */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Execution Duration</span>
              </div>
              <p className="text-base font-extrabold text-white font-mono">
                {(result.durationMs / 1000).toFixed(2)}s
              </p>
            </div>

            {/* AI Source Indicator */}
            <div className="px-3 py-2 rounded-xl bg-[#070B14] border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                Engine
              </span>
              <span className="text-xs font-semibold text-cyan-300 font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {result.isRealAI ? 'Gemini 3.8 Flash' : 'Deterministic Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Task Summary */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            <span className="font-bold text-white uppercase text-[11px] tracking-wider mr-2 text-blue-400">
              Executive Summary:
            </span>
            {result.summary}
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0B1120] border border-slate-800">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('deliverable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'deliverable'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Generated Deliverable
          </button>
          {result.csvStats && (
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calculated CSV Metrics</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'plan'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Approved Plan Steps
          </button>
        </div>

        {/* Export and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Result */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Result</span>
              </>
            )}
          </button>

          {/* Download as TXT */}
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download TXT</span>
          </button>

          {/* Download as CSV */}
          {result.csvStats && (
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV Stats</span>
            </button>
          )}

          {/* Regenerate Result */}
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Regenerate</span>
          </button>

          {/* Run Another Task */}
          <button
            onClick={onRunAnother}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Run Another Task</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      {activeTab === 'deliverable' && (
        <div className="space-y-6">
          {/* Main Deliverable Card */}
          <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Synthesized Deliverable
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Markdown Rendered
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
              {renderFormattedMarkdown(result.output)}
            </div>
          </div>

          {/* Key Findings & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Findings */}
            <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Key Executive Findings</span>
              </div>
              <div className="space-y-2">
                {result.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#070B14] border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings and Limitations */}
            <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Operational Limitations & Safeguards</span>
              </div>
              <div className="space-y-2">
                {result.warningsAndLimitations.map((warn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculated CSV Statistics Tab */}
      {activeTab === 'stats' && result.csvStats && (
        <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Table className="w-4 h-4" />
              <span>Verified Deterministic Computation</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Calculated Dataset Statistics
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculated via server code to prevent model hallucination. Exactly {result.csvStats.rowCount} records analyzed across {result.csvStats.columnCount} columns.
            </p>
          </div>

          {/* Columns Summary Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070B14] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Column Name</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Count</th>
                  <th className="p-3">Sum / Aggregation</th>
                  <th className="p-3">Mean / Avg</th>
                  <th className="p-3">Median</th>
                  <th className="p-3">Min / Max Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {result.csvStats.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">{col.name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-sans font-bold ${
                          col.type === 'numeric'
                            ? 'bg-blue-500/15 text-blue-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {col.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{col.count}</td>
                    <td className="p-3 text-emerald-400 font-bold">
                      {col.sum !== undefined ? col.sum.toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3 text-cyan-300">
                      {col.mean !== undefined ? col.mean.toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3 text-slate-300">
                      {col.median !== undefined ? col.median.toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3 text-slate-400">
                      {col.min !== undefined ? `[${col.min} to ${col.max}]` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sample Rows Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Sample Data Ingestion Records
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070B14] text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    {result.csvStats.columns.map((c, i) => (
                      <th key={i} className="p-2.5">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {result.csvStats.sampleRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/20">
                      {result.csvStats?.columns.map((col, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-slate-300">
                          {String(row[col.name] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Plan Steps Tab */}
      {activeTab === 'plan' && (
        <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Approved Execution Sequence
          </h3>
          <div className="space-y-3">
            {result.plan.stepsRequired?.map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono">
                    ✓
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{step.name}</p>
                    <p className="text-[11px] text-slate-400">{step.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                  Executed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
