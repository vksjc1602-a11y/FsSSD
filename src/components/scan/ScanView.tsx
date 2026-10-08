/**
 * AEGIS Scan - The Core of AEGIS
 * Layered ML + LLM Hybrid Scanner
 */

import React, { useState } from 'react';
import { ScanInputType, ScanResult } from '../../types';
import { analyzeMessageOrInput } from '../../engine/riskEngine';
import RiskResultView from './RiskResultView';
import { MessageSquare, Globe, ArrowRightLeft, FileText, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface ScanViewProps {
  initialType?: ScanInputType;
  onSaveResultToHistory: (result: ScanResult) => void;
}

const PROCESSING_STEPS = [
  'LAYER 1: RULE NORMALIZATION',
  'LAYER 2: CALIBRATED ML INFERENCE',
  'LAYER 3: DOMAIN & URL INTELLIGENCE',
  'LAYER 4: INTENT REASONING & FUSION'
];

const QUICK_TEST_PRESETS = [
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'UPI PIN Trap: "Enter PIN to Receive ₹4,999 Cashback"',
    content: 'PhonePe Cashback Alert: You have received a cashback reward of INR 4,999. Click accept money request and enter your UPI PIN immediately to credit your bank account.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Card Harvesting: "Enter 16-Digit Card & CVV to prevent Block"',
    content: 'SBI Security Alert: Your debit card is blocked. Enter your 16-digit card number, CVV, and expiry date at http://sbi-card-verify.top to reactivate card services.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Lottery Scam: "Won ₹25 Lakhs in KBC WhatsApp Lucky Draw"',
    content: 'Congratulations! Your mobile number won Rs 25,00,000 in Kaun Banega Crorepati WhatsApp Lucky Draw 2026. Contact lottery officer Rana Pratap at 9871234567 to claim prize.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Hinglish Electricity Disconnection Threat',
    content: 'Dear Customer, Aapki Bijli ka bill jama nahi hua hai. Aaj raat 9:30 baje bijli kaat di jayegi. Turant call karein hamare officer ko: 98129-38291 ya link kholein.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Digital Arrest / Cyber Police Intimidation',
    content: 'URGENT NOTICE: Mumbai Police Crime Branch and CBI have registered case #CBI-291 against you for narcotics parcel. Stay in room on video call or arrest warrant will be executed immediately.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Genuine Bank Debit Alert (Safe)',
    content: 'Your HDFC Bank Acct XX4912 has been debited with INR 1,420 at Fresh Mart on 07-OCT-2026. Ref UPI/49192. If not done by you, SMS BLOCK to 5676712.'
  }
];

export default function ScanView({ initialType = 'MESSAGE', onSaveResultToHistory }: ScanViewProps) {
  const [selectedType, setSelectedType] = useState<ScanInputType>(initialType);
  const [messageInput, setMessageInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [txnAmount, setTxnAmount] = useState('');
  const [txnMerchant, setTxnMerchant] = useState('');
  const [txnDesc, setTxnDesc] = useState('');
  const [docInput, setDocInput] = useState('');
  const [forceDeep, setForceDeep] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  const handleAnalyze = async (overrideText?: string, overrideType?: ScanInputType) => {
    const typeToUse = overrideType || selectedType;
    let inputToAnalyze = overrideText || '';

    if (!overrideText) {
      if (typeToUse === 'MESSAGE') inputToAnalyze = messageInput;
      else if (typeToUse === 'URL') inputToAnalyze = urlInput;
      else if (typeToUse === 'TRANSACTION') {
        inputToAnalyze = `Transaction: Amount ₹${txnAmount || '0'} to Merchant "${txnMerchant || 'UNKNOWN'}" with narrative: "${txnDesc || 'N/A'}"`;
      } else if (typeToUse === 'DOCUMENT') inputToAnalyze = docInput;
    }

    if (!inputToAnalyze.trim()) return;

    setIsProcessing(true);
    setActiveResult(null);
    setProcessingIndex(0);

    const stepInterval = setInterval(() => {
      setProcessingIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 280);

    try {
      const response = await fetch('/api/v1/scan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: inputToAnalyze,
          type: typeToUse,
          forceDeep
        })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: ScanResult = await response.json();
      setActiveResult(result);
      onSaveResultToHistory(result);
    } catch (err) {
      console.warn('[AEGIS UI] Server analyze failed or offline. Running local hybrid engine:', err);
      clearInterval(stepInterval);
      const fallbackResult = analyzeMessageOrInput(inputToAnalyze, typeToUse);
      setActiveResult(fallbackResult);
      onSaveResultToHistory(fallbackResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadPreset = (preset: (typeof QUICK_TEST_PRESETS)[0]) => {
    setSelectedType(preset.type);
    if (preset.type === 'MESSAGE' || preset.type === 'URL') {
      if (preset.type === 'MESSAGE') setMessageInput(preset.content || '');
      if (preset.type === 'URL') setUrlInput(preset.content || '');
      handleAnalyze(preset.content, preset.type);
    }
  };

  const handleResetScan = () => {
    setActiveResult(null);
    setMessageInput('');
    setUrlInput('');
    setTxnAmount('');
    setTxnMerchant('');
    setTxnDesc('');
    setDocInput('');
  };

  if (activeResult) {
    return (
      <RiskResultView
        result={activeResult}
        onScanAnother={handleResetScan}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase">
            ACTIVE THREAT SCANNER
          </span>
          <span className="text-xs font-mono text-[#557A68]">
            ENGINE: HYBRID ML + LLM (v3.5)
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-[#102A23]">
          Analyze Communication, Link, or Financial Movement
        </h1>
        <p className="text-sm text-[#557A68]">
          Multi-layer defense: Fast deterministic rules, calibrated scikit-learn ML, URL telemetry, and Gemini intent reasoning.
        </p>
      </div>

      {/* Input Selector Tabs */}
      <div className="grid grid-cols-4 gap-2 bg-[#EAE3D5]/40 p-1 rounded-xs border border-[#557A68]/20">
        {[
          { id: 'MESSAGE', label: 'MESSAGE / SMS', icon: MessageSquare },
          { id: 'URL', label: 'URL / DOMAIN', icon: Globe },
          { id: 'TRANSACTION', label: 'TRANSACTION', icon: ArrowRightLeft },
          { id: 'DOCUMENT', label: 'TEXT PASTE', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as ScanInputType)}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono transition-colors rounded-xs ${
                isActive
                  ? 'bg-[#102A23] text-white font-bold shadow-xs'
                  : 'text-[#102A23] hover:bg-[#EAE3D5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form Containers */}
      <div className="bg-white border border-[#557A68]/20 p-6 rounded-xs space-y-4 shadow-xs">
        {selectedType === 'MESSAGE' && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#557A68] block">
              PASTE SMS, WHATSAPP, TELEGRAM, OR EMAIL TEXT
            </label>
            <textarea
              rows={5}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="e.g. 'Your SBI netbanking is blocked. Update KYC immediately at: http://sbi-kyc.top' or 'Aapki bijli kaat di jayegi...'"
              className="w-full p-3.5 text-xs font-mono bg-[#F5F1E8]/50 border border-[#557A68]/30 rounded-xs focus:outline-none focus:border-[#102A23] transition-colors resize-none placeholder:text-[#557A68]/60"
            />
          </div>
        )}

        {selectedType === 'URL' && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#557A68] block">
              ENTER URL, LINK, OR DOMAIN (DEFANGED hxxp:// AND [.] DOTS ACCEPTED)
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://sbi-kyc-verify.top/auth or hxxp://security[.]xyz"
              className="w-full p-3.5 text-xs font-mono bg-[#F5F1E8]/50 border border-[#557A68]/30 rounded-xs focus:outline-none focus:border-[#102A23] transition-colors placeholder:text-[#557A68]/60"
            />
          </div>
        )}

        {selectedType === 'TRANSACTION' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#557A68] block mb-1">
                  AMOUNT (INR ₹)
                </label>
                <input
                  type="text"
                  value={txnAmount}
                  onChange={(e) => setTxnAmount(e.target.value)}
                  placeholder="e.g. 49999"
                  className="w-full p-3 text-xs font-mono bg-[#F5F1E8]/50 border border-[#557A68]/30 rounded-xs focus:outline-none focus:border-[#102A23]"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#557A68] block mb-1">
                  RECIPIENT / MERCHANT / UPI ID
                </label>
                <input
                  type="text"
                  value={txnMerchant}
                  onChange={(e) => setTxnMerchant(e.target.value)}
                  placeholder="e.g. fastcash-refund@ybl or Officer Sharma"
                  className="w-full p-3 text-xs font-mono bg-[#F5F1E8]/50 border border-[#557A68]/30 rounded-xs focus:outline-none focus:border-[#102A23]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-[#557A68] block mb-1">
                PAYMENT NARRATIVE / REMARKS
              </label>
              <input
                type="text"
                value={txnDesc}
                onChange={(e) => setTxnDesc(e.target.value)}
                placeholder="e.g. Urgent KYC Security Deposit Refundable Fee via UPI"
                className="w-full p-3 text-xs font-mono bg-[#F5F1E8]/50 border border-[#557A68]/30 rounded-xs focus:outline-none focus:border-[#102A23]"
              />
            </div>
          </div>
        )}

        {selectedType === 'DOCUMENT' && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#557A68] block">
              UNSTRUCTURED INCIDENT LOG / RAW EMAIL HEADERS
            </label>
            <textarea
              rows={6}
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              placeholder="Paste raw email, legal notice summons, or telegram chat transcription..."
              className="w-full p-3.5 text-xs font-mono bg-[#F5F1E8]/50 border border-[#557A68]/30 rounded-xs focus:outline-none focus:border-[#102A23] transition-colors resize-none"
            />
          </div>
        )}

        {/* Options & Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#557A68]/15">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#102A23]">
            <input
              type="checkbox"
              checked={forceDeep}
              onChange={(e) => setForceDeep(e.target.checked)}
              className="rounded-xs text-[#102A23] focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#557A68]" />
              Always run Deep LLM Intent Reasoning (Gemini)
            </span>
          </label>

          <button
            onClick={() => handleAnalyze()}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 rounded-xs shadow-xs"
          >
            {isProcessing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>ANALYZING...</span>
              </>
            ) : (
              <>
                <span>ANALYZE THREAT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Processing Step Indicator */}
        {isProcessing && (
          <div className="p-3 bg-[#F5F1E8] border border-[#557A68]/20 rounded-xs space-y-1.5 animate-pulse">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#102A23] font-bold">
                {PROCESSING_STEPS[processingIndex]}
              </span>
              <span className="text-[#557A68]">
                STEP {processingIndex + 1} OF 4
              </span>
            </div>
            <div className="w-full bg-[#EAE3D5] h-1.5 rounded-xs overflow-hidden">
              <div
                className="bg-[#102A23] h-full transition-all duration-300"
                style={{ width: `${((processingIndex + 1) / PROCESSING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Test Presets */}
      <div className="space-y-2.5 pt-2">
        <span className="text-xs font-mono tracking-wider text-[#557A68] uppercase block">
          COMMUNITY & ADVERSARIAL TEST PRESETS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_TEST_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(preset)}
              className="p-3 text-left bg-white border border-[#557A68]/20 hover:border-[#102A23] hover:bg-[#F5F1E8]/30 transition-all rounded-xs text-xs font-mono flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between text-[#557A68] text-[10px] mb-1">
                <span>{preset.type}</span>
                <span className="group-hover:text-[#102A23] font-bold">RUN SCAN →</span>
              </div>
              <div className="text-[#102A23] font-semibold line-clamp-1">
                {preset.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
