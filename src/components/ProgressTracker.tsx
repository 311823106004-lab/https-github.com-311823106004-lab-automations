import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TaskStatus } from '../types';

interface ProgressTrackerProps {
  status: TaskStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  status,
  errorMessage,
  onRetry,
  onCancel,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status !== 'idle' && status !== 'completed' && status !== 'failed') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (status === 'completed' || status === 'failed') {
      clearInterval(interval);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const stages: { key: TaskStatus; label: string; description: string }[] = [
    { key: 'request_received', label: 'Request Received', description: 'Validated input and context' },
    { key: 'analysing', label: 'Analysing Task', description: 'Deconstructing intent & parameters' },
    { key: 'plan_ready', label: 'Plan Ready', description: 'Execution sequence formulated' },
    { key: 'awaiting_approval', label: 'Awaiting Approval', description: 'Human sign-off required' },
    { key: 'executing', label: 'Executing', description: 'Autonomous agent running pipeline' },
    { key: 'reviewing', label: 'Reviewing Output', description: 'Checking quality & format' },
    { key: 'completed', label: 'Completed', description: 'Verified deliverable ready' },
  ];

  // Map status to current stage index
  const getStageIndex = (st: TaskStatus) => {
    switch (st) {
      case 'request_received':
        return 0;
      case 'analysing':
        return 1;
      case 'plan_ready':
        return 2;
      case 'awaiting_approval':
        return 3;
      case 'executing':
        return 4;
      case 'reviewing':
        return 5;
      case 'completed':
        return 6;
      case 'failed':
        return 4; // where it likely failed
      default:
        return -1;
    }
  };

  const currentIndex = getStageIndex(status);

  return (
    <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Top status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Task Workflow Lifecycle
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Status: {status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real application state machine tracking end-to-end task progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-[#070B14] px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{elapsedSeconds}s elapsed</span>
          </div>

          {onCancel && status !== 'completed' && status !== 'failed' && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 transition cursor-pointer"
            >
              Cancel Task
            </button>
          )}
        </div>
      </div>

      {/* Progress Timeline Nodes */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {stages.map((stage, idx) => {
            const isCompleted = currentIndex > idx || status === 'completed';
            const isCurrent = currentIndex === idx && status !== 'completed' && status !== 'failed';
            const isFailed = status === 'failed' && currentIndex === idx;

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-xl border relative transition-all ${
                  isCurrent
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : isCompleted
                    ? 'bg-[#0E172B] border-emerald-500/30'
                    : isFailed
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-[#070B14]/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                  <div>
                    {isCurrent && (
                      <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {isFailed && (
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    {!isCurrent && !isCompleted && !isFailed && (
                      <span className="w-2 h-2 rounded-full bg-slate-700 block" />
                    )}
                  </div>
                </div>

                <h4
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-blue-300'
                      : isCompleted
                      ? 'text-emerald-300'
                      : isFailed
                      ? 'text-red-300'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error / Failure Banner with Retry Controls */}
      {status === 'failed' && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-200">Task Execution Interrupted</p>
              <p className="text-[11px] text-red-300/80 mt-0.5">
                {errorMessage || 'An error occurred during agent processing. Please check parameters and retry.'}
              </p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shrink-0 cursor-pointer transition"
            >
              Retry Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};
