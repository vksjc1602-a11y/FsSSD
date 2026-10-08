/**
 * AEGIS Scanner
 * Signature financial scam & fraud verification interface.
 */

import React, { useState } from 'react';
import { ScanInputType, ScanResult } from '../../types';
import { analyzeMessageOrInput } from '../../engine/riskEngine';
import RadialRiskScore from './RadialRiskScore';
import { ShieldAlert, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle, FileText, Globe, MessageSquare, Send, Mail } from 'lucide-react';

const ANALYSIS_STAGES = [
  'INGESTING',
  'NORMALIZING',
  'PATTERN ANALYSIS',
  'THREAT INTELLIGENCE',
  'MODEL ANALYSIS',
  'RISK ENGINE',
  'AEGIS VERDICT'
];

const PRESET_SAMPLES = [
  {
    type: 'MESSAGE' as ScanInputType,
    title: 'Urgent Bank KYC Phishing SMS',
    content: 'Dear SBI user, your netbanking access will be blocked today within 24 hours. Complete your KYC immediately at: http://sbi-kyc-verify.top/auth or contact officer.'
  },
  {
    type: 'URL' as ScanInputType,
    title: 'Deceptive Customs Package Link',
    content: 'https://security-login-sbi-portal.xyz/auth?session=unclaimed_parcel_fee'
  },
  {
    type: 'TRANSACTION' as ScanInputType,
    title: 'Mule Merchant UPI Redirection',
    content: 'TXN #90214: Payment of INR 49,999 to MERCH-QIKPAY-88192 for Urgent KYC Security Deposit Refundable Fee via UPI.'
  },
  {
    type: 'EMAIL' as ScanInputType,
    title: 'BEC Executive Invoice Redirection',
    content: 'Subject: URGENT: Revised Wire Settlement for Q3 Audit\nFrom: billing-update@corp-vendor-payment.xyz\nPlease note our treasury partner account has changed due to audit. Disburse invoice #881 to IBAN GB49BARC2091.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    title: 'High-Yield Telegram Crypto Lure',
    content: 'Join VIP trading group. Guaranteed 400% daily profit on crypto mining bot. Deposit INR 5000 in escrow pool to activate daily payout.'
  },
  {
    type: 'MESSAGE' as ScanInputType,
    title: 'Legitimate Bank Transaction Alert',
    content: 'Your HDFC Bank Acct XX4912 has been debited with INR 1,420 at Fresh Mart on 07-OCT-2026. Ref UPI/49192. If not done by you, SMS BLOCK to 5676712.'
  }
];

export default function ScannerView() {
  const [activeTab, setActiveTab] = useState<ScanInputType>('MESSAGE');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  const handleRunScan = (textToScan?: string) => {
    const text = textToScan !== undefined ? textToScan : inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setAnalysisStep(0);
    setFeedbackGiven(null);

    // Step through the sophisticated analysis pipeline
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnalysisStep(step);
      if (step >= ANALYSIS_STAGES.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          const scanOutput = analyzeMessageOrInput(text, activeTab);
          setResult(scanOutput);
          setIsAnalyzing(false);
        }, 220);
      }
    }, 180);
  };

  const handleSelectPreset = (sample: typeof PRESET_SAMPLES[0]) => {
    setActiveTab(sample.type);
    setInputText(sample.content);
    handleRunScan(sample.content);
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setIsAnalyzing(false);
    setFeedbackGiven(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#654536]/20 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
          <span>THREAT VERIFICATION ENGINE</span>
          <span>·</span>
          <span>MULTI-LAYER INSPECTION</span>
          <span>·</span>
          <span>REAL-TIME ANALYSIS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#3A2418]">
          WHAT WOULD YOU LIKE TO VERIFY?
        </h1>
        <p className="text-sm text-[#654536] mt-1 max-w-2xl">
          Submit suspicious SMS, banking correspondence, payment requests, URLs, or transaction descriptions to calculate composite risk vectors against live fraud telemetry.
        </p>
      </div>

      {/* Input Surface */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 p-5 md:p-6 shadow-sm">
        {/* Verification Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#654536]/15 pb-4 mb-4">
          {(['MESSAGE', 'URL', 'TRANSACTION', 'EMAIL', 'DOCUMENT'] as ScanInputType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setResult(null);
                }}
                className={`px-4 py-2 text-xs font-mono font-medium tracking-wider uppercase transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#3A2418] text-[#FFFFFF]'
                    : 'text-[#654536] hover:text-[#3A2418] hover:bg-[#E6D6C3]/50'
                }`}
              >
                {tab === 'MESSAGE' && <MessageSquare className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />}
                {tab === 'URL' && <Globe className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />}
                {tab === 'TRANSACTION' && <Send className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />}
                {tab === 'EMAIL' && <Mail className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />}
                {tab === 'DOCUMENT' && <FileText className="w-3.5 h-3.5 inline-block mr-1.5 opacity-80" />}
                {tab}
              </button>
            );
          })}
        </div>

        {/* Text Input Area */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-[#654536] uppercase tracking-wider">
            {activeTab === 'MESSAGE' && 'SMS OR CHAT MESSAGE CONTENT'}
            {activeTab === 'URL' && 'TARGET DOMAIN OR FULL WEB LINK'}
            {activeTab === 'TRANSACTION' && 'TRANSACTION NARRATIVE, MERCHANT, OR BENEFICIARY ID'}
            {activeTab === 'EMAIL' && 'EMAIL HEADER & BODY TRANSCRIPT'}
            {activeTab === 'DOCUMENT' && 'INVOICE OR KYC NOTICE TEXT'}
          </label>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAnalyzing}
            placeholder={
              activeTab === 'MESSAGE'
                ? 'Paste suspicious SMS e.g., "Your bank account blocked today. Verify KYC at http://example.xyz..."'
                : activeTab === 'URL'
                ? 'Paste full link or domain e.g., "http://sbi-kyc-verify.top/login"'
                : activeTab === 'TRANSACTION'
                ? 'Enter transaction e.g., "Payment of INR 49,999 to MERCH-QIKPAY-88192 via UPI for urgent fee"'
                : activeTab === 'EMAIL'
                ? 'Paste email subject, sender address, and body content...'
                : 'Paste extracted text from PDF invoice, KYC request, or legal notice...'
            }
            rows={4}
            className="w-full p-3.5 bg-[#FFFFFF] border border-[#654536]/30 text-sm font-mono text-[#3A2418] placeholder-[#654536]/40 focus:outline-none focus:border-[#B86F52] focus:ring-1 focus:ring-[#B86F52] transition-colors resize-y"
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#654536]">
              <span className="font-mono text-[11px] opacity-75">
                {inputText.length} characters · Zero telemetry retention enabled
              </span>
            </div>

            <div className="flex items-center gap-2">
              {result && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-xs font-mono text-[#654536] border border-[#654536]/30 hover:border-[#3A2418] hover:text-[#3A2418] transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESET
                </button>
              )}
              <button
                onClick={() => handleRunScan()}
                disabled={isAnalyzing || !inputText.trim()}
                className="px-6 py-2.5 text-xs font-mono font-medium tracking-wider uppercase text-white bg-[#B86F52] hover:bg-[#A35D42] disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>VERIFY RISK PROFILE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Test Bench Presets */}
        <div className="mt-5 pt-4 border-t border-[#654536]/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#654536] uppercase tracking-wider">
              REPRESENTATIVE TEST SCENARIOS (ONE-CLICK BENCHMARK)
            </span>
            <span className="text-[10px] font-mono text-[#654536]/70">6 SYNTHETIC CASES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(sample)}
                disabled={isAnalyzing}
                className="p-2.5 text-left bg-[#F5EFE4] border border-[#654536]/20 hover:border-[#B86F52] hover:bg-[#E6D6C3]/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#B86F52] font-semibold">
                    {sample.type}
                  </span>
                  <span className="text-[9px] font-mono text-[#654536] opacity-60">
                    LOAD & SCAN →
                  </span>
                </div>
                <div className="text-xs font-medium text-[#3A2418] line-clamp-1 group-hover:text-[#B86F52] transition-colors">
                  {sample.title}
                </div>
                <div className="text-[11px] font-mono text-[#654536] line-clamp-1 opacity-70 mt-0.5">
                  {sample.content}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis In-Progress Sequence (Restrained Animated Line Progress) */}
      {isAnalyzing && (
        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-widest">
            <span className="inline-block w-2 h-2 rounded-full bg-[#B86F52] animate-ping" />
            <span>ANALYSIS SEQUENCE EXECUTING</span>
          </div>

          {/* Stepper Pipeline */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto pt-2">
            {ANALYSIS_STAGES.map((stage, idx) => {
              const isPast = idx < analysisStep;
              const isCurrent = idx === analysisStep;
              return (
                <div key={stage} className="flex items-center gap-1.5">
                  <div
                    className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors ${
                      isCurrent
                        ? 'bg-[#B86F52] text-white font-bold'
                        : isPast
                        ? 'bg-[#3A2418] text-white'
                        : 'bg-[#E6D6C3] text-[#654536]'
                    }`}
                  >
                    {stage}
                  </div>
                  {idx < ANALYSIS_STAGES.length - 1 && (
                    <span className="text-xs font-mono text-[#654536] opacity-40">→</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Minimalist Progress Track */}
          <div className="w-full max-w-md mx-auto bg-[#E6D6C3] h-1.5 overflow-hidden">
            <div
              className="bg-[#B86F52] h-full transition-all duration-200"
              style={{
                width: `${((analysisStep + 1) / ANALYSIS_STAGES.length) * 100}%`
              }}
            />
          </div>

          <p className="text-xs font-mono text-[#654536]">
            Evaluating linguistic token entropy, heuristic domain reputation, and behavioral triad patterns...
          </p>
        </div>
      )}

      {/* Verification Results Briefing */}
      {result && !isAnalyzing && (
        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-6 space-y-6">
          {/* Top Result Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#654536]/20 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
                <span>INCIDENT ID: {result.id}</span>
                <span>·</span>
                <span>VERIFIED: {new Date(result.timestamp).toLocaleTimeString()}</span>
                <span>·</span>
                <span>LATENCY: {result.modelMetadata.latencyMs}ms</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-[#3A2418]">
                {result.classification}
              </h2>
              <p className="text-sm text-[#654536] mt-1">
                {result.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="block text-[10px] font-mono text-[#654536] uppercase tracking-wider">
                  MODEL CONFIDENCE
                </span>
                <span className="text-lg font-mono font-bold text-[#3A2418] tabular-nums">
                  {result.confidence}%
                </span>
              </div>
              <div
                className="px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor:
                    result.riskScore > 60
                      ? '#3A2418'
                      : result.riskScore <= 20
                      ? '#102A23'
                      : '#E6D6C3',
                  color:
                    result.riskScore > 60
                      ? '#B86F52'
                      : result.riskScore <= 20
                      ? '#FFFFFF'
                      : '#3A2418',
                  borderColor:
                    result.riskScore > 60
                      ? '#B86F52'
                      : result.riskScore <= 20
                      ? '#102A23'
                      : '#654536',
                }}
              >
                {result.severity}
              </div>
            </div>
          </div>

          {/* Main Grid: Radial Gauge + Why Flagged */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Radial Visualization (Left 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center bg-[#F5EFE4] p-5 border border-[#654536]/20">
              <span className="text-xs font-mono text-[#654536] uppercase tracking-wider mb-2">
                AEGIS COMPOSITE RADIAL ARCHITECTURE
              </span>
              <RadialRiskScore
                score={result.riskScore}
                severity={result.severity}
                confidence={result.confidence}
                componentScores={result.componentScores}
                size={280}
              />
            </div>

            {/* Explainable AI Findings (Right 7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h3 className="text-xs font-mono text-[#654536] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#B86F52]" />
                  <span>WHY AEGIS FLAGGED THIS</span>
                </h3>
                <div className="space-y-1.5">
                  {result.reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 bg-[#F5EFE4]/60 border border-[#654536]/15 text-xs text-[#3A2418]"
                    >
                      <span className="text-[#B86F52] font-mono font-bold">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributing Risk Factors */}
              <div>
                <h3 className="text-xs font-mono text-[#654536] uppercase tracking-wider mb-2">
                  CONTRIBUTING RISK FACTORS & ATTRIBUTION
                </h3>
                <div className="divide-y divide-[#654536]/15 border border-[#654536]/20 bg-[#FFFFFF]">
                  {result.factors.map((factor, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#3A2418]">
                            {factor.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#654536] px-1 bg-[#E6D6C3]/60">
                            {factor.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#654536]">
                          {factor.description}
                        </p>
                        <div className="text-[10px] font-mono text-[#654536] opacity-80">
                          Evidence: <span className="text-[#3A2418] font-semibold">{factor.evidence}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs font-mono font-bold text-[#B86F52]">
                          +{factor.weight}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action Protocols */}
              <div className="p-4 bg-[#E6D6C3]/60 border border-[#654536]/25">
                <h3 className="text-xs font-mono font-bold text-[#3A2418] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B86F52]" />
                  <span>RECOMMENDED DEFENSIVE PROTOCOL</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-[#3A2418]">
                  {result.recommendedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#B86F52] font-mono font-bold">■</span>
                      <span className="font-medium">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Model Provenance & User Feedback Loop */}
          <div className="pt-4 border-t border-[#654536]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 font-mono text-[#654536] text-[11px]">
              <span>PIPELINE: {result.modelMetadata.enginePipeline}</span>
              <span>·</span>
              <span>DATASET SIMILARITY: {result.modelMetadata.datasetSimilarity}%</span>
            </div>

            {/* Feedback Loop */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#654536] text-[11px]">FEEDBACK:</span>
              {feedbackGiven ? (
                <span className="text-[#3A2418] font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B86F52]" />
                  Recorded ({feedbackGiven})
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setFeedbackGiven('VALID_DETECTION')}
                    className="px-2.5 py-1 text-[11px] font-mono text-[#3A2418] bg-[#E6D6C3] hover:bg-[#D4C0A8] transition-colors"
                  >
                    ACCURATE DETECTION
                  </button>
                  <button
                    onClick={() => setFeedbackGiven('FALSE_POSITIVE')}
                    className="px-2.5 py-1 text-[11px] font-mono text-[#654536] border border-[#654536]/30 hover:text-[#3A2418] hover:border-[#3A2418] transition-colors"
                  >
                    FALSE POSITIVE
                  </button>
                  <button
                    onClick={() => setFeedbackGiven('MISSED_INDICATOR')}
                    className="px-2.5 py-1 text-[11px] font-mono text-[#654536] border border-[#654536]/30 hover:text-[#3A2418] hover:border-[#3A2418] transition-colors"
                  >
                    REPORT NOVEL THREAT
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
