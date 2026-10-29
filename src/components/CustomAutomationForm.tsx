import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Building,
  Mail,
  User,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CustomAutomationLead, PreparedRequirementDoc } from '../types';

export const CustomAutomationForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomAutomationLead>({
    customerName: '',
    companyName: '',
    businessEmail: '',
    businessType: '',
    currentProcess: '',
    automationRequirement: '',
    taskFrequency: 'Daily (High Volume)',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [preparedDoc, setPreparedDoc] = useState<PreparedRequirementDoc | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.companyName.trim()) {
      setErrorMsg('Please enter your enterprise company name.');
      return;
    }
    if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (!formData.automationRequirement.trim()) {
      setErrorMsg('Please describe what automation you require.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/lead/requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to prepare automation specification.');
      }

      const doc = await res.json();
      setPreparedDoc(doc);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error formulating requirement specification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySpec = () => {
    if (!preparedDoc) return;
    const text = `MESARA AI CUSTOM AUTOMATION SPECIFICATION
Reference ID: ${preparedDoc.specId}
Prepared Date: ${new Date(preparedDoc.timestamp).toLocaleString()}

CLIENT INFORMATION:
Customer: ${preparedDoc.lead.customerName}
Company: ${preparedDoc.lead.companyName}
Email: ${preparedDoc.lead.businessEmail}
Business Type: ${preparedDoc.lead.businessType}

CURRENT WORKFLOW CHALLENGE:
${preparedDoc.lead.currentProcess}

TARGET AUTOMATION DIRECTIVE:
${preparedDoc.lead.automationRequirement}
Frequency: ${preparedDoc.lead.taskFrequency}

PRELIMINARY ARCHITECTURAL ASSESSMENT:
Estimated Time Saved: ~${preparedDoc.estimatedHoursSavedPerMonth} hours / month
Complexity Tier: ${preparedDoc.complexityLevel}
Recommended Integrations: ${preparedDoc.recommendedIntegrations.join(', ')}

ARCHITECTURE OVERVIEW:
${preparedDoc.architecturalOverview}

SUGGESTED IMPLEMENTATION ROADMAP:
${preparedDoc.suggestedRoadmap.map((r) => `- [${r.phase}] ${r.title} (${r.duration})`).join('\n')}

Notice: Prepared locally in presentation sandbox. To submit directly to Mesara AI enterprise architects, contact enterprise@mesara.ai.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpec = () => {
    if (!preparedDoc) return;
    const text = `MESARA AI CUSTOM AUTOMATION SPECIFICATION
Reference ID: ${preparedDoc.specId}
Prepared Date: ${new Date(preparedDoc.timestamp).toLocaleString()}

CLIENT INFORMATION:
Customer: ${preparedDoc.lead.customerName}
Company: ${preparedDoc.lead.companyName}
Email: ${preparedDoc.lead.businessEmail}
Business Type: ${preparedDoc.lead.businessType}

CURRENT WORKFLOW CHALLENGE:
${preparedDoc.lead.currentProcess}

TARGET AUTOMATION DIRECTIVE:
${preparedDoc.lead.automationRequirement}
Frequency: ${preparedDoc.lead.taskFrequency}

PRELIMINARY ARCHITECTURAL ASSESSMENT:
Estimated Time Saved: ~${preparedDoc.estimatedHoursSavedPerMonth} hours / month
Complexity Tier: ${preparedDoc.complexityLevel}
Recommended Integrations: ${preparedDoc.recommendedIntegrations.join(', ')}

ARCHITECTURE OVERVIEW:
${preparedDoc.architecturalOverview}

SUGGESTED IMPLEMENTATION ROADMAP:
${preparedDoc.suggestedRoadmap.map((r) => `- [${r.phase}] ${r.title} (${r.duration})`).join('\n')}
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${preparedDoc.specId}_requirement_spec.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Enterprise Solutions</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Request a Custom Automation
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Have unique internal workflows, custom ERPs, or specific compliance requirements? Fill out your parameters below to formulate a tailored AI Agent Architecture Specification.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Customer Name <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Jane Doe"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Company Name <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Acme Logistics Corp"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Business Email <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.businessEmail}
                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                placeholder="jane@acme.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Business Type / Industry
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                placeholder="e.g. Healthcare, Supply Chain, SaaS"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Current Manual Process */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Current Manual Process & Friction Points
          </label>
          <textarea
            rows={3}
            value={formData.currentProcess}
            onChange={(e) => setFormData({ ...formData, currentProcess: e.target.value })}
            placeholder="Describe how your team currently handles this task (e.g. manual spreadsheets, repetitive email sorting, slow contract reviews)..."
            className="w-full p-3 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none leading-relaxed"
          />
        </div>

        {/* Automation Requirement */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Target Automation Requirement <span className="text-blue-400">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={formData.automationRequirement}
            onChange={(e) => setFormData({ ...formData, automationRequirement: e.target.value })}
            placeholder="What should the autonomous agent accomplish? What inputs, outputs, and system integrations are required?"
            className="w-full p-3 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none leading-relaxed"
          />
        </div>

        {/* Estimated Task Frequency */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Estimated Task Frequency
          </label>
          <select
            value={formData.taskFrequency}
            onChange={(e) => setFormData({ ...formData, taskFrequency: e.target.value })}
            className="w-full p-3 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white focus:border-blue-500 outline-none"
          >
            <option value="Daily (High Volume - 100+ tasks/day)">Daily (High Volume - 100+ tasks/day)</option>
            <option value="Daily (Moderate - 10-50 tasks/day)">Daily (Moderate - 10-50 tasks/day)</option>
            <option value="Weekly (Batch Operations)">Weekly (Batch Operations)</option>
            <option value="Monthly (Quarterly / Periodic Close)">Monthly (Quarterly / Periodic Close)</option>
            <option value="On-Demand / Continuous Trigger">On-Demand / Continuous Trigger</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            *Generates instant architecture evaluation
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <FileCode2 className="w-4 h-4" />
            <span>{isLoading ? 'Formulating Specification...' : 'Prepare My Automation Requirement'}</span>
          </button>
        </div>
      </form>

      {/* Generated Requirement Specification Display */}
      {preparedDoc && (
        <div className="rounded-2xl bg-[#0C1630] border border-blue-500/40 p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {preparedDoc.specId}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">
                  Specification Formulated
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Custom Agent Architecture Specification
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySpec}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Spec'}</span>
              </button>
              <button
                onClick={handleDownloadSpec}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Spec</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#080E1E] border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Time Saved</span>
              <p className="text-xl font-extrabold text-cyan-400 font-mono mt-1">
                ~{preparedDoc.estimatedHoursSavedPerMonth} hrs / mo
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#080E1E] border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Complexity Tier</span>
              <p className="text-xl font-extrabold text-white font-mono mt-1">
                {preparedDoc.complexityLevel}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#080E1E] border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Target Company</span>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {preparedDoc.lead.companyName}
              </p>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Agent Architecture Blueprint
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#080E1E] p-4 rounded-xl border border-slate-800">
              {preparedDoc.architecturalOverview}
            </p>
          </div>

          {/* Roadmap */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Estimated Deployment Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {preparedDoc.suggestedRoadmap.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#080E1E] border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono text-blue-400 font-bold block mb-1">
                    {item.phase}
                  </span>
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{item.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-[#080E1E] border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Sandbox Notice:</strong> This requirement was structured locally for evaluation and presentation. No external outbound email was transmitted. Present this document directly to your Mesara AI representative or contact <em>enterprise@mesara.ai</em>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
