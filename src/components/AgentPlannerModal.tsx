import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TaskPlan, PlanStep, ExternalIntegration } from '../types';

interface AgentPlannerModalProps {
  plan: TaskPlan;
  onApproveAndExecute: (approvedPlan: TaskPlan) => void;
  onEditRequest: () => void;
  onCancel: () => void;
  isExecuting: boolean;
}

export const AgentPlannerModal: React.FC<AgentPlannerModalProps> = ({
  plan,
  onApproveAndExecute,
  onEditRequest,
  onCancel,
  isExecuting,
}) => {
  const [objective, setObjective] = useState(plan.taskObjective);
  const [expectedOutput, setExpectedOutput] = useState(plan.expectedOutput);
  const [steps, setSteps] = useState<PlanStep[]>(plan.stepsRequired);
  const [newStepName, setNewStepName] = useState('');

  const handleStepToggle = (id: number) => {
    setSteps(
      steps.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'skipped' ? 'pending' : 'skipped' }
          : s
      )
    );
  };

  const handleStepNameChange = (id: number, newName: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, name: newName } : s)));
  };

  const handleRemoveStep = (id: number) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleAddStep = () => {
    if (!newStepName.trim()) return;
    const nextId = steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([
      ...steps,
      {
        id: nextId,
        name: newStepName.trim(),
        description: 'User-specified custom verification step.',
        status: 'pending',
      },
    ]);
    setNewStepName('');
  };

  const handleApprove = () => {
    const updatedPlan: TaskPlan = {
      ...plan,
      taskObjective: objective,
      expectedOutput,
      stepsRequired: steps,
    };
    onApproveAndExecute(updatedPlan);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1733] to-[#0A1124] border border-blue-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Human-in-the-Loop Gatekeeper</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              AI Agent Execution Plan
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Review and customize the agent's proposed sequence. Execution will not proceed without your explicit approval.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Awaiting User Sign-Off</span>
          </div>
        </div>
      </div>

      {/* Original Request Card */}
      <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Original User Request</span>
          <span className="text-blue-400 capitalize">{plan.category.replace('-', ' ')}</span>
        </div>
        <p className="text-sm font-medium text-slate-200 bg-[#070B14] p-3.5 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed">
          "{plan.originalRequest}"
        </p>
      </div>

      {/* Editable Task Objective */}
      <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Task Objective (Editable)
        </label>
        <input
          type="text"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full rounded-xl bg-[#070B14] border border-slate-700/80 p-3 text-sm text-white focus:border-blue-500 outline-none"
        />
      </div>

      {/* Editable Steps Required */}
      <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Steps Required ({steps.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Click checkbox to toggle or edit step titles before dispatching.
            </p>
          </div>
          <span className="text-[10px] text-blue-400 font-mono">Sequential Execution</span>
        </div>

        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            const isSkipped = step.status === 'skipped';
            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSkipped
                    ? 'bg-[#070B14]/40 border-slate-800/60 opacity-60'
                    : 'bg-[#070B14] border-slate-700/80 hover:border-blue-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepToggle(step.id)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition cursor-pointer ${
                      !isSkipped
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-600 text-slate-500'
                    }`}
                  >
                    {!isSkipped && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-blue-400">
                        Step {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => handleStepNameChange(step.id, e.target.value)}
                        className={`text-xs font-semibold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-white w-full outline-none px-1 py-0.5 ${
                          isSkipped ? 'line-through text-slate-500' : ''
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-1">{step.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition cursor-pointer"
                    title="Remove Step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom step input */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Add an additional custom verification step..."
            value={newStepName}
            onChange={(e) => setNewStepName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
            className="flex-1 rounded-xl bg-[#070B14] border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={handleAddStep}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Required Data & Expected Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Input Data */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Required Input Data
          </h4>
          <ul className="space-y-1.5">
            {plan.requiredInputData.map((data, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 flex items-center gap-2 bg-[#070B14] p-2.5 rounded-lg border border-slate-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>{data}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Output */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Expected Deliverable
          </h4>
          <textarea
            rows={3}
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            className="w-full rounded-xl bg-[#070B14] border border-slate-800 p-3 text-xs text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Risks & External Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risks or Missing Information */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Identified Risks & Missing Info</span>
          </div>
          <div className="space-y-2">
            {plan.risksOrMissingInfo.map((risk, idx) => (
              <div
                key={idx}
                className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg"
              >
                • {risk}
              </div>
            ))}
          </div>
        </div>

        {/* External Integrations */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>External Integrations Matrix</span>
          </div>
          <div className="space-y-2">
            {plan.externalIntegrations.map((integ, idx) => (
              <div
                key={idx}
                className="text-xs bg-[#070B14] border border-slate-800 p-2.5 rounded-lg space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{integ.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      integ.status === 'ready'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {integ.status === 'ready' ? 'Connected' : 'Safe Mode (Simulated)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{integ.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval & Action Bar */}
      <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onEditRequest}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Edit Request</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleApprove}
          disabled={isExecuting}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isExecuting ? 'Dispatching Agent...' : 'Approve & Execute Plan'}</span>
        </button>
      </div>
    </div>
  );
};
