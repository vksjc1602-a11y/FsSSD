/**
 * AEGIS Protection
 * Answers: "How do I stay protected?"
 * Minimalist automatic monitoring controls and transparent permission architecture.
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProtectionView() {
  const [masterProtection, setMasterProtection] = useState(true);
  const [messageScanning, setMessageScanning] = useState(true);
  const [urlProtection, setUrlProtection] = useState(true);
  const [txnMonitoring, setTxnMonitoring] = useState(true);

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const permissionsGuide: Record<string, { needs: string; why: string; data: string }> = {
    MESSAGE: {
      needs: 'Inbound notification screening intent',
      why: 'To inspect incoming SMS and payment communications before you click embedded links.',
      data: 'Scans execute ephemerally in volatile memory. No message contents or private texts are ever stored or retained on AEGIS servers.'
    },
    URL: {
      needs: 'Browser navigation URL verification handler',
      why: 'To compare payment links against disposable phishing registrar lists and brand impersonation databases.',
      data: 'Only domains are checked against cryptographic hashes. Personal browsing history is strictly untouched.'
    },
    TRANSACTION: {
      needs: 'Banking notification and UPI payment intent monitor',
      why: 'To flag sudden velocity spikes, newly created recipient accounts, and known mule handles before transfer settlement.',
      data: 'Account numbers and phone handles are one-way hashed via salted SHA-256 before analysis. Plain bank details are never stored.'
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none py-2">
      {/* Editorial Title */}
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
          ACTIVE DEFENSE
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#102A23] tracking-tight">
          How do you stay protected?
        </h1>
        <p className="text-sm text-[#557A68]">
          Automatic background verification against financial phishing, deceptive links, and mule transactions.
        </p>
      </div>

      {/* Master Protection Switch Box */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-7 rounded-xs shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#557A68] tracking-widest uppercase block">
              AEGIS PROTECTION
            </span>
            <h2 className="text-xl font-semibold text-[#102A23]">
              Protect your financial activity.
            </h2>
            <p className="text-xs text-[#557A68]">
              {masterProtection
                ? 'All automated perimeter filters and scam detection shields are active.'
                : 'Automated shields are paused. You must manually submit items to the Scanner.'}
            </p>
          </div>

          <button
            onClick={() => setMasterProtection(!masterProtection)}
            className={`px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors rounded-xs ${
              masterProtection
                ? 'bg-[#102A23] text-white'
                : 'bg-[#EAE3D5] text-[#557A68]'
            }`}
          >
            {masterProtection ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Available Protections */}
      <div className="space-y-3">
        <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
          AVAILABLE PROTECTIONS
        </span>

        <div className="space-y-3">
          {/* Message Scanning */}
          <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#102A23]">
                    MESSAGE SCANNING
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#EAE3D5] text-[#102A23] text-[10px] font-mono font-semibold rounded-xs">
                    SMS & WHATSAPP
                  </span>
                </div>
                <p className="text-xs text-[#557A68] leading-relaxed">
                  Real-time screening of inbound banking alerts, utility notices, and payment solicitations for social engineering markers.
                </p>
              </div>

              <button
                disabled={!masterProtection}
                onClick={() => setMessageScanning(!messageScanning)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  messageScanning && masterProtection
                    ? 'bg-[#102A23] text-white'
                    : 'bg-[#EAE3D5] text-[#557A68]'
                }`}
              >
                {messageScanning && masterProtection ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>

            <div className="pt-2 border-t border-[#557A68]/15 flex items-center justify-between text-xs font-mono">
              <span className="text-[#557A68]">Privacy: Ephemeral memory inspection</span>
              <button
                onClick={() => setActiveModal(activeModal === 'MESSAGE' ? null : 'MESSAGE')}
                className="text-[#102A23] hover:underline"
              >
                {activeModal === 'MESSAGE' ? 'HIDE PERMISSION INFO' : 'VIEW PERMISSION INFO'}
              </button>
            </div>

            {activeModal === 'MESSAGE' && (
              <div className="p-4 bg-[#F5F1E8] border border-[#557A68]/20 text-xs font-mono text-[#102A23] space-y-2 rounded-xs">
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHAT AEGIS NEEDS ACCESS TO:</span>
                  <span>{permissionsGuide.MESSAGE.needs}</span>
                </div>
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHY IT NEEDS IT:</span>
                  <span>{permissionsGuide.MESSAGE.why}</span>
                </div>
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHAT IT DOES WITH THE DATA:</span>
                  <span>{permissionsGuide.MESSAGE.data}</span>
                </div>
              </div>
            )}
          </div>

          {/* URL Protection */}
          <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#102A23]">
                    URL PROTECTION
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#EAE3D5] text-[#102A23] text-[10px] font-mono font-semibold rounded-xs">
                    BROWSING & CHECKOUT
                  </span>
                </div>
                <p className="text-xs text-[#557A68] leading-relaxed">
                  Automatic heuristic verification of destination domains when opening links from messages or invoices.
                </p>
              </div>

              <button
                disabled={!masterProtection}
                onClick={() => setUrlProtection(!urlProtection)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  urlProtection && masterProtection
                    ? 'bg-[#102A23] text-white'
                    : 'bg-[#EAE3D5] text-[#557A68]'
                }`}
              >
                {urlProtection && masterProtection ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>

            <div className="pt-2 border-t border-[#557A68]/15 flex items-center justify-between text-xs font-mono">
              <span className="text-[#557A68]">Privacy: Cryptographic hash comparison</span>
              <button
                onClick={() => setActiveModal(activeModal === 'URL' ? null : 'URL')}
                className="text-[#102A23] hover:underline"
              >
                {activeModal === 'URL' ? 'HIDE PERMISSION INFO' : 'VIEW PERMISSION INFO'}
              </button>
            </div>

            {activeModal === 'URL' && (
              <div className="p-4 bg-[#F5F1E8] border border-[#557A68]/20 text-xs font-mono text-[#102A23] space-y-2 rounded-xs">
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHAT AEGIS NEEDS ACCESS TO:</span>
                  <span>{permissionsGuide.URL.needs}</span>
                </div>
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHY IT NEEDS IT:</span>
                  <span>{permissionsGuide.URL.why}</span>
                </div>
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHAT IT DOES WITH THE DATA:</span>
                  <span>{permissionsGuide.URL.data}</span>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Monitoring */}
          <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#102A23]">
                    TRANSACTION MONITORING
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#EAE3D5] text-[#102A23] text-[10px] font-mono font-semibold rounded-xs">
                    UPI & BANK TRANSFERS
                  </span>
                </div>
                <p className="text-xs text-[#557A68] leading-relaxed">
                  Real-time heuristic evaluation of payment requests and beneficiary history against known mule syndicates.
                </p>
              </div>

              <button
                disabled={!masterProtection}
                onClick={() => setTxnMonitoring(!txnMonitoring)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  txnMonitoring && masterProtection
                    ? 'bg-[#102A23] text-white'
                    : 'bg-[#EAE3D5] text-[#557A68]'
                }`}
              >
                {txnMonitoring && masterProtection ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>

            <div className="pt-2 border-t border-[#557A68]/15 flex items-center justify-between text-xs font-mono">
              <span className="text-[#557A68]">Privacy: Salted one-way SHA-256 tokens</span>
              <button
                onClick={() => setActiveModal(activeModal === 'TRANSACTION' ? null : 'TRANSACTION')}
                className="text-[#102A23] hover:underline"
              >
                {activeModal === 'TRANSACTION' ? 'HIDE PERMISSION INFO' : 'VIEW PERMISSION INFO'}
              </button>
            </div>

            {activeModal === 'TRANSACTION' && (
              <div className="p-4 bg-[#F5F1E8] border border-[#557A68]/20 text-xs font-mono text-[#102A23] space-y-2 rounded-xs">
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHAT AEGIS NEEDS ACCESS TO:</span>
                  <span>{permissionsGuide.TRANSACTION.needs}</span>
                </div>
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHY IT NEEDS IT:</span>
                  <span>{permissionsGuide.TRANSACTION.why}</span>
                </div>
                <div>
                  <span className="text-[#557A68] block text-[10px]">WHAT IT DOES WITH THE DATA:</span>
                  <span>{permissionsGuide.TRANSACTION.data}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
