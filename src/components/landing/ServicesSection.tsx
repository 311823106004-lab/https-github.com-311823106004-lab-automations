import React, { useState } from 'react';
import {
  FileText,
  BarChart3,
  Mail,
  Workflow,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ServiceCard3D } from '../3d/ServiceCard3D';

interface ServicesSectionProps {
  onTryDemo: (demoType: 'document' | 'data' | 'email' | 'report') => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onTryDemo }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const services = [
    {
      id: 'document' as const,
      demoTarget: 'document' as const,
      badge: 'OCR & Parsing',
      title: 'DOCUMENT AUTOMATION',
      subtitle: 'Extract and organise information from documents.',
      description:
        'Transform PDF invoices, agreements, and receipts into verified structured records with automated missing-field flagging and CSV export.',
      capabilities: [
        'Automatic field extraction (Supplier, Total, Dates)',
        'Heuristic & AI confidence validation flags',
        'Direct CSV / ERP database export',
      ],
      colorClass: 'border-blue-500/30 group-hover:border-blue-500/60',
    },
    {
      id: 'data' as const,
      demoTarget: 'data' as const,
      badge: 'Deterministic Analytics',
      title: 'DATA AUTOMATION',
      subtitle: 'Turn spreadsheets into useful reports and insights.',
      description:
        'Calculate verifiable sums, cohort distributions, and KPIs from uploaded CSV spreadsheets without numerical hallucination.',
      capabilities: [
        'Deterministic mathematical computation',
        'Cohort breakdown & dynamic visual charts',
        'Executive data briefings & anomaly detection',
      ],
      colorClass: 'border-cyan-500/30 group-hover:border-cyan-500/60',
    },
    {
      id: 'email' as const,
      demoTarget: 'email' as const,
      badge: 'Safe Mode Drafting',
      title: 'EMAIL AUTOMATION',
      subtitle: 'Create professional emails from simple instructions.',
      description:
        'Generate empathetic, context-aware correspondence for customer escalations, contract onboarding, and business follow-ups.',
      capabilities: [
        'Executive tone calibration & de-escalation',
        'Draft safe-mode: Human approval gate required',
        'Instant 1-click clipboard copy & TXT export',
      ],
      colorClass: 'border-indigo-500/30 group-hover:border-indigo-500/60',
    },
    {
      id: 'workflow' as const,
      demoTarget: 'report' as const,
      badge: 'Autonomous Pipelines',
      title: 'BUSINESS WORKFLOWS',
      subtitle: 'Simplify repetitive business processes.',
      description:
        'Synthesize comprehensive business proposals, RACI meeting minutes, and quarterly reports from unstructured notes.',
      capabilities: [
        'Structured executive deliverables & recommendations',
        'Multi-stage verification and risk assessments',
        'Human supervisor review protocol',
      ],
      colorClass: 'border-purple-500/30 group-hover:border-purple-500/60',
    },
  ];

  return (
    <section id="services" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Award-Class Enterprise Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Intelligent Automation Solutions
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Discover how Mesara AI turns manual data entry, scattered documents, and complex reports into seamless, high-speed business operations.
        </p>
      </div>

      {/* 4 3D Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {services.map((svc) => (
          <div
            key={svc.id}
            onMouseEnter={() => setHoveredCard(svc.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`rounded-2xl bg-gradient-to-b from-[#0E172F] to-[#0A1020] border ${svc.colorClass} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 group`}
          >
            <div>
              {/* 3D Interactive Illustration */}
              <div className="mb-2 relative rounded-xl bg-[#070B14]/70 border border-slate-800/80 overflow-hidden">
                <ServiceCard3D type={svc.id} isHovered={hoveredCard === svc.id} />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {svc.badge}
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors mt-3">
                {svc.title}
              </h3>
              <p className="text-xs font-semibold text-blue-400 mt-1">
                {svc.subtitle}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                {svc.description}
              </p>

              {/* Bullet points */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                {svc.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Try Demo Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => onTryDemo(svc.demoTarget)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-500/30 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md group-hover:shadow-blue-600/30"
              >
                <span>Try Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
