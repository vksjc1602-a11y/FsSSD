/**
 * AEGIS Scan - The Core of AEGIS
 * Answers: "What should I check?"
 * Extremely simple, unmistakable input interfaces.
 */

import React, { useState } from 'react';
import { ScanInputType, ScanResult } from '../../types';
import { analyzeMessageOrInput } from '../../engine/riskEngine';
import RiskResultView from './RiskResultView';
import { MessageSquare, Globe, ArrowRightLeft, FileText, ArrowRight, RotateCcw } from 'lucide-react';

interface ScanViewProps {
  initialType?: ScanInputType;
  onSaveResultToHistory: (result: ScanResult) => void;
}

const PROCESSING_STEPS = [
  'READING',
  'PATTERN ANALYSIS',
  'THREAT CHECK',
  'RISK ASSESSMENT'
];

const QUICK_TEST_PRESETS = [
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Bank KYC SMS Phishing',
    content: 'Dear SBI customer, your netbanking access will be blocked today within 24 hours. Complete your KYC immediately at: http://sbi-kyc-verify.top/auth or contact officer.'
  },
  {
    type: 'URL' as ScanInputType,
    label: 'Customs Fee Phishing Link',
    content: 'https://security-login-sbi-portal.xyz/auth?session=unclaimed_parcel_fee'
  },
  {
    type: 'TRANSACTION' as ScanInputType,
    label: 'Mule Merchant Advance Payment',
    amount: '49999',
    merchant: 'MERCH-QIKPAY-88192 (FastCash Global)',
    description: 'Urgent KYC Security Deposit Refundable Fee via UPI'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    label: 'Legitimate Bank Alert (Safe)',
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

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  const handleAnalyze = (overrideText?: string, overrideType?: ScanInputType) => {
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

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessingIndex(step);
      if (step >= PROCESSING_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          const result = analyzeMessageOrInput(inputToAnalyze, typeToUse);
          setActiveResult(result);
          onSaveResultToHistory(result);
          setIsProcessing(false);
        }, 180);
      }
    }, 180);
  };

  const handleLoadPreset = (preset: typeof QUICK_TEST_PRESETS[0]) => {
    setSelectedType(preset.type);
    if (preset.type === 'MESSAGE' || preset.type === 'URL') {
      if (preset.type === 'MESSAGE') setMessageInput(preset.content || '');
      if (preset.type === 'URL') setUrlInput(preset.content || '');
      handleAnalyze(preset.content, preset.type);
    } else if (preset.type === 'TRANSACTION') {
      setTxnAmount(preset.amount || '');
      setTxnMerchant(preset.merchant || '');
      setTxnDesc(preset.description || '');
      const text = `Transaction: Amount ₹${preset.amount} to Merchant "${preset.merchant}" with narrative: "${preset.description}"`;
      handleAnalyze(text, 'TRANSACTION');
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

  // If a result is active, render the dedicated Risk Result View
  if (activeResult) {
    return (
      <RiskResultView
        result={activeResult}
        onScanAnother={handleResetScan}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none py-2">
      {/* Editorial Title */}
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
          AEGIS SCANNER
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#102A23] tracking-tight">
          WHAT DO YOU WANT TO CHECK?
        </h1>
        <p className="text-sm text-[#557A68]">
          Paste or enter suspicious text, links, or transactions to calculate adversarial risk.
        </p>
      </div>

      {/* 4 Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { type: 'MESSAGE' as ScanInputType, label: 'MESSAGE', desc: 'SMS, WhatsApp, email or text' },
          { type: 'URL' as ScanInputType, label: 'URL', desc: 'Website or payment link' },
          { type: 'TRANSACTION' as ScanInputType, label: 'TRANSACTION', desc: 'Payment or transfer request' },
          { type: 'DOCUMENT' as ScanInputType, label: 'DOCUMENT', desc: 'Invoice, notice or statement' },
        ].map((item) => {
          const isSelected = selectedType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className={`p-3.5 text-left border rounded-xs transition-all ${
                isSelected
                  ? 'bg-[#102A23] text-white border-[#102A23] shadow-xs'
                  : 'bg-[#FFFFFF] text-[#102A23] border-[#557A68]/25 hover:bg-[#EAE3D5]'
              }`}
            >
              <span className="block text-xs font-mono font-bold tracking-wider">
                {item.label}
              </span>
              <span className={`block text-[11px] mt-0.5 leading-snug ${isSelected ? 'text-[#9BAF9F]' : 'text-[#557A68]'}`}>
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary Input Container */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 md:p-8 rounded-xs space-y-6 shadow-xs">
        {/* MESSAGE INPUT */}
        {selectedType === 'MESSAGE' && (
          <div className="space-y-3">
            <label className="block text-xs font-mono text-[#557A68] uppercase tracking-wider">
              PASTE SUSPICIOUS MESSAGE
            </label>
            <textarea
              rows={5}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={isProcessing}
              placeholder='e.g., "Your bank account will be blocked today. Complete KYC immediately at http://..."'
              className="w-full p-4 bg-[#F5F1E8] border border-[#557A68]/30 rounded-xs text-sm font-mono text-[#102A23] placeholder-[#557A68]/45 focus:outline-none focus:border-[#102A23] focus:bg-white transition-colors"
            />
          </div>
        )}

        {/* URL INPUT */}
        {selectedType === 'URL' && (
          <div className="space-y-3">
            <label className="block text-xs font-mono text-[#557A68] uppercase tracking-wider">
              ENTER WEBSITE OR PAYMENT LINK
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isProcessing}
              placeholder="https://example.com/payment-or-login"
              className="w-full p-4 bg-[#F5F1E8] border border-[#557A68]/30 rounded-xs text-sm font-mono text-[#102A23] placeholder-[#557A68]/45 focus:outline-none focus:border-[#102A23] focus:bg-white transition-colors"
            />
          </div>
        )}

        {/* TRANSACTION INPUT */}
        {selectedType === 'TRANSACTION' && (
          <div className="space-y-4">
            <label className="block text-xs font-mono text-[#557A68] uppercase tracking-wider">
              TRANSACTION INFORMATION
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] font-mono text-[#557A68] mb-1">AMOUNT (₹ / USD)</span>
                <input
                  type="number"
                  placeholder="25000"
                  value={txnAmount}
                  onChange={(e) => setTxnAmount(e.target.value)}
                  className="w-full p-3 bg-[#F5F1E8] border border-[#557A68]/30 rounded-xs text-sm font-mono text-[#102A23] focus:outline-none focus:border-[#102A23]"
                />
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[#557A68] mb-1">MERCHANT / RECIPIENT</span>
                <input
                  type="text"
                  placeholder="XYZ Pvt / UPI ID"
                  value={txnMerchant}
                  onChange={(e) => setTxnMerchant(e.target.value)}
                  className="w-full p-3 bg-[#F5F1E8] border border-[#557A68]/30 rounded-xs text-sm font-mono text-[#102A23] focus:outline-none focus:border-[#102A23]"
                />
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-mono text-[#557A68] mb-1">PAYMENT DESCRIPTION / CONTEXT</span>
              <input
                type="text"
                placeholder="e.g. Investment deposit, advance courier fee, part-time job task"
                value={txnDesc}
                onChange={(e) => setTxnDesc(e.target.value)}
                className="w-full p-3 bg-[#F5F1E8] border border-[#557A68]/30 rounded-xs text-sm font-mono text-[#102A23] focus:outline-none focus:border-[#102A23]"
              />
            </div>
          </div>
        )}

        {/* DOCUMENT INPUT */}
        {selectedType === 'DOCUMENT' && (
          <div className="space-y-3">
            <label className="block text-xs font-mono text-[#557A68] uppercase tracking-wider">
              PASTE FINANCIAL DOCUMENT / NOTICE TEXT
            </label>
            <textarea
              rows={5}
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              disabled={isProcessing}
              placeholder="Paste extracted text from PDF invoice, legal threat notice, or KYC letter..."
              className="w-full p-4 bg-[#F5F1E8] border border-[#557A68]/30 rounded-xs text-sm font-mono text-[#102A23] placeholder-[#557A68]/45 focus:outline-none focus:border-[#102A23] focus:bg-white transition-colors"
            />
          </div>
        )}

        {/* Processing State Animation */}
        {isProcessing && (
          <div className="p-5 bg-[#F5F1E8] border border-[#557A68]/20 rounded-xs text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#102A23] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#102A23] animate-ping" />
              <span>PROCESSING ANALYSIS SEQUENCE</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              {PROCESSING_STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-xs transition-colors ${
                      idx === processingIndex
                        ? 'bg-[#102A23] text-white font-bold'
                        : idx < processingIndex
                        ? 'bg-[#557A68] text-white'
                        : 'bg-[#EAE3D5] text-[#557A68]'
                    }`}
                  >
                    {step}
                  </span>
                  {idx < PROCESSING_STEPS.length - 1 && (
                    <span className="text-[#557A68] opacity-50">↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={() => handleAnalyze()}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] disabled:opacity-40 transition-colors shadow-xs rounded-xs flex items-center justify-center gap-2"
          >
            <span>ANALYZE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Fast Test Presets */}
        <div className="pt-4 border-t border-[#557A68]/15 space-y-2">
          <span className="text-[11px] font-mono text-[#557A68] uppercase tracking-wider block">
            ONE-CLICK VERIFICATION EXAMPLES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_TEST_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadPreset(p)}
                disabled={isProcessing}
                className="p-2.5 text-left bg-[#F5F1E8] border border-[#557A68]/20 hover:border-[#102A23] hover:bg-[#EAE3D5] rounded-xs transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                  <span className="text-[#102A23] font-bold">{p.type}</span>
                  <span className="text-[#557A68]">LOAD & SCAN →</span>
                </div>
                <div className="text-xs font-medium text-[#102A23] truncate">
                  {p.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
