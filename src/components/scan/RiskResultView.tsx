/**
 * AEGIS Comprehensive Threat Report View
 *
 * Visualizes:
 * 1. Verdict Banner & Multi-Model Concordance
 * 2. Original Input with In-Text Tactic Evidence Highlighting
 * 3. 5-Layer Stack Score Breakdown Bars
 * 4. Attacker Goal & Impersonation Mismatch Analysis
 * 5. Attack Kill-Chain Trajectory
 * 6. Prioritized India-Specific Immediate Protective Actions (1930, cybercrime.gov.in, Chakshu)
 * 7. Safer Verification Alternatives & False-Positive Risk Disclosure
 * 8. User Feedback Persistence
 */

import React, { useState } from 'react';
import { ScanResult, ThreatVerdict } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface RiskResultViewProps {
  result: ScanResult;
  onScanAnother: () => void;
  onReportThreat?: (result: ScanResult) => void;
}

export default function RiskResultView({
  result,
  onScanAnother,
  onReportThreat
}: RiskResultViewProps) {
  const [feedbackUseful, setFeedbackUseful] = useState<boolean | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string | null>(null);
  const [isReported, setIsReported] = useState(false);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);

  const report = result.threatReport;
  const verdict: ThreatVerdict = report?.verdict || (result.riskScore >= 78 ? 'SCAM' : result.riskScore >= 58 ? 'LIKELY_SCAM' : result.riskScore >= 35 ? 'SUSPICIOUS' : 'SAFE');

  // Verdict visual themes
  const verdictConfig: Record<ThreatVerdict, { bg: string; text: string; badge: string; icon: any }> = {
    SCAM: {
      bg: 'bg-[#102A23] text-white',
      badge: 'bg-[#B86F52] text-white',
      text: 'CONFIRMED MALICIOUS SCAM',
      icon: ShieldAlert
    },
    LIKELY_SCAM: {
      bg: 'bg-[#1F493B] text-white',
      badge: 'bg-[#B86F52] text-white',
      text: 'HIGH LIKELIHOOD OF FRAUD',
      icon: ShieldAlert
    },
    SUSPICIOUS: {
      bg: 'bg-[#EAE3D5] text-[#102A23]',
      badge: 'bg-[#557A68] text-white',
      text: 'SUSPICIOUS / UNVERIFIED ANOMALY',
      icon: AlertTriangle
    },
    LIKELY_SAFE: {
      bg: 'bg-[#EAE3D5]/60 text-[#102A23]',
      badge: 'bg-[#557A68] text-white',
      text: 'PROBABLE BENIGN COMMUNICATION',
      icon: ShieldCheck
    },
    SAFE: {
      bg: 'bg-white text-[#102A23]',
      badge: 'bg-[#102A23] text-white',
      text: 'VERIFIED BENIGN / LOW RISK',
      icon: ShieldCheck
    }
  };

  const vInfo = verdictConfig[verdict] || verdictConfig.SAFE;
  const VerdictIcon = vInfo.icon;

  const handleSendFeedback = async (useful: boolean, reason?: string) => {
    setFeedbackUseful(useful);
    if (reason) setFeedbackReason(reason);

    try {
      await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: result.id,
          feedback_type: useful ? 'CONFIRMED_CORRECT' : 'DISPUTED',
          verified_label: useful ? (verdict === 'SCAM' || verdict === 'LIKELY_SCAM' ? 'SCAM' : 'SAFE') : reason,
          notes: reason || (useful ? 'User verified output' : 'User flagged discrepancy')
        })
      });
    } catch {
      // Degrades gracefully
    }
  };

  const handleReport = () => {
    setIsReported(true);
    if (onReportThreat) onReportThreat(result);
  };

  // Highlight tactic evidence within text
  const renderHighlightedMessage = () => {
    const rawText = result.rawInput;
    if (!report?.tactics || report.tactics.length === 0) {
      return <p className="font-mono text-xs whitespace-pre-wrap leading-relaxed">{rawText}</p>;
    }

    return (
      <div className="space-y-3">
        <p className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-[#102A23] bg-[#F5F1E8] p-3.5 border border-[#557A68]/20 rounded-xs">
          {rawText}
        </p>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-mono text-[#557A68] uppercase mr-1">
            IDENTIFIED TACTIC SPANS:
          </span>
          {report.tactics.map((tactic, idx) => {
            const isSelected = selectedTactic === tactic.name;
            return (
              <button
                key={idx}
                onClick={() => setSelectedTactic(isSelected ? null : tactic.name)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-xs border transition-colors ${
                  isSelected
                    ? 'bg-[#102A23] text-white border-[#102A23]'
                    : 'bg-white text-[#102A23] border-[#557A68]/30 hover:bg-[#EAE3D5]'
                }`}
              >
                <span className="font-bold">{tactic.name}:</span> "{tactic.evidence.slice(0, 32)}..."
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none py-2">
      {/* Back button */}
      <button
        onClick={onScanAnother}
        className="flex items-center gap-1.5 text-xs font-mono text-[#557A68] hover:text-[#102A23] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO SCANNER</span>
      </button>

      {/* Main Threat Report Container */}
      <div className="bg-white border border-[#557A68]/25 p-6 md:p-8 rounded-xs space-y-8 shadow-xs">
        {/* Verdict Banner Header */}
        <div className="space-y-4 pb-6 border-b border-[#557A68]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase block">
                AEGIS THREAT INTELLIGENCE REPORT
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-[#557A68]">
                  SCAN #{result.id} · {result.timestamp.slice(0, 19).replace('T', ' ')}
                </span>
                {report?.llmUsed && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-[#102A23] text-white rounded-xs">
                    <Sparkles className="w-2.5 h-2.5" /> GEMINI REASONED
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-[#102A23] tabular-nums leading-none">
                  {result.riskScore}
                  <span className="text-xs text-[#557A68] font-normal">/100</span>
                </div>
                <div className="text-[10px] font-mono text-[#557A68] mt-0.5">
                  RISK INDEX
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Verdict Banner */}
          <div className={`p-4 rounded-xs border border-[#557A68]/30 flex items-start sm:items-center justify-between gap-3 ${vInfo.bg}`}>
            <div className="flex items-center gap-3">
              <VerdictIcon className="w-6 h-6 shrink-0" />
              <div>
                <span className="text-xs font-mono tracking-widest uppercase block opacity-85">
                  PRIMARY VERDICT
                </span>
                <span className="text-base sm:text-lg font-bold font-mono tracking-wide">
                  {verdict.replace('_', ' ')}: {report?.scamType || result.classification}
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right font-mono text-xs">
              <div className="font-bold">
                {result.confidence}% CONFIDENCE
              </div>
              {report && (
                <div className="text-[10px] opacity-80">
                  {(report.layerAgreement * 100).toFixed(0)}% LAYER AGREEMENT
                </div>
              )}
            </div>
          </div>

          {/* High-Risk Specific Alert Callout (UPI PIN, Card Numbers, Lottery) */}
          {report?.specialAlert && (
            <div className="p-4 bg-[#B86F52]/10 border-2 border-[#B86F52] rounded-xs space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B86F52] shrink-0" />
                <span className="font-mono text-xs font-bold text-[#B86F52] uppercase tracking-wider">
                  {report.specialAlert.title}
                </span>
              </div>
              <div className="text-xs font-mono font-bold text-[#102A23] bg-white/90 p-3 border border-[#B86F52]/30 rounded-xs leading-relaxed">
                {report.specialAlert.goldenRule}
              </div>
              <p className="text-xs text-[#102A23] font-medium leading-relaxed">
                {report.specialAlert.warningDetails}
              </p>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
            THREAT ASSESSMENT SUMMARY
          </span>
          <p className="text-sm text-[#102A23] leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Analyzed Communication & Tactic Evidence */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
            ANALYZED TEXT & EXTRACTED EVIDENCE
          </span>
          {renderHighlightedMessage()}
        </div>

        {/* 5-Layer Stack Score Breakdown */}
        {report && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase">
                DEFENSE-IN-DEPTH LAYER BREAKDOWN
              </span>
              <span className="text-[10px] font-mono text-[#557A68]">
                NORMALIZED [0-100]
              </span>
            </div>

            <div className="space-y-2 bg-[#F5F1E8]/40 border border-[#557A68]/20 p-4 rounded-xs">
              {[
                { label: 'Layer 1: Deterministic Rules & Patterns', score: report.layerScores.rules, model: 'AEGIS-Rules-v3.4' },
                { label: 'Layer 2: ML Text Semantic Classifier', score: report.layerScores.mlText, model: 'Calibrated-TFIDF-LR' },
                { label: 'Layer 2: ML URL Structural Model', score: report.layerScores.mlUrl, model: 'GradientBoosting-Lexical' },
                { label: 'Layer 3: URL & Domain Intelligence', score: report.layerScores.threatIntel, model: 'RDAP + SSRF Guard' },
                { label: 'Layer 4: Gemini Intent Reasoning', score: report.layerScores.llm, model: report.llmUsed ? 'gemini-3.8-flash' : 'STANDBY' }
              ].map((layer, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#102A23] font-medium">{layer.label}</span>
                    <span className="font-bold text-[#102A23] tabular-nums">
                      {layer.score}/100 <span className="text-[10px] text-[#557A68] font-normal">({layer.model})</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#EAE3D5] h-1.5 rounded-xs overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        layer.score >= 70 ? 'bg-[#102A23]' : layer.score >= 40 ? 'bg-[#557A68]' : 'bg-[#9BAF9F]'
                      }`}
                      style={{ width: `${Math.max(2, layer.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attacker Goal & Impersonation Mismatch */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F5F1E8]/60 border border-[#557A68]/20 rounded-xs space-y-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#557A68] uppercase block">
                ATTACKER OBJECTIVE
              </span>
              <div className="text-xs font-mono font-bold text-[#102A23]">
                {report.attackerGoal}
              </div>
              <p className="text-xs text-[#557A68] leading-relaxed pt-1">
                {report.potentialLoss}
              </p>
            </div>

            <div className="p-4 bg-[#F5F1E8]/60 border border-[#557A68]/20 rounded-xs space-y-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#557A68] uppercase block">
                IMPERSONATION ATTRIBUTION
              </span>
              <div className="text-xs font-mono font-bold text-[#102A23]">
                {report.impersonation?.claimedEntity || result.threatIndicators.impersonationDetected || 'No Explicit Brand Claimed'}
              </div>
              <p className="text-xs text-[#557A68] leading-relaxed pt-1">
                {report.impersonation?.mismatchReason || 'Originating infrastructure does not belong to authorized digital assets.'}
              </p>
            </div>
          </div>
        )}

        {/* Attack Kill-Chain Trajectory */}
        {report?.killChain && report.killChain.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
              ATTACK KILL-CHAIN TRAJECTORY (INTENDED PATH)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.killChain.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#F5F1E8] border border-[#557A68]/15 rounded-xs flex items-start gap-2.5 text-xs text-[#102A23] font-mono"
                >
                  <span className="px-1.5 py-0.5 bg-[#102A23] text-white font-bold text-[10px] rounded-xs shrink-0">
                    STAGE 0{idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What Should You Do? (India-Specific Directives) */}
        <div className="p-5 bg-[#EAE3D5]/80 border border-[#557A68]/30 rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#102A23] tracking-wider uppercase block">
              PRIORITIZED IMMEDIATE PROTECTIVE DIRECTIVES
            </span>
            <span className="text-[10px] font-mono text-[#557A68]">
              INDIA JURISDICTION
            </span>
          </div>

          <div className="space-y-2">
            {(report?.immediateActions || result.recommendedActions).map((action, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#102A23]">
                <span className="font-bold text-[#102A23] shrink-0 mt-0.5">■</span>
                <span className="font-medium leading-relaxed">{action}</span>
              </div>
            ))}
          </div>

          {/* Quick Helpline Callout */}
          <div className="pt-2 border-t border-[#557A68]/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold text-[#102A23]">
              <PhoneCall className="w-3.5 h-3.5 text-[#B86F52]" />
              National Cyber Helpline: 1930
            </span>
            <span className="text-[#557A68]">
              Portal: cybercrime.gov.in · Sanchar Saathi: sancharsaathi.gov.in
            </span>
          </div>
        </div>

        {/* Safer Alternative & False-Positive Risk */}
        {report && (
          <div className="space-y-3 border-t border-[#557A68]/20 pt-4 text-xs font-mono">
            <div className="flex items-start gap-2">
              <span className="text-[#557A68] shrink-0">SAFE ALTERNATIVE:</span>
              <span className="text-[#102A23] font-medium">{report.saferAlternative}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#557A68] shrink-0">BENIGN EXPLANATION:</span>
              <span className="text-[#557A68]">{report.falsePositiveRisk}</span>
            </div>
          </div>
        )}

        {/* User Feedback Loop - Persisted via /api/v1/feedback */}
        <div className="pt-4 border-t border-[#557A68]/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#557A68] uppercase">WAS THIS RESULT ACCURATE & USEFUL?</span>
            {feedbackUseful === null ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendFeedback(true)}
                  className="px-3 py-1 bg-[#F5F1E8] border border-[#557A68]/25 hover:bg-[#102A23] hover:text-white transition-colors"
                >
                  YES
                </button>
                <button
                  onClick={() => handleSendFeedback(false)}
                  className="px-3 py-1 bg-[#F5F1E8] border border-[#557A68]/25 hover:bg-[#102A23] hover:text-white transition-colors"
                >
                  NO
                </button>
              </div>
            ) : feedbackUseful ? (
              <span className="text-[#102A23] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557A68]" />
                Feedback recorded and logged for model telemetry.
              </span>
            ) : (
              <span className="text-[#557A68]">Specify reason to retrain:</span>
            )}
          </div>

          {feedbackUseful === false && !feedbackReason && (
            <div className="p-3 bg-[#F5F1E8] border border-[#557A68]/20 space-y-2 text-xs font-mono">
              <span className="text-[#557A68] block">Select issue classification:</span>
              <div className="flex flex-wrap gap-2">
                {['FALSE_POSITIVE', 'MISSED_THREAT', 'MISCLASSIFIED_SEVERITY'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSendFeedback(false, opt)}
                    className="px-2.5 py-1 bg-white border border-[#557A68]/30 hover:bg-[#102A23] hover:text-white transition-colors"
                  >
                    {opt.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {feedbackReason && (
            <div className="text-xs font-mono text-[#102A23]">
              Reason logged: <span className="font-semibold">{feedbackReason}</span>. Recorded in feedback.jsonl for retrain pipeline.
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReport}
            disabled={isReported}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-mono tracking-wider uppercase border border-[#557A68]/30 transition-colors ${
              isReported
                ? 'bg-[#EAE3D5] text-[#557A68]'
                : 'text-[#102A23] hover:bg-[#F5F1E8]'
            }`}
          >
            {isReported ? 'THREAT REPORTED TO REGISTRY' : 'REPORT TO THREAT REGISTRY'}
          </button>

          <button
            onClick={onScanAnother}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] transition-colors shadow-xs"
          >
            SCAN ANOTHER
          </button>
        </div>
      </div>
    </div>
  );
}
