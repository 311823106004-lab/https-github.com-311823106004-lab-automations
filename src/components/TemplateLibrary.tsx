import React, { useState } from 'react';
import {
  TrendingUp,
  Mail,
  FileText,
  MessageSquare,
  Share2,
  Briefcase,
  BarChart3,
  ClipboardList,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { AutomationTemplate, TaskCategory } from '../types';
import { AUTOMATION_TEMPLATES } from '../data/templatesAndDemos';

interface TemplateLibraryProps {
  onSelectTemplate: (template: AutomationTemplate) => void;
  onQuickRunTemplate: (template: AutomationTemplate) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  onQuickRunTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-emerald-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-amber-400" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-purple-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-emerald-400" />;
      case 'ClipboardList':
        return <ClipboardList className="w-5 h-5 text-sky-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredTemplates = AUTOMATION_TEMPLATES.filter((tmpl) => {
    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.badge.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || tmpl.category.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Turnkey Enterprise Workflows</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Automation Template Library
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select any verified automation recipe to pre-load domain prompts, execution parameters, and sample datasets.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1120] border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates by keyword or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All (8)' },
            { id: 'sales', label: 'Sales & Data' },
            { id: 'email', label: 'Email' },
            { id: 'proposal', label: 'Proposals' },
            { id: 'document', label: 'Documents' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-blue-500/50 p-5 flex flex-col justify-between transition-all duration-200 group shadow-md hover:shadow-blue-500/5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 group-hover:bg-blue-600/20 flex items-center justify-center transition">
                  {getTemplateIcon(template.icon)}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {template.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition mb-1.5">
                {template.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {template.description}
              </p>

              {/* Sample Prompt Preview */}
              <div className="mt-3 p-2.5 rounded-lg bg-[#070B14] border border-slate-800/80 text-[11px] text-slate-400 italic line-clamp-2">
                "{template.samplePrompt}"
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSelectTemplate(template)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition cursor-pointer"
              >
                Load to Form
              </button>
              <button
                type="button"
                onClick={() => onQuickRunTemplate(template)}
                className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title="Quick Plan & Run"
              >
                <span>Run</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
