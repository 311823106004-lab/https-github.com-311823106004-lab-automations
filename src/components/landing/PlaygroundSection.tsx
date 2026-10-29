import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  BarChart3,
  Mail,
  FileCheck2,
  UploadCloud,
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Table,
  Layers,
  ArrowRight,
  ShieldCheck,
  Edit2,
  Save,
} from 'lucide-react';
import { SAMPLE_SALES_CSV } from '../../data/templatesAndDemos';

export type DemoTab = 'document' | 'data' | 'email' | 'report';

interface PlaygroundSectionProps {
  activeTab: DemoTab;
  onTabChange: (tab: DemoTab) => void;
  hasGeminiKey: boolean;
}

export const PlaygroundSection: React.FC<PlaygroundSectionProps> = ({
  activeTab,
  onTabChange,
  hasGeminiKey,
}) => {
  // Workflow step state for the active demo: 'input' | 'processing' | 'result'
  const [demoStep, setDemoStep] = useState<'input' | 'processing' | 'result'>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // ----------------------------------------------------
  // DEMO A: Document Automation State
  // ----------------------------------------------------
  const sampleInvoices = [
    {
      id: 'inv-1',
      title: 'Acme Cloud Infrastructure LLC',
      badge: 'SaaS Hosting Invoice',
      text: `INVOICE #INV-2024-8842
Date: 2024-10-18
Billed By: Acme Cloud Infrastructure LLC (Tax ID: 94-882190)
Customer: Mesara AI Demonstration Client
Payment Terms: Net 30 Days

Line Items:
1. Cloud Compute Dedicated Cluster (US-East) - Qty: 2 @ $1,650.00 = $3,300.00
2. Automated Backup & Disaster Recovery Tier 1 - Qty: 1 @ $850.00 = $850.00
3. Enterprise SLA & 24/7 Priority Support - Qty: 1 @ $324.25 = $324.25

Subtotal: $4,474.25
Tax (8.25%): $369.13
Total Amount Due: $4,843.38`,
    },
    {
      id: 'inv-2',
      title: 'Global Freight Logistics Corp',
      badge: 'Supply Chain Receipt',
      text: `COMMERCIAL INVOICE #GFL-99210
Date: 2024-10-22
Supplier: Global Freight Logistics Corp
Customer: Horizon Distribution Hub
Payment Terms: Net 15 Days (Review Required)

Line Items:
1. Intermodal Container Shipping (Pacific Route) - Qty: 3 @ $2,400.00 = $7,200.00
2. Customs Clearance & Brokerage Handling - Qty: 1 @ $650.00 = $650.00
3. Port Drayage & Fuel Surcharge - Qty: 3 @ $185.00 = $555.00

Subtotal: $8,405.00
Tax: $0.00 (Exempt)
Total Amount Due: $8,405.00`,
    },
  ];

  const [docText, setDocText] = useState(sampleInvoices[0].text);
  const [docResult, setDocResult] = useState<any>(null);
  const [editingDocField, setEditingDocField] = useState<string | null>(null);

  // ----------------------------------------------------
  // DEMO B: Data Automation State
  // ----------------------------------------------------
  const [csvInput, setCsvInput] = useState(SAMPLE_SALES_CSV);
  const [csvStatsResult, setCsvStatsResult] = useState<any>(null);
  const [csvSummaryText, setCsvSummaryText] = useState<string>('');

  // ----------------------------------------------------
  // DEMO C: Email Automation State
  // ----------------------------------------------------
  const emailScenarios = [
    {
      title: 'Quarter-End Incident De-escalation',
      prompt:
        'A monthly financial data batch was delayed by 3 hours during quarter-end close. Issue is 100% resolved without data loss. Draft a de-escalation email for enterprise client CFO Michael Vance offering a 20% billing credit and a 15-minute engineering briefing.',
    },
    {
      title: 'New Enterprise Onboarding Welcome',
      prompt:
        'Welcome new enterprise logistics client Apex Logistics following their contract sign-off. Outline the 3-week deployment roadmap, introduce their dedicated Technical Account Manager, and request their technical API webhook contacts.',
    },
    {
      title: 'Annual Contract Renewal & Expansion',
      prompt:
        'Draft an annual renewal outreach email to VP of Operations Sarah Jenkins. Highlight their team’s 140+ hours saved per month, propose expanding their license tier to APAC subsidiaries, and offer a locked-in multi-year rate.',
    },
  ];

  const [emailScenarioPrompt, setEmailScenarioPrompt] = useState(emailScenarios[0].prompt);
  const [emailTone, setEmailTone] = useState('Empathetic & Accountable');
  const [emailResult, setEmailResult] = useState<string>('');

  // ----------------------------------------------------
  // DEMO D: Report Automation State
  // ----------------------------------------------------
  const reportTopics = [
    {
      title: 'Enterprise Workflow Automation ROI & Productivity Analysis',
      topic:
        'Prepare an executive business report analyzing the economic return on investment (ROI) of autonomous back-office agents versus manual ticketing overhead. Include timeline to value, labor reallocation metrics, and governance requirements.',
    },
    {
      title: 'Q3 Enterprise Sales Performance & APAC Growth',
      topic:
        'Generate an executive Q3 sales review evaluating our enterprise software product tiers, regional growth velocity in Asia-Pacific, deal cycle reduction, and strategic growth priorities for Q4.',
    },
  ];

  const [reportTopicPrompt, setReportTopicPrompt] = useState(reportTopics[0].topic);
  const [reportResult, setReportResult] = useState<any>(null);

  // Execution Duration Tracker
  const [lastDurationMs, setLastDurationMs] = useState(1200);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------
  const handleRunDocumentAutomation = async () => {
    setIsProcessing(true);
    setDemoStep('processing');
    const start = Date.now();

    try {
      const res = await fetch('/api/agent/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          fileName: 'Uploaded_Invoice.pdf',
        }),
      });

      const data = await res.json();
      setDocResult(data);
      setLastDurationMs(Date.now() - start);
      setDemoStep('result');
    } catch (err: any) {
      console.error('Doc extraction failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunDataAutomation = async () => {
    setIsProcessing(true);
    setDemoStep('processing');
    const start = Date.now();

    try {
      // 1. Calculate deterministic statistics
      const parseRes = await fetch('/api/agent/parse-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: csvInput }),
      });

      const stats = await parseRes.json();
      setCsvStatsResult(stats);

      // 2. Generate executive business insights
      const execRes = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Analyze this operational dataset and generate an executive summary with verified metrics.',
          category: 'csv-analysis',
          priority: 'high',
          csvStats: stats,
          fileContent: csvInput,
          fileName: 'sales_dataset.csv',
        }),
      });

      const execData = await execRes.json();
      setCsvSummaryText(execData.output);
      setLastDurationMs(Date.now() - start);
      setDemoStep('result');
    } catch (err: any) {
      console.error('Data automation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunEmailAutomation = async () => {
    setIsProcessing(true);
    setDemoStep('processing');
    const start = Date.now();

    try {
      const execRes = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${emailScenarioPrompt} (Tone: ${emailTone})`,
          category: 'email-drafting',
          priority: 'urgent',
        }),
      });

      const execData = await execRes.json();
      setEmailResult(execData.output);
      setLastDurationMs(Date.now() - start);
      setDemoStep('result');
    } catch (err: any) {
      console.error('Email drafting failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunReportAutomation = async () => {
    setIsProcessing(true);
    setDemoStep('processing');
    const start = Date.now();

    try {
      const execRes = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: reportTopicPrompt,
          category: 'business-proposal',
          priority: 'high',
        }),
      });

      const execData = await execRes.json();
      setReportResult(execData);
      setLastDurationMs(Date.now() - start);
      setDemoStep('result');
    } catch (err: any) {
      console.error('Report generation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerActiveDemo = () => {
    if (activeTab === 'document') handleRunDocumentAutomation();
    else if (activeTab === 'data') handleRunDataAutomation();
    else if (activeTab === 'email') handleRunEmailAutomation();
    else if (activeTab === 'report') handleRunReportAutomation();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsvFromDoc = () => {
    if (!docResult) return;
    const headers = ['Line_Item', 'Quantity', 'Unit_Price', 'Line_Total'];
    const rows = docResult.lineItems.map((item: any) => [
      `"${item.description}"`,
      item.quantity,
      item.unitPrice,
      item.total,
    ]);
    const summaryRows = [
      ['SUBTOTAL', '', '', docResult.subtotal],
      ['TAX', '', '', docResult.tax],
      ['TOTAL_DUE', '', '', docResult.total],
    ];
    const csvStr = [headers.join(','), ...rows.map((r: any) => r.join(',')), ...summaryRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docResult.invoiceNumber || 'extracted_invoice'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="playground" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Live Sandbox</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experience Automation Yourself
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Select any of the 4 live working demonstrations below. Ingest real inputs, trigger autonomous processing, and inspect verifiable results.
        </p>
      </div>

      {/* Workflow Progress Breadcrumb Visual: Input -> Processing -> Result */}
      <div className="max-w-xl mx-auto mb-10 p-2.5 rounded-2xl bg-[#090F1E] border border-slate-800 flex items-center justify-between text-xs font-bold">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            demoStep === 'input'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-mono">
            1
          </span>
          <span>Input Directive</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600" />

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            demoStep === 'processing'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-mono">
            2
          </span>
          <span>Processing Engine</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600" />

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            demoStep === 'result'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-mono">
            3
          </span>
          <span>Verified Result</span>
        </div>
      </div>

      {/* 4 Demo Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {[
          { id: 'document' as const, label: 'Document Automation', icon: FileText, badge: 'Invoice OCR' },
          { id: 'data' as const, label: 'Data Automation', icon: BarChart3, badge: 'Deterministic Stats' },
          { id: 'email' as const, label: 'Email Automation', icon: Mail, badge: 'Safe Mode' },
          { id: 'report' as const, label: 'Report Automation', icon: FileCheck2, badge: 'Executive' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setDemoStep('input');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/50 shadow-lg shadow-blue-500/20'
                  : 'bg-[#0A1020] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Demo Playground Shell */}
      <div className="rounded-3xl bg-[#0B1120] border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* ==================================================== */}
        {/* DEMO A: DOCUMENT AUTOMATION */}
        {/* ==================================================== */}
        {activeTab === 'document' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400">DEMO A</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-white">Invoice Field Extraction & Validation</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracts supplier, line items, and financial totals into an editable audit table with uncertainty flags.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Load Preset:</span>
                {sampleInvoices.map((inv, idx) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setDocText(inv.text);
                      setDemoStep('input');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {demoStep !== 'result' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Raw Document / Invoice Text
                  </label>
                  <textarea
                    rows={12}
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    className="w-full rounded-2xl bg-[#070B14] border border-slate-700/80 p-4 font-mono text-xs text-slate-200 focus:border-blue-500 outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    *Edit text directly or choose a sample preset above.
                  </p>
                </div>

                <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#080E1C] border border-blue-500/20">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Extraction Capabilities
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Parses supplier name, invoice reference, and date formats</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Isolates individual billable line items and unit rates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Flags uncertain or missing values for supervisor audit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Exports directly to CSV spreadsheet for ERP import</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleRunDocumentAutomation}
                      disabled={isProcessing}
                      className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isProcessing ? 'Extracting Fields...' : 'Run Document Automation'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* RESULT VIEW: Editable Table */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0E172B] border border-blue-500/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Extraction Verified
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-300 font-mono">
                        {docResult?.invoiceNumber}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {(lastDurationMs / 1000).toFixed(2)}s runtime
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{docResult?.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownloadCsvFromDoc}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </button>
                    <button
                      onClick={() => setDemoStep('input')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Another Document</span>
                    </button>
                  </div>
                </div>

                {/* Key Metadata Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                      Supplier
                    </span>
                    <p className="text-xs font-bold text-white mt-1 truncate">
                      {docResult?.supplier}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                      Invoice Date
                    </span>
                    <p className="text-xs font-bold text-white mt-1 font-mono">
                      {docResult?.date}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                      Total Due
                    </span>
                    <p className="text-xs font-extrabold text-cyan-400 mt-1 font-mono">
                      ${docResult?.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                      Payment Terms
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-bold text-white font-mono">
                        {docResult?.paymentTerms}
                      </span>
                      {docResult?.fieldsStatus?.paymentTerms === 'review_required' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extracted Line Items Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#070B14] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3 text-right">Confidence Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono">
                      {docResult?.lineItems?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/20">
                          <td className="p-3 font-sans text-white font-medium">
                            {item.description}
                          </td>
                          <td className="p-3 text-slate-300">{item.quantity}</td>
                          <td className="p-3 text-slate-300">
                            ${item.unitPrice?.toFixed(2)}
                          </td>
                          <td className="p-3 text-cyan-300 font-bold">
                            ${item.total?.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* DEMO B: DATA AUTOMATION */}
        {/* ==================================================== */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">DEMO B</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-white">CSV Data Analysis & Statistics Engine</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Computes verified sums, averages, cohort breakdowns, and strategic business conclusions.
                </p>
              </div>

              <button
                onClick={() => {
                  setCsvInput(SAMPLE_SALES_CSV);
                  setDemoStep('input');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer self-start sm:self-auto"
              >
                Reset Sample Sales CSV
              </button>
            </div>

            {demoStep !== 'result' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Tabular CSV Data Input
                  </label>
                  <textarea
                    rows={12}
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="w-full rounded-2xl bg-[#070B14] border border-slate-700/80 p-4 font-mono text-xs text-slate-200 focus:border-blue-500 outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    *Real mathematical calculations executed on the server.
                  </p>
                </div>

                <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#080E1C] border border-cyan-500/20">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      Zero-Hallucination Mathematics
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      When analyzing financial and operational data, Mesara AI first calculates exact numeric sums, averages, and counts deterministically in code. The intelligence model then explains these verified figures instead of guessing them.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 text-xs text-slate-400 space-y-1">
                      <span className="font-semibold text-slate-200 block">Dataset Sample:</span>
                      <p className="text-[11px]">15 Enterprise sales records across North America, Europe, APAC, Latin America & Middle East.</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleRunDataAutomation}
                      disabled={isProcessing}
                      className="w-full py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isProcessing ? 'Calculating Statistics...' : 'Run Data Automation'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* RESULT VIEW: Calculated CSV Stats & Analysis */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0E172B] border border-cyan-500/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Deterministic Calculation Complete
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-300 font-mono">
                        {csvStatsResult?.rowCount} rows analyzed
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Verified mathematical metrics computed across {csvStatsResult?.columnCount} dimensions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownloadTxt('Mesara_Data_Report.txt', csvSummaryText)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report</span>
                    </button>
                    <button
                      onClick={() => setDemoStep('input')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Another Dataset</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#070B14] text-slate-400 uppercase text-[10px] tracking-wider font-sans border-b border-slate-800">
                      <tr>
                        <th className="p-3">Column Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Sum / Total</th>
                        <th className="p-3">Average (Mean)</th>
                        <th className="p-3">Median</th>
                        <th className="p-3">Min / Max</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {csvStatsResult?.columns?.map((col: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/20">
                          <td className="p-3 font-semibold text-white">{col.name}</td>
                          <td className="p-3 text-slate-400 uppercase text-[10px]">
                            {col.type}
                          </td>
                          <td className="p-3 text-cyan-300 font-bold">
                            {col.sum !== undefined ? `$${col.sum.toLocaleString()}` : 'N/A'}
                          </td>
                          <td className="p-3 text-slate-300">
                            {col.mean !== undefined ? col.mean.toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-3 text-slate-300">
                            {col.median !== undefined ? col.median.toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-3 text-slate-400">
                            {col.min !== undefined ? `[${col.min} - ${col.max}]` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Synthesis Summary */}
                <div className="p-6 rounded-2xl bg-[#070B14] border border-slate-800 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
                  {csvSummaryText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* DEMO C: EMAIL AUTOMATION */}
        {/* ==================================================== */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">DEMO C</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-white">Safe-Mode Business Email Drafting</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates empathetic, context-aware correspondence for customer escalations and executive communications.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Safe Mode Active: Never Sent Automatically</span>
              </div>
            </div>

            {demoStep !== 'result' ? (
              <div className="space-y-5">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Quick Scenario Presets:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {emailScenarios.map((scen, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEmailScenarioPrompt(scen.prompt)}
                        className="p-3 rounded-xl bg-[#080E1E] border border-slate-800 hover:border-indigo-500/40 text-left text-xs transition cursor-pointer"
                      >
                        <p className="font-bold text-white mb-1">{scen.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {scen.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Email Purpose & Scenario Instructions
                    </label>
                    <textarea
                      rows={6}
                      value={emailScenarioPrompt}
                      onChange={(e) => setEmailScenarioPrompt(e.target.value)}
                      className="w-full rounded-2xl bg-[#070B14] border border-slate-700/80 p-4 text-xs text-slate-200 focus:border-indigo-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Calibration Tone
                      </label>
                      <select
                        value={emailTone}
                        onChange={(e) => setEmailTone(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#070B14] border border-slate-700 text-xs text-white outline-none"
                      >
                        <option value="Empathetic & Accountable">Empathetic & Accountable</option>
                        <option value="Warm & Welcoming">Warm & Welcoming</option>
                        <option value="Firm & Direct">Firm & Direct</option>
                        <option value="Executive & Persuasive">Executive & Persuasive</option>
                      </select>
                    </div>

                    <button
                      onClick={handleRunEmailAutomation}
                      disabled={isProcessing}
                      className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-4"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isProcessing ? 'Synthesizing Draft...' : 'Generate Email Draft'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* RESULT VIEW: Email Draft */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0E172B] border border-indigo-500/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Email Draft Formulated
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {(lastDurationMs / 1000).toFixed(2)}s runtime
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Ready for human review and copy. Safe Mode enforced.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(emailResult)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadTxt('customer_email_draft.txt', emailResult)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download TXT</span>
                    </button>
                    <button
                      onClick={() => setDemoStep('input')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Another</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#070B14] border border-slate-800 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {emailResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* DEMO D: REPORT AUTOMATION */}
        {/* ==================================================== */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400">DEMO D</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-white">Executive Business Report Synthesis</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates structured reports with executive summary, verified observations, and actionable recommendations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {reportTopics.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setReportTopicPrompt(item.topic);
                      setDemoStep('input');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Topic {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {demoStep !== 'result' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Report Topic Directive or Business Context
                  </label>
                  <textarea
                    rows={6}
                    value={reportTopicPrompt}
                    onChange={(e) => setReportTopicPrompt(e.target.value)}
                    className="w-full rounded-2xl bg-[#070B14] border border-slate-700/80 p-4 text-xs text-slate-200 focus:border-purple-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-[#080E1C] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    <strong className="text-white block mb-0.5">Zero-Fabrication Discipline:</strong>
                    The agent structures findings into executive takeaways, challenges, and strategic priorities without inventing statistics.
                  </div>

                  <button
                    onClick={handleRunReportAutomation}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isProcessing ? 'Generating Report...' : 'Generate Executive Report'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* RESULT VIEW: Report Output */
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0E172B] border border-purple-500/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Executive Report Formulated
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {(lastDurationMs / 1000).toFixed(2)}s runtime
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{reportResult?.summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(reportResult?.output || '')}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Report'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadTxt('executive_business_report.txt', reportResult?.output || '')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download TXT</span>
                    </button>
                    <button
                      onClick={() => setDemoStep('input')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Another Topic</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#070B14] border border-slate-800 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {reportResult?.output}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
