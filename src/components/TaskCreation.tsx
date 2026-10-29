import React, { useState, useRef } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Play,
  ListTree,
  Check,
  FileType,
  FileSpreadsheet,
} from 'lucide-react';
import { TaskCategory, TaskPriority, UploadedFileInfo } from '../types';

interface TaskCreationProps {
  initialPrompt?: string;
  initialCategory?: TaskCategory;
  initialPriority?: TaskPriority;
  initialFile?: UploadedFileInfo | null;
  onPlanTask: (data: {
    prompt: string;
    category: TaskCategory;
    priority: TaskPriority;
    fileInfo: UploadedFileInfo | null;
  }) => void;
  onExecuteDirect: (data: {
    prompt: string;
    category: TaskCategory;
    priority: TaskPriority;
    fileInfo: UploadedFileInfo | null;
  }) => void;
  isPlanning: boolean;
  isExecuting: boolean;
}

export const TaskCreation: React.FC<TaskCreationProps> = ({
  initialPrompt = '',
  initialCategory = 'general',
  initialPriority = 'normal',
  initialFile = null,
  onPlanTask,
  onExecuteDirect,
  isPlanning,
  isExecuting,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [category, setCategory] = useState<TaskCategory>(initialCategory);
  const [priority, setPriority] = useState<TaskPriority>(initialPriority);
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(initialFile);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Example prompts specified in prompt brief
  const exampleTasks = [
    { label: 'Sales Report', text: 'Analyse my monthly sales data and generate a business report.' },
    { label: 'Summarise Doc', text: 'Summarise this document into key points.' },
    { label: 'Customer Email', text: 'Create a professional customer follow-up email.' },
    { label: 'Feedback Analysis', text: 'Analyse customer feedback and identify common complaints.' },
    { label: 'Social Calendar', text: 'Create a weekly social media content calendar.' },
    { label: 'CSV Trend Review', text: 'Review a CSV file and identify trends.' },
    { label: 'Proposal Generator', text: 'Convert rough notes into a professional business proposal.' },
  ];

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    const validExtensions = ['.csv', '.txt', '.pdf', '.json', '.png', '.jpg', '.jpeg'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMsg(
        `Unsupported file type: "${file.name}". Supported formats: CSV, TXT, PDF, JSON, PNG, JPG.`
      );
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg(`File size exceeds 15MB limit. Please upload a smaller file.`);
      return;
    }

    setIsParsingFile(true);

    try {
      if (file.name.endsWith('.csv') || file.type.includes('csv')) {
        const text = await file.text();
        // Call backend CSV parse endpoint for exact math
        try {
          const res = await fetch('/api/agent/parse-csv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ csvContent: text }),
          });
          if (res.ok) {
            const stats = await res.json();
            setFileInfo({
              name: file.name,
              size: file.size,
              type: file.type || 'text/csv',
              content: text,
              csvStats: stats,
            });
            if (category === 'general') setCategory('csv-analysis');
          } else {
            setFileInfo({
              name: file.name,
              size: file.size,
              type: file.type || 'text/csv',
              content: text,
            });
          }
        } catch (e) {
          setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type || 'text/csv',
            content: text,
          });
        }
      } else if (file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        const text = await file.text();
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          content: text,
        });
      } else {
        // PDF or image
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type,
            content: `[Attached Binary Document: ${file.name} - ${file.type}]`,
            base64: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setErrorMsg(`Failed to read file: ${err.message || 'Unknown parsing error.'}`);
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handlePlan = () => {
    if (!prompt.trim()) {
      setErrorMsg('Please describe what you want your AI agent to do before planning.');
      return;
    }
    setErrorMsg(null);
    onPlanTask({ prompt: prompt.trim(), category, priority, fileInfo });
  };

  const handleExecute = () => {
    if (!prompt.trim()) {
      setErrorMsg('Please describe what you want your AI agent to do before executing.');
      return;
    }
    setErrorMsg(null);
    onExecuteDirect({ prompt: prompt.trim(), category, priority, fileInfo });
  };

  const handleClear = () => {
    setPrompt('');
    setCategory('general');
    setPriority('normal');
    setFileInfo(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header title */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous AI Directive</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create New Agent Task</h2>
        <p className="text-xs text-slate-400 mt-1">
          Provide a business instruction. The agent will formulate a structured plan, identify required inputs, and await your sign-off before running.
        </p>
      </div>

      {/* Validation Error banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-red-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Prompt Card */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Task Directive <span className="text-blue-400">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Describe what you want your AI agent to do..."
              className="w-full rounded-xl bg-[#070B14] border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 text-sm p-4 leading-relaxed transition outline-none resize-y"
            />
          </div>

          {/* Character counter / hint */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Natural language task description</span>
            <span>{prompt.length} characters</span>
          </div>
        </div>

        {/* Example Task Chips */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Suggestions:
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleTasks.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(ex.text);
                  if (ex.label === 'Sales Report' || ex.label === 'CSV Trend Review') {
                    setCategory('csv-analysis');
                  } else if (ex.label === 'Customer Email') {
                    setCategory('email-drafting');
                  } else if (ex.label === 'Summarise Doc') {
                    setCategory('document-summary');
                  } else if (ex.label === 'Feedback Analysis') {
                    setCategory('feedback-analysis');
                  } else if (ex.label === 'Social Calendar') {
                    setCategory('social-content');
                  } else if (ex.label === 'Proposal Generator') {
                    setCategory('business-proposal');
                  }
                  setErrorMsg(null);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-slate-700/70 hover:border-blue-500/30 transition cursor-pointer"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Category and Priority Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Task Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full rounded-xl bg-[#070B14] border border-slate-700/80 text-white text-xs p-3 focus:border-blue-500 outline-none"
            >
              <option value="general">General Autonomous Task</option>
              <option value="sales-reporting">Sales & Executive Reporting</option>
              <option value="email-drafting">Professional Email Drafting</option>
              <option value="document-summary">Document Summarisation</option>
              <option value="feedback-analysis">Customer Feedback & Sentiment Analysis</option>
              <option value="social-content">Social Media Content Planning</option>
              <option value="business-proposal">Business Proposal Generation</option>
              <option value="csv-analysis">CSV & Tabular Data Analysis</option>
              <option value="meeting-notes">Meeting Notes & RACI Summarisation</option>
              <option value="document-qa">Document Q&A / Deep Extraction</option>
            </select>
          </div>

          {/* Priority Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Execution Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'normal', 'high', 'urgent'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                      isSelected
                        ? p === 'urgent'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : p === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                        : 'bg-[#070B14] text-slate-400 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Optional File Upload Dropzone */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Attach Supporting Data (Optional)
            </label>
            <span className="text-[11px] text-slate-500">CSV, TXT, PDF, JSON up to 15MB</span>
          </div>

          {fileInfo ? (
            <div className="p-4 rounded-xl bg-[#080E1D] border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  {fileInfo.name.endsWith('.csv') ? (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    {fileInfo.name}
                    {fileInfo.csvStats && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {fileInfo.csvStats.rowCount} rows • {fileInfo.csvStats.columnCount} cols calculated
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {(fileInfo.size / 1024).toFixed(1)} KB • Verified & Ready for ingestion
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileInfo(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                title="Clear file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-400 bg-blue-950/20'
                  : 'border-slate-700 hover:border-slate-600 bg-[#070B14]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.txt,.pdf,.json,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-7 h-7 text-blue-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">
                {isParsingFile ? 'Parsing file contents...' : 'Drag & drop a business file, or browse'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                CSV datasets, customer logs, RFP notes, or policy documents
              </p>
            </div>
          )}
        </div>

        {/* Primary Action Button Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
          >
            Clear Form
          </button>

          <div className="flex items-center gap-3">
            {/* Plan Task Button */}
            <button
              type="button"
              onClick={handlePlan}
              disabled={isPlanning || isExecuting}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <ListTree className="w-4 h-4 text-cyan-400" />
              <span>{isPlanning ? 'Formulating Plan...' : 'Plan Task'}</span>
            </button>

            {/* Execute Task Button */}
            <button
              type="button"
              onClick={handleExecute}
              disabled={isPlanning || isExecuting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isExecuting ? 'Executing Agent...' : 'Execute Task'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
