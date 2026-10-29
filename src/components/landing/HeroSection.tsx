import React from 'react';
import { Sparkles, ArrowRight, PlayCircle, ShieldCheck, Zap } from 'lucide-react';
import { HeroScene3D } from '../3d/HeroScene3D';

interface HeroSectionProps {
  onExploreDemo: () => void;
  onExploreSolutions: () => void;
  hasGeminiKey: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDemo,
  onExploreSolutions,
  hasGeminiKey,
}) => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-6 sm:px-8 overflow-hidden">
      {/* Background radial gradient layers */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headline and CTAs */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Enterprise Automation Agents</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Make Work Flow.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Make Business Grow.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Discover smarter ways to handle everyday business tasks with practical automation solutions.
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreDemo}
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>Explore Live Demo</span>
            </button>

            <button
              onClick={onExploreSolutions}
              className="px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-extrabold text-sm border border-slate-700/80 hover:border-slate-600 flex items-center gap-2.5 transition cursor-pointer"
            >
              <span>Our Automation Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Enterprise highlights */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Human-in-the-Loop Safe Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Deterministic Mathematical Precision</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <span>{hasGeminiKey ? 'Gemini 3.8 Flash Ready' : 'Demo Engine Active'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Operations Sphere Canvas */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="w-full relative rounded-3xl bg-gradient-to-b from-blue-950/20 to-transparent border border-blue-500/10 p-2 overflow-hidden">
            <HeroScene3D />
            {/* Subtle caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#070B14]/80 border border-slate-800 text-[11px] text-slate-400 font-mono pointer-events-none">
              Interactive 3D Business Matrix • Move mouse to tilt
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
