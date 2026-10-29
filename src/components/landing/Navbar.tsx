import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, ArrowRight, Menu, X, ShieldCheck, Server } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  hasGeminiKey: boolean;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  hasGeminiKey,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Solutions', id: 'services' },
    { label: '3D Workflow', id: 'workflow' },
    { label: 'Live Demos', id: 'playground' },
    { label: 'Architecture', id: 'architecture' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070B14]/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">
                Mesara AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                3D Demo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
              Make Work Flow. Make Business Grow.
            </p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Action Cluster */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Engine Status */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              hasGeminiKey
                ? 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
            title="Secure Server-Side AI Automation Engine"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">
              {hasGeminiKey ? 'Gemini 3.8 Flash' : 'Demo Engine'}
            </span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => handleLinkClick('playground')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Explore Live Demos</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0F1E] border-b border-slate-800 px-6 py-5 space-y-4 animate-fadeIn">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-left py-2 text-sm text-slate-300 hover:text-blue-400 font-medium cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => handleLinkClick('playground')}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Explore Live Demos</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Discuss a Project
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
