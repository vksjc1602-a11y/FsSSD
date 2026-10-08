/**
 * AEGIS Landing Page
 * Minimal, confident, and direct.
 * Hero: "Know the risk before you make the payment."
 */

import React from 'react';
import AegisLogo from '../common/AegisLogo';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, Search, FileText } from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: (view?: string) => void;
}

export default function LandingPageView({ onEnterPlatform }: LandingPageProps) {
  return (
    <div className="bg-[#F5F1E8] text-[#102A23] min-h-screen select-none">
      {/* Header */}
      <header className="border-b border-[#557A68]/20 bg-[#F5F1E8]/90 sticky top-0 z-50 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <AegisLogo variant="dark" size={30} />

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterPlatform('SCAN')}
              className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] transition-colors rounded-xs shadow-2xs"
            >
              SCAN A THREAT
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 border-b border-[#557A68]/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
              AEGIS
            </span>
            <div className="text-sm font-mono tracking-widest text-[#102A23] font-semibold uppercase">
              FINANCIAL THREAT INTELLIGENCE
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#102A23] leading-tight max-w-3xl mx-auto pt-2">
              Know the risk before you make the payment.
            </h1>
          </div>

          <p className="text-base md:text-lg text-[#557A68] max-w-xl mx-auto leading-relaxed">
            AEGIS automatically analyzes suspicious messages, websites, and transactions to protect you from financial fraud before you lose money.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterPlatform('SCAN')}
              className="px-7 py-3.5 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] transition-colors rounded-xs shadow-xs flex items-center gap-2"
            >
              <span>SCAN A THREAT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-7 py-3.5 text-xs font-mono font-semibold tracking-wider uppercase text-[#102A23] bg-[#EAE3D5] hover:bg-[#D4CBBF] border border-[#557A68]/20 transition-colors rounded-xs"
            >
              HOW AEGIS WORKS
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 border-b border-[#557A68]/20 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
              PROCESS
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#102A23]">
              HOW IT WORKS
            </h2>
          </div>

          {/* 4 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            {[
              { num: '01', title: 'SCAN', desc: 'Paste suspicious message, link or transaction' },
              { num: '02', title: 'ANALYZE', desc: 'Cross-reference against known scam corpora' },
              { num: '03', title: 'ASSESS', desc: 'Receive transparent risk score and evidence' },
              { num: '04', title: 'PROTECT', desc: 'Follow recommended actions to stay safe' },
            ].map((step, idx) => (
              <div key={step.num} className="p-5 bg-[#F5F1E8] border border-[#557A68]/20 rounded-xs space-y-2">
                <span className="text-xs font-mono font-bold text-[#557A68] block">
                  {step.num}
                </span>
                <span className="text-base font-bold font-mono text-[#102A23] block">
                  {step.title}
                </span>
                <p className="text-xs text-[#557A68] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AEGIS */}
      <section className="py-16 md:py-20 border-b border-[#557A68]/20">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
              DIFFERENTIATION
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#102A23]">
              WHY AEGIS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Explainable detection', desc: 'AEGIS tells you exactly what triggered suspicion, never "AI says so".' },
              { title: 'Multi-signal analysis', desc: 'Evaluates urgency language, domain age, typosquatting, and mule accounts.' },
              { title: 'Privacy-first architecture', desc: 'Zero storage of banking PINs, OTPs, or passwords. Ephemeral memory analysis.' },
              { title: 'Continuous threat intelligence', desc: 'Grounded in real-world Kaggle corpora and verified banking fraud databases.' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-[#FFFFFF] border border-[#557A68]/25 rounded-xs space-y-1.5">
                <h3 className="text-sm font-semibold text-[#102A23] flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#557A68]">✓</span>
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs text-[#557A68] leading-relaxed pl-5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onEnterPlatform('SCAN')}
              className="px-8 py-3.5 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] transition-colors rounded-xs shadow-xs"
            >
              TRY A VERIFICATION SCAN NOW →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#102A23] text-[#F5F1E8] text-xs font-mono">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="opacity-80">© 2026 AEGIS. Financial threat intelligence.</span>
          <div className="flex items-center gap-4 text-[#9BAF9F]">
            <button onClick={() => onEnterPlatform('SCAN')} className="hover:text-white transition-colors">
              SCANNER
            </button>
            <button onClick={() => onEnterPlatform('PRIVACY')} className="hover:text-white transition-colors">
              PRIVACY
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
