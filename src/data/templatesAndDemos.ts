import { AutomationTemplate, DemoPreset } from '../types';

export const SAMPLE_SALES_CSV = `Region,Sales_Rep,Product_Line,Quarter,Units_Sold,Revenue_USD,Customer_Satisfaction_Score
North America,Sarah Jenkins,Enterprise Agent Hub,Q3,48,288000,4.8
Europe,Lucas Moreau,Enterprise Agent Hub,Q3,35,210000,4.6
Asia-Pacific,Kenji Sato,Workflow Orchestrator,Q3,62,186000,4.9
North America,David Miller,Workflow Orchestrator,Q3,54,162000,4.5
Europe,Elena Rossi,Document AI Suite,Q3,78,156000,4.7
Latin America,Mateo Gomez,Document AI Suite,Q3,42,84000,4.4
Asia-Pacific,Anya Patel,Enterprise Agent Hub,Q3,28,168000,4.9
Middle East,Tariq Al-Mansoor,Enterprise Agent Hub,Q3,19,114000,4.8
North America,Sarah Jenkins,Support Co-Pilot,Q3,65,97500,4.7
Europe,Lucas Moreau,Support Co-Pilot,Q3,51,76500,4.6
Asia-Pacific,Kenji Sato,Support Co-Pilot,Q3,70,105000,4.9
Latin America,Mateo Gomez,Workflow Orchestrator,Q3,33,99000,4.5
North America,David Miller,Document AI Suite,Q3,60,120000,4.6
Middle East,Tariq Al-Mansoor,Document AI Suite,Q3,25,50000,4.7
Europe,Elena Rossi,Workflow Orchestrator,Q3,46,138000,4.8`;

export const DEMO_PRESETS: Record<'demoA' | 'demoB' | 'demoC', DemoPreset> = {
  demoA: {
    id: 'demo-a',
    title: 'DEMO A: Fictional Sales CSV Analysis & Report',
    category: 'csv-analysis' as const,
    priority: 'high' as const,
    badge: 'Live Data & Real Statistics',
    description: 'Parses Q3 Regional Sales dataset with real mathematical computation, calculates exact regional revenue figures, and prompts Gemini to produce an executive sales strategy report.',
    prompt: 'Analyze our Q3 Regional Sales dataset. Calculate key revenue metrics, identify top-performing regions and product lines, flag any regional underperformance, and provide 3 strategic recommendations for Q4.',
    fileName: 'Q3_Regional_Sales.csv',
    fileContent: SAMPLE_SALES_CSV,
    fileType: 'text/csv',
    sampleOutputNote: 'Calculated via deterministic code + synthesized by Gemini 3.8 Flash.',
  },
  demoB: {
    id: 'demo-b',
    title: 'DEMO B: Rough Meeting Notes to Executive Business Proposal',
    category: 'business-proposal' as const,
    priority: 'urgent' as const,
    badge: 'Strategic Synthesis',
    description: 'Converts unstructured client discovery notes into a high-impact, professional business proposal complete with scope, timeline, deliverables, and financial ROI model.',
    prompt: `Transform these client discovery notes into a formal enterprise business proposal for Apex Logistics:
- Client: Apex Logistics (5,000 employees, 12 regional distribution hubs).
- Current Problem: Customer support team manually triages 4,200 shipping discrepancy emails weekly. 18-minute average handling time per incident. High agent burnout and 12% customer churn risk.
- Solution Requested: Mesara AI Support & Dispatch Agent with automatic ERP lookup, sentiment routing, and auto-generated resolution drafts.
- Goals: Reduce response time under 2 minutes, automate 70% of routine status inquiries, integrate with SAP S/4HANA.
- Budget target: $85,000 implementation with positive ROI in under 4 months.`,
    sampleOutputNote: 'Enterprise-grade RFP proposal generated with executive structure and ROI formulas.',
  },
  demoC: {
    id: 'demo-c',
    title: 'DEMO C: Customer Escalation Scenario to Professional Resolution Email',
    category: 'email-drafting' as const,
    priority: 'urgent' as const,
    badge: 'Safe Mode Draft',
    description: 'Simulates a critical customer service escalation during quarter-end financial close, producing an empathetic, structured resolution email with risk mitigation safeguards.',
    prompt: `Draft a professional de-escalation email for enterprise client CFO Michael Vance at Horizon Global.
Scenario:
- Context: Their monthly automated reconciliation batch was delayed by 3 hours during quarter-end close due to a third-party upstream API outage.
- Current Status: The issue has been 100% resolved, all 14,800 ledger entries reconciled without data loss, and dual-redundancy routing has been permanently activated.
- Remediation: Offer a 20% billing credit on this month's invoice, provide a direct post-incident review (PIR) document, and invite Michael to a 15-minute briefing with our Head of Engineering.
- Tone: Highly professional, accountable, reassuring, and solution-focused.
- Safety Reminder: Draft only. Mark clearly as requiring executive sign-off before dispatch.`,
    sampleOutputNote: 'Generated draft with human-in-the-loop review safeguards.',
  },
};

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'tmpl-sales-report',
    title: 'Sales Report Generator',
    category: 'sales-reporting',
    badge: 'Revenue & Performance',
    description: 'Generates an executive-level performance briefing including KPI breakdowns, growth trajectories, and regional revenue metrics.',
    samplePrompt: 'Generate an executive Q3 sales performance report analyzing revenue trends, quota attainment, average contract values, and key growth drivers for the board meeting.',
    icon: 'TrendingUp',
    priority: 'high',
  },
  {
    id: 'tmpl-ai-email',
    title: 'AI Email Writer',
    category: 'email-drafting',
    badge: 'Safe Mode Draft',
    description: 'Drafts highly persuasive, context-aware business correspondence for client follow-ups, contract negotiations, or partnership inquiries.',
    samplePrompt: 'Draft a polite but firm follow-up email to enterprise prospect Meridian Corp following up on our software demonstration last Thursday, highlighting our custom agent security compliance.',
    icon: 'Mail',
    priority: 'normal',
  },
  {
    id: 'tmpl-doc-summariser',
    title: 'Document Summariser',
    category: 'document-summary',
    badge: 'Executive Briefing',
    description: 'Extracts critical takeaways, key decision points, obligations, and risk factors from complex multi-page business documents.',
    samplePrompt: 'Summarise this enterprise vendor agreement into a 1-page executive brief covering service level agreements (SLAs), termination clauses, data privacy terms, and liability limits.',
    icon: 'FileText',
    priority: 'normal',
  },
  {
    id: 'tmpl-feedback-analyzer',
    title: 'Customer Feedback Analyzer',
    category: 'feedback-analysis',
    badge: 'Sentiment & Churn',
    description: 'Analyzes user reviews, NPS comments, or support tickets to identify common complaints, feature requests, and sentiment scores.',
    samplePrompt: 'Analyze the recent batch of 50 enterprise client feedback submissions. Identify the top 3 recurring pain points, quantify sentiment polarity, and propose immediate operational fixes.',
    icon: 'MessageSquare',
    priority: 'high',
  },
  {
    id: 'tmpl-social-planner',
    title: 'Social Media Content Planner',
    category: 'social-content',
    badge: 'Multi-Channel Campaign',
    description: 'Creates a structured weekly B2B social media content schedule with thought leadership hooks, LinkedIn copy, and tactical call-to-actions.',
    samplePrompt: 'Create a 5-day LinkedIn and Twitter content calendar announcing our new AI automation agent suite, focusing on enterprise productivity, human-in-the-loop safety, and customer case studies.',
    icon: 'Share2',
    priority: 'normal',
  },
  {
    id: 'tmpl-biz-proposal',
    title: 'Business Proposal Generator',
    category: 'business-proposal',
    badge: 'RFP & Client Wins',
    description: 'Transforms client requirements and scope parameters into a comprehensive commercial proposal ready for C-suite review.',
    samplePrompt: 'Generate a comprehensive commercial proposal for implementing autonomous back-office AI agents for a mid-market healthcare provider, covering HIPAA compliance, timeline, and projected savings.',
    icon: 'Briefcase',
    priority: 'urgent',
  },
  {
    id: 'tmpl-csv-analyst',
    title: 'CSV Data Analyst',
    category: 'csv-analysis',
    badge: 'Verified Math',
    description: 'Parses structured tabular data with real deterministic statistics, identifying anomalies, correlation patterns, and revenue opportunities.',
    samplePrompt: 'Perform a comprehensive statistical audit on our uploaded transactional CSV dataset. Compute distribution percentiles, highlight top contributing segments, and recommend optimizations.',
    icon: 'BarChart3',
    priority: 'high',
    hasSampleFile: true,
    sampleFileName: 'Q3_Regional_Sales.csv',
    sampleFileContent: SAMPLE_SALES_CSV,
  },
  {
    id: 'tmpl-meeting-notes',
    title: 'Meeting Notes Summariser',
    category: 'meeting-notes',
    badge: 'Action Items & RACI',
    description: 'Converts unstructured meeting transcripts or rough notes into structured executive minutes with clear owners and delivery deadlines.',
    samplePrompt: 'Transform raw notes from our executive product strategy sync into clean minutes with: 1) Key decisions made, 2) Blockers identified, 3) Action items assigned with realistic deadlines.',
    icon: 'ClipboardList',
    priority: 'normal',
  },
];
