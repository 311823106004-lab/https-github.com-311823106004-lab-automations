import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { CtaGem3D } from '../3d/CtaGem3D';

interface CtaSectionProps {
  onOpenContact: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenContact }) => {
  return (
    <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto relative">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C152E] via-[#0F1E40] to-[#0A1329] border border-cyan-500/30 p-8 sm:p-14 shadow-2xl text-center">
        {/* Ambient glow in background */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* 3D Floating Gem Canvas */}
        <div className="relative z-10 mb-4">
          <CtaGem3D />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transform Everyday Operations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your Business. Less Repetition.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">
              More Possibilities.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Let's find the right automation for your everyday business challenges.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Discuss an Automation Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Confidential enterprise evaluation • Zero spam guarantee</span>
          </p>
        </div>
      </div>
    </section>
  );
};
