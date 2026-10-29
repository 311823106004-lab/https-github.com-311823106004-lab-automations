import React from 'react';
import { Cpu, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#050811] text-slate-400 text-xs py-14 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand */}
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">
              Mesara AI
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Practical business automation agents for modern enterprises. Make Work Flow. Make Business Grow.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Human-in-the-Loop Safe Mode Active</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Document Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Data Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Email Drafting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Business Workflows
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">
              Live Sandbox
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('playground')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Invoice OCR Extractor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('playground')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  CSV Statistical Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('workflow')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Interactive 3D Pipeline
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Discuss a Project
                </button>
              </li>
              <li className="text-slate-500">enterprise@mesara.ai</li>
              <li className="text-slate-500">Customer Demo Prototype</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Mesara AI Inc. All rights reserved. Interactive Demonstration Platform.
        </div>
        <div className="flex items-center gap-1">
          <span>Award-grade 3D automation experience</span>
        </div>
      </div>
    </footer>
  );
};
