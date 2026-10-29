import React, { useState, useEffect } from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { WorkflowSection } from './components/landing/WorkflowSection';
import { PlaygroundSection, DemoTab } from './components/landing/PlaygroundSection';
import { CtaSection } from './components/landing/CtaSection';
import { ContactModal } from './components/landing/ContactModal';
import { Footer } from './components/landing/Footer';

// AgentHub Full Workspace Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { TaskCreation } from './components/TaskCreation';
import { AgentPlannerModal } from './components/AgentPlannerModal';
import { ProgressTracker } from './components/ProgressTracker';
import { ResultsWorkspace } from './components/ResultsWorkspace';
import { TemplateLibrary } from './components/TemplateLibrary';
import { TaskHistory } from './components/TaskHistory';
import { CustomerDemoMode } from './components/CustomerDemoMode';
import { CustomAutomationForm } from './components/CustomAutomationForm';

import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TaskPlan,
  TaskExecutionResult,
  UploadedFileInfo,
  AutomationTemplate,
} from './types';
import { DEMO_PRESETS } from './data/templatesAndDemos';
import { LayoutDashboard, Globe, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'mesara_agenthub_session_tasks_v1';

export default function App() {
  // Page mode: 'landing' (3D Customer Demo Website) | 'hub' (Enterprise AgentHub Studio)
  const [pageMode, setPageMode] = useState<'landing' | 'hub'>('landing');

  // Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Playground Demo Tab
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<DemoTab>('document');

  // Engine health status
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // -----------------------------------------------------------
  // AgentHub Workspace State
  // -----------------------------------------------------------
  const [currentView, setCurrentView] = useState<string>('overview');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');
  const [statusError, setStatusError] = useState<string | undefined>(undefined);
  const [activePlan, setActivePlan] = useState<TaskPlan | null>(null);
  const [activeResult, setActiveResult] = useState<TaskExecutionResult | null>(null);

  const [taskDraft, setTaskDraft] = useState<{
    prompt: string;
    category: TaskCategory;
    priority: TaskPriority;
    fileInfo: UploadedFileInfo | null;
  }>({
    prompt: '',
    category: 'general',
    priority: 'normal',
    fileInfo: null,
  });

  const [tasks, setTasks] = useState<TaskExecutionResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks:', e);
    }
  }, [tasks]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => setHasGeminiKey(false));
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    if (pageMode !== 'landing') {
      setPageMode('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTryDemoFromCard = (demoType: DemoTab) => {
    setActivePlaygroundTab(demoType);
    scrollToSection('playground');
  };

  // AgentHub Execution Handlers
  const handleStartPlan = async (data: {
    prompt: string;
    category: TaskCategory;
    priority: TaskPriority;
    fileInfo: UploadedFileInfo | null;
  }) => {
    setTaskDraft(data);
    setTaskStatus('request_received');
    setStatusError(undefined);
    setCurrentView('active');

    try {
      setTimeout(() => setTaskStatus('analysing'), 350);

      const res = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.prompt,
          category: data.category,
          priority: data.priority,
          fileContext: data.fileInfo
            ? {
                name: data.fileInfo.name,
                size: data.fileInfo.size,
                type: data.fileInfo.type,
                previewText: data.fileInfo.content?.slice(0, 500),
                csvStats: data.fileInfo.csvStats,
              }
            : undefined,
        }),
      });

      if (!res.ok) throw new Error('Planning failed on server.');
      const plan: TaskPlan = await res.json();
      setActivePlan(plan);
      setTaskStatus('plan_ready');
      setTimeout(() => setTaskStatus('awaiting_approval'), 300);
    } catch (err: any) {
      console.error('Plan error:', err);
      setStatusError(err.message);
      setTaskStatus('failed');
    }
  };

  const handleApproveAndExecute = async (approvedPlan: TaskPlan) => {
    setTaskStatus('executing');
    setStatusError(undefined);

    try {
      const res = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: approvedPlan.originalRequest,
          category: approvedPlan.category,
          priority: approvedPlan.priority,
          plan: approvedPlan,
          fileContent: taskDraft.fileInfo?.content,
          fileName: taskDraft.fileInfo?.name,
          fileType: taskDraft.fileInfo?.type,
          csvStats: taskDraft.fileInfo?.csvStats,
        }),
      });

      if (!res.ok) throw new Error('Execution failed on server.');
      setTaskStatus('reviewing');

      const result: TaskExecutionResult = await res.json();
      setActiveResult(result);
      setTaskStatus('completed');
      setTasks((prev) => [result, ...prev.filter((t) => t.id !== result.id)]);
    } catch (err: any) {
      console.error('Execution error:', err);
      setStatusError(err.message);
      setTaskStatus('failed');
    }
  };

  const handleDirectExecute = async (data: {
    prompt: string;
    category: TaskCategory;
    priority: TaskPriority;
    fileInfo: UploadedFileInfo | null;
  }) => {
    setTaskDraft(data);
    setTaskStatus('request_received');
    setStatusError(undefined);
    setCurrentView('active');

    try {
      setTaskStatus('analysing');
      const planRes = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.prompt,
          category: data.category,
          priority: data.priority,
          fileContext: data.fileInfo ? { name: data.fileInfo.name, size: data.fileInfo.size } : undefined,
        }),
      });

      const plan: TaskPlan = await planRes.json();
      setActivePlan(plan);
      setTaskStatus('executing');

      const execRes = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.prompt,
          category: data.category,
          priority: data.priority,
          plan,
          fileContent: data.fileInfo?.content,
          fileName: data.fileInfo?.name,
          csvStats: data.fileInfo?.csvStats,
        }),
      });

      const result: TaskExecutionResult = await execRes.json();
      setActiveResult(result);
      setTaskStatus('completed');
      setTasks((prev) => [result, ...prev.filter((t) => t.id !== result.id)]);
    } catch (err: any) {
      setStatusError(err.message);
      setTaskStatus('failed');
    }
  };

  const handleRunPresetDemo = (demoKey: 'demoA' | 'demoB' | 'demoC') => {
    const demo = DEMO_PRESETS[demoKey];
    handleStartPlan({
      prompt: demo.prompt,
      category: demo.category,
      priority: demo.priority,
      fileInfo: demo.fileName
        ? {
            name: demo.fileName,
            size: demo.fileContent?.length || 0,
            type: demo.fileType || 'text/csv',
            content: demo.fileContent || '',
          }
        : null,
    });
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear session task records?')) {
      setTasks([]);
      setActiveResult(null);
      setTaskStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* VIEW 1: 3D LANDING PAGE & INTERACTIVE PLAYGROUND (PRIMARY CUSTOMER DEMO) */}
      {/* ========================================================================= */}
      {pageMode === 'landing' ? (
        <div className="relative">
          {/* Top Navbar */}
          <Navbar
            onNavigate={scrollToSection}
            hasGeminiKey={hasGeminiKey}
            onOpenContact={() => setContactModalOpen(true)}
          />

          {/* 1. Hero / Front Page with 3D Scene */}
          <HeroSection
            onExploreDemo={() => scrollToSection('playground')}
            onExploreSolutions={() => scrollToSection('services')}
            hasGeminiKey={hasGeminiKey}
          />

          {/* 2. Interactive 3D Services Section (4 Service Cards with 3D Visuals) */}
          <ServicesSection onTryDemo={handleTryDemoFromCard} />

          {/* 3. Animated Workflow Section (5 Connected 3D Stages) */}
          <WorkflowSection />

          {/* 4. Working Automation Playground (4 Interactive Demos with Input->Processing->Result) */}
          <PlaygroundSection
            activeTab={activePlaygroundTab}
            onTabChange={setActivePlaygroundTab}
            hasGeminiKey={hasGeminiKey}
          />

          {/* 5. Final Call to Action Section with 3D Gem */}
          <CtaSection onOpenContact={() => setContactModalOpen(true)} />

          {/* Contact Inquiry Modal */}
          <ContactModal
            isOpen={contactModalOpen}
            onClose={() => setContactModalOpen(false)}
          />

          {/* Footer */}
          <Footer
            onNavigate={scrollToSection}
            onOpenContact={() => setContactModalOpen(true)}
          />

          {/* Floating Switcher to AgentHub Studio */}
          <div className="fixed bottom-5 right-5 z-40">
            <button
              onClick={() => {
                setPageMode('hub');
                setCurrentView('overview');
              }}
              className="px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-500/40 shadow-xl shadow-cyan-500/10 flex items-center gap-2 transition hover:scale-105 cursor-pointer backdrop-blur-md"
              title="Open full enterprise studio workspace"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Open AgentHub Studio</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: ENTERPRISE AGENTHUB WORKSPACE (FULL TASK ORCHESTRATION & HISTORY) */
        /* ========================================================================= */
        <div className="flex h-screen w-screen overflow-hidden bg-[#070B14]">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            activeTaskCount={taskStatus !== 'idle' && taskStatus !== 'completed' && taskStatus !== 'failed' ? 1 : 0}
            totalCompletedCount={tasks.length}
            onQuickDemoClick={() => setCurrentView('demos')}
          />

          <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
            <Header
              currentView={currentView}
              onNewTaskClick={() => {
                setTaskStatus('idle');
                setActivePlan(null);
                setActiveResult(null);
                setCurrentView('create');
              }}
              onDemoClick={() => setCurrentView('demos')}
              hasGeminiKey={hasGeminiKey}
              onResetSession={handleClearHistory}
            />

            {/* Quick Banner to return to 3D Landing Page */}
            <div className="px-6 py-2 bg-[#091024] border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>AgentHub Enterprise Studio Active</span>
              </span>
              <button
                onClick={() => setPageMode('landing')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Back to 3D Demo Website &rarr;</span>
              </button>
            </div>

            <main className="flex-1 overflow-y-auto px-6 py-8">
              {currentView === 'overview' && (
                <DashboardOverview
                  tasks={tasks}
                  onNewTaskClick={() => setCurrentView('create')}
                  onDemoClick={() => setCurrentView('demos')}
                  onSelectTemplate={(tmpl) => {
                    setTaskDraft({
                      prompt: tmpl.samplePrompt,
                      category: tmpl.category,
                      priority: tmpl.priority,
                      fileInfo: tmpl.hasSampleFile
                        ? {
                            name: tmpl.sampleFileName || 'sample.csv',
                            size: tmpl.sampleFileContent?.length || 0,
                            type: 'text/csv',
                            content: tmpl.sampleFileContent || '',
                          }
                        : null,
                    });
                    setCurrentView('create');
                  }}
                  onInspectTask={(task) => {
                    setActiveResult(task);
                    setActivePlan(task.plan);
                    setTaskStatus('completed');
                    setCurrentView('active');
                  }}
                />
              )}

              {currentView === 'create' && (
                <TaskCreation
                  initialPrompt={taskDraft.prompt}
                  initialCategory={taskDraft.category}
                  initialPriority={taskDraft.priority}
                  initialFile={taskDraft.fileInfo}
                  onPlanTask={handleStartPlan}
                  onExecuteDirect={handleDirectExecute}
                  isPlanning={taskStatus === 'request_received' || taskStatus === 'analysing'}
                  isExecuting={taskStatus === 'executing'}
                />
              )}

              {currentView === 'active' && (
                <div className="space-y-8">
                  <ProgressTracker
                    status={taskStatus}
                    errorMessage={statusError}
                    onRetry={() => {
                      if (activePlan) handleApproveAndExecute(activePlan);
                    }}
                    onCancel={() => {
                      setTaskStatus('idle');
                      setCurrentView('create');
                    }}
                  />

                  {taskStatus === 'awaiting_approval' && activePlan && (
                    <AgentPlannerModal
                      plan={activePlan}
                      onApproveAndExecute={handleApproveAndExecute}
                      onEditRequest={() => setCurrentView('create')}
                      onCancel={() => {
                        setTaskStatus('idle');
                        setCurrentView('create');
                      }}
                      isExecuting={false}
                    />
                  )}

                  {taskStatus === 'completed' && activeResult && (
                    <ResultsWorkspace
                      result={activeResult}
                      onRegenerate={() => {
                        if (activePlan) handleApproveAndExecute(activePlan);
                      }}
                      onRunAnother={() => {
                        setTaskStatus('idle');
                        setActivePlan(null);
                        setActiveResult(null);
                        setCurrentView('create');
                      }}
                    />
                  )}

                  {taskStatus === 'idle' && !activeResult && (
                    <div className="py-16 text-center rounded-2xl bg-[#0B1120] border border-slate-800">
                      <h3 className="text-base font-bold text-white">No Active Task</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Compose a task in the AI Task Creator or explore customer demos.
                      </p>
                      <button
                        onClick={() => setCurrentView('create')}
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Create New Task
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentView === 'templates' && (
                <TemplateLibrary
                  onSelectTemplate={(tmpl) => {
                    setTaskDraft({
                      prompt: tmpl.samplePrompt,
                      category: tmpl.category,
                      priority: tmpl.priority,
                      fileInfo: null,
                    });
                    setCurrentView('create');
                  }}
                  onQuickRunTemplate={(tmpl) => {
                    handleStartPlan({
                      prompt: tmpl.samplePrompt,
                      category: tmpl.category,
                      priority: tmpl.priority,
                      fileInfo: null,
                    });
                  }}
                />
              )}

              {currentView === 'demos' && (
                <CustomerDemoMode
                  onRunDemo={handleRunPresetDemo}
                  isExecuting={taskStatus !== 'idle' && taskStatus !== 'completed' && taskStatus !== 'failed'}
                  hasGeminiKey={hasGeminiKey}
                  onResetDemos={() => {
                    setTaskStatus('idle');
                    setActivePlan(null);
                    setActiveResult(null);
                  }}
                  recentTasks={tasks}
                  onInspectResult={(task) => {
                    setActiveResult(task);
                    setActivePlan(task.plan);
                    setTaskStatus('completed');
                    setCurrentView('active');
                  }}
                />
              )}

              {currentView === 'history' && (
                <TaskHistory
                  tasks={tasks}
                  onInspectTask={(task) => {
                    setActiveResult(task);
                    setActivePlan(task.plan);
                    setTaskStatus('completed');
                    setCurrentView('active');
                  }}
                  onDeleteTask={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
                  onClearHistory={handleClearHistory}
                />
              )}

              {currentView === 'custom' && <CustomAutomationForm />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
