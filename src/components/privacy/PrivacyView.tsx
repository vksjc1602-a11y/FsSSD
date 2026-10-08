/**
 * AEGIS Privacy Commitments
 * Explains clearly: What AEGIS accesses, why it needs it, and mathematical privacy invariants.
 */

import React from 'react';
import { Lock, EyeOff, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export default function PrivacyView() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none py-2">
      {/* Editorial Title */}
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
          MATHEMATICAL PRIVACY
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#102A23] tracking-tight">
          Privacy Architecture
        </h1>
        <p className="text-sm text-[#557A68]">
          AEGIS was engineered by financial security engineers who believe user verification must never require sacrificing financial privacy.
        </p>
      </div>

      {/* 4 Pillars of AEGIS Privacy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-5 rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#102A23]">
            <EyeOff className="w-4 h-4 text-[#557A68]" />
            <span>ZERO SENSITIVE DATA RETENTION</span>
          </div>
          <p className="text-xs text-[#557A68] leading-relaxed">
            AEGIS does not store plain text passwords, bank PINs, OTPs, CVVs, or unmasked account numbers. Scans execute ephemerally in volatile memory.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-5 rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#102A23]">
            <Lock className="w-4 h-4 text-[#557A68]" />
            <span>ONE-WAY PII TOKENIZATION</span>
          </div>
          <p className="text-xs text-[#557A68] leading-relaxed">
            Target phone numbers, emails, and beneficiary handles are converted into salted HMAC-SHA256 tokens before evaluating graph relationships.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-5 rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#102A23]">
            <ShieldCheck className="w-4 h-4 text-[#557A68]" />
            <span>NO SILENT ACCESS</span>
          </div>
          <p className="text-xs text-[#557A68] leading-relaxed">
            AEGIS never accesses files, clipboard items, or communications without explicit, visible user consent. You control when scans execute.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-5 rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#102A23]">
            <Database className="w-4 h-4 text-[#557A68]" />
            <span>LOCAL VAULT STORAGE</span>
          </div>
          <p className="text-xs text-[#557A68] leading-relaxed">
            Your verification history lives strictly in your browser's private local vault and can be wiped instantly with one click.
          </p>
        </div>
      </div>

      {/* Regulatory & Safety Notice */}
      <div className="p-5 bg-[#EAE3D5]/60 border border-[#557A68]/25 rounded-xs space-y-2 text-xs">
        <span className="font-mono font-bold text-[#102A23] uppercase tracking-wider block">
          INDEPENDENT VERIFICATION NOTICE
        </span>
        <p className="text-[#102A23] leading-relaxed">
          AEGIS provides automated risk analysis and security intelligence. It does not guarantee that a transaction or communication is fraudulent or legitimate. Users should independently verify high-risk financial activity with their primary banking authority.
        </p>
      </div>
    </div>
  );
}
