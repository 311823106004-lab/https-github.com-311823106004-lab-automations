import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Cpu,
  Layers,
  Database,
  X,
} from 'lucide-react';
import { WorkflowScene3D } from '../3d/WorkflowScene3D';

export const WorkflowSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      num: '01',
      name: 'Input',
      title: 'Context & Document Ingestion',
      subtitle: 'Raw business inputs accepted without rigid schemas',
      summary:
        'Upload invoices, receipts, unstructured notes, CSV datasets, or enter natural-language instructions. Mesara AI ingests multiple data modalities seamlessly.',
      keyAspects: [
        'Supports CSV, TXT, PDF invoices, and natural prompts',
        'Automatic MIME-type detection & integrity pre-flight check',
        'Zero client-side credential exposure',
      ],
      icon: Layers,
    },
    {
      num: '02',
      name: 'Understand',
      title: 'Intent Parsing & Parameter Structuring',
      subtitle: 'Deconstruct requirements into an execution blueprint',
      summary:
        'Our intelligence layer dissects your request into target objectives, required parameters, and dependencies. It identifies data types, column headers, and critical fields.',
      keyAspects: [
        'Extraction of key fields (Vendor, Dates, Totals)',
        'Heuristic parsing combined with model reasoning',
        'Pre-calculation of dataset dimensions & data hygiene',
      ],
      icon: Cpu,
    },
    {
      num: '03',
      name: 'Process',
      title: 'Deterministic Computation & Synthesis',
      subtitle: 'Precise mathematical logic merged with AI generation',
      summary:
        'For data analysis, server code computes exact mathematical statistics (sums, averages, medians) to guarantee zero numerical hallucination. For text and proposals, sophisticated business language synthesis takes over.',
      keyAspects: [
        '100% deterministic code calculations for financial math',
        'Gemini 3.8 Flash neural synthesis for executive tone',
        'Domain-specific business frameworks applied',
      ],
      icon: Database,
    },
    {
      num: '04',
      name: 'Verify',
      title: 'Human-in-the-Loop Safeguards & Audit',
      subtitle: 'Supervisor sign-off gatekeeper before external action',
      summary:
        'Every draft, extracted invoice table, and proposal is flagged with verification confidence scores. Missing or uncertain fields are highlighted for immediate human review.',
      keyAspects: [
        'Visual confidence badges for missing/uncertain fields',
        'Safe Mode enforced: No emails or mutations dispatched automatically',
        'Full execution duration telemetry and audit records',
      ],
      icon: ShieldCheck,
    },
    {
      num: '05',
      name: 'Result',
      title: 'Publication-Grade Deliverables & Export',
      subtitle: 'Multi-format downloads and operational handoff',
      summary:
        'The final verified deliverable is rendered in formatted Markdown, tabular CSV, or TXT. Users can copy with one click, download clean datasets, or hand off directly to downstream teams.',
      keyAspects: [
        'One-click clipboard copy with verified feedback',
        'Direct CSV and TXT download buttons',
        'Session history preserved for review and comparison',
      ],
      icon: CheckCircle2,
    },
  ];

  const current = stages[activeStage];
  const IconComponent = current.icon;

  return (
    <section id="workflow" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Workflow className="w-3.5 h-3.5" />
          <span>Interactive 3D Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Mesara AI Automates Work
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Click any 3D node or stage button below to explore the five interconnected phases of our autonomous task pipeline.
        </p>
      </div>

      {/* 3D Interactive Workflow Canvas */}
      <div className="rounded-3xl bg-[#090F1F] border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#070B14]/80 px-3 py-1.5 rounded-full border border-slate-700/80 text-[11px] text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Active: {current.name} (Stage {current.num})</span>
        </div>

        <WorkflowScene3D
          activeStageIndex={activeStage}
          onSelectStage={(idx) => setActiveStage(idx)}
        />

        {/* 5 Stage Horizontal Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
          {stages.map((st, idx) => {
            const isSelected = activeStage === idx;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-cyan-400/80 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-[#0B1120] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {st.num}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </div>
                <div className="text-xs font-bold leading-tight truncate">
                  {st.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Stage Explanation Card */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  STAGE {current.num}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {current.name} Phase
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {current.title}
              </h3>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 self-start md:self-auto">
            {current.subtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Operational Objective
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {current.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Technical Safeguards
            </h4>
            <div className="space-y-2">
              {current.keyAspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-300 bg-[#070B14] p-2.5 rounded-lg border border-slate-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{aspect}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
