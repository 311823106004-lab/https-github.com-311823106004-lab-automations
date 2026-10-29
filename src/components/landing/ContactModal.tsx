import React, { useState } from 'react';
import {
  X,
  Send,
  Building,
  User,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim() || !requirement.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setCompany('');
    setEmail('');
    setRequirement('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#0B1120] border border-blue-500/30 p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Enterprise Consultation
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-2">
                Discuss an Automation Project
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your operational bottlenecks. Our engineering leads will structure a proof-of-concept.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Company Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Global Logistics"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Business Email <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@apexlogistics.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Business Automation Requirement <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe your current manual tasks (e.g. invoice triage, weekly reports, customer responses)..."
                  className="w-full p-3 rounded-xl bg-[#070B14] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-none leading-relaxed"
                />
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Interactive Demo Notice:</strong> This website is operating in demonstration sandbox mode. Form inputs are evaluated locally and are not transmitted to any external server.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Automation Inquiry</span>
              </button>
            </form>
          </div>
        ) : (
          /* Submission Confirmation */
          <div className="py-6 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Inquiry Evaluated Successfully
            </h3>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{name}</strong> at <strong className="text-white">{company}</strong>. Your requirement for <em>"{requirement.slice(0, 60)}..."</em> has been formatted for discussion.
            </p>

            <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 text-left text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-200 block">Demonstration Status:</span>
              <p className="text-[11px]">
                Safe mode validated. In a live enterprise deployment, this triggers instant ticket routing into Mesara AI's solutions engineering queue.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
