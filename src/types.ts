export type TaskCategory =
  | 'sales-reporting'
  | 'email-drafting'
  | 'document-summary'
  | 'feedback-analysis'
  | 'social-content'
  | 'business-proposal'
  | 'csv-analysis'
  | 'meeting-notes'
  | 'document-qa'
  | 'general';

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export type TaskStatus =
  | 'idle'
  | 'request_received'
  | 'analysing'
  | 'plan_ready'
  | 'awaiting_approval'
  | 'executing'
  | 'reviewing'
  | 'completed'
  | 'failed';

export interface PlanStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

export interface ExternalIntegration {
  name: string;
  status: 'simulated' | 'ready' | 'external_required';
  description: string;
}

export interface TaskPlan {
  originalRequest: string;
  taskObjective: string;
  category: TaskCategory;
  priority: TaskPriority;
  stepsRequired: PlanStep[];
  requiredInputData: string[];
  expectedOutput: string;
  risksOrMissingInfo: string[];
  externalIntegrations: ExternalIntegration[];
}

export interface CsvColumnSummary {
  name: string;
  type: 'numeric' | 'string' | 'date';
  count: number;
  nullCount: number;
  uniqueValues?: number;
  min?: number;
  max?: number;
  sum?: number;
  mean?: number;
  median?: number;
  topCategories?: { value: string; count: number }[];
}

export interface CsvStats {
  rowCount: number;
  columnCount: number;
  columns: CsvColumnSummary[];
  sampleRows: Record<string, string | number>[];
  rawPreview?: string;
}

export interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  content: string;
  csvStats?: CsvStats;
  base64?: string;
}

export interface TaskExecutionResult {
  id: string;
  taskId: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  summary: string;
  output: string;
  keyFindings: string[];
  warningsAndLimitations: string[];
  csvStats?: CsvStats;
  durationMs: number;
  timestamp: string;
  isRealAI: boolean;
  status: 'completed' | 'failed';
  errorMessage?: string;
  plan: TaskPlan;
  fileInfo?: {
    name: string;
    size: number;
  };
}

export interface DemoPreset {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  badge: string;
  description: string;
  prompt: string;
  fileName?: string;
  fileContent?: string;
  fileType?: string;
  sampleOutputNote?: string;
}

export interface AutomationTemplate {
  id: string;
  title: string;
  category: TaskCategory;
  badge: string;
  description: string;
  samplePrompt: string;
  icon: string;
  priority: TaskPriority;
  hasSampleFile?: boolean;
  sampleFileName?: string;
  sampleFileContent?: string;
}

export interface CustomAutomationLead {
  customerName: string;
  companyName: string;
  businessEmail: string;
  businessType: string;
  currentProcess: string;
  automationRequirement: string;
  taskFrequency: string;
}

export interface PreparedRequirementDoc {
  specId: string;
  timestamp: string;
  lead: CustomAutomationLead;
  estimatedHoursSavedPerMonth: number;
  complexityLevel: 'Low' | 'Medium' | 'High';
  recommendedIntegrations: string[];
  architecturalOverview: string;
  suggestedRoadmap: { phase: string; title: string; duration: string }[];
}
