/**
 * AEGIS Risk Result Page
 * The central decision screen in AEGIS.
 * Clean, direct, and explainable. Answers: "Is this risky?", "Why is it risky?", and "What should I do?"
 */

import React, { useState } from 'react';
import { ScanResult } from '../../types';
import { ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskResultViewProps {
  result: ScanResult;
  onScanAnother: () => void;
  onReportThreat?: (result: ScanResult) => void;
}

export default function RiskResultView({
  result,
  onScanAnother,
  onReportThreat,
}: RiskResultViewProps) {
  const [feedbackUseful, setFeedbackUseful] = useState<boolean | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string | null>(null);
  const [isReported, setIsReported] = useState(false);

  // Determine Severity Color
  const isHighOrCritical = result.riskScore >= 61;
  const isGuardedOrModerate = result.riskScore >= 21 && result.riskScore <= 60;
  const isLow = result.riskScore <= 20;

  const scoreBadgeBg = isHighOrCritical
    ? '#102A23'
    : isGuardedOrModerate
    ? '#EAE3D5'
    : '#102A23';

  const scoreBadgeText = isHighOrCritical
    ? '#FFFFFF'
    : isGuardedOrModerate
    ? '#102A23'
    : '#FFFFFF';

  const handleReport = () => {
    setIsReported(true);
    if (onReportThreat) onReportThreat(result);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none py-2">
      {/* Back button */}
      <button
        onClick={onScanAnother}
        className="flex items-center gap-1.5 text-xs font-mono text-[#557A68] hover:text-[#102A23] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO SCANNER</span>
      </button>

      {/* Main Assessment Container */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-7 md:p-10 rounded-xs space-y-8 shadow-xs">
        {/* Header and Risk Score */}
        <div className="text-center space-y-3 pb-6 border-b border-[#557A68]/20">
          <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase block">
            AEGIS RISK ASSESSMENT
          </span>

          <div className="flex flex-col items-center justify-center pt-2">
            <span className="text-6xl md:text-7xl font-mono font-bold text-[#102A23] tabular-nums leading-none">
              {result.riskScore}
            </span>
            <span
              className="mt-3 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider rounded-xs"
              style={{
                backgroundColor: scoreBadgeBg,
                color: scoreBadgeText,
              }}
            >
              {result.severity} RISK
            </span>
          </div>

          <div className="text-xs font-mono text-[#557A68] pt-1">
            CONFIDENCE: <span className="text-[#102A23] font-bold">{result.confidence}%</span> · SCAN ID: #{result.id}
          </div>
        </div>

        {/* What AEGIS Found */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
            WHAT AEGIS FOUND
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#102A23]">
            {result.classification}
          </h2>
          <p className="text-sm text-[#557A68] leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Why? Numbered Evidence List */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
            WHY?
          </span>

          <div className="space-y-2.5">
            {result.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-[#F5F1E8] border border-[#557A68]/15 rounded-xs text-xs text-[#102A23]"
              >
                <span className="font-mono font-bold text-[#557A68] shrink-0">
                  0{idx + 1}
                </span>
                <span className="font-medium leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Factors & Attribution Breakdown */}
        {result.factors.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase block">
              CONTRIBUTING FACTORS
            </span>

            <div className="divide-y divide-[#557A68]/15 border border-[#557A68]/20 bg-[#F5F1E8]/40 rounded-xs">
              {result.factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-[#102A23]">{factor.name}</span>
                  <span className="font-bold text-[#102A23] tabular-nums">
                    +{factor.weight}
                  </span>
                </div>
              ))}
              <div className="px-4 py-2.5 flex items-center justify-between text-xs font-mono font-bold bg-[#EAE3D5]/50 text-[#102A23]">
                <span>TOTAL RISK ACCUMULATION</span>
                <span>{result.riskScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* What Should You Do? Recommended Action Directives */}
        <div className="p-5 bg-[#EAE3D5]/60 border border-[#557A68]/25 rounded-xs space-y-3">
          <span className="text-xs font-mono font-bold text-[#102A23] tracking-wider uppercase block">
            WHAT SHOULD YOU DO?
          </span>

          <div className="space-y-2">
            {result.recommendedActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#102A23]">
                <span className="font-bold shrink-0">■</span>
                <span className="font-semibold leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Feedback Loop */}
        <div className="pt-4 border-t border-[#557A68]/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#557A68] uppercase">WAS THIS RESULT USEFUL?</span>
            {feedbackUseful === null ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setFeedbackUseful(true)}
                  className="px-3 py-1 bg-[#F5F1E8] border border-[#557A68]/25 hover:bg-[#102A23] hover:text-white transition-colors"
                >
                  YES
                </button>
                <button
                  onClick={() => setFeedbackUseful(false)}
                  className="px-3 py-1 bg-[#F5F1E8] border border-[#557A68]/25 hover:bg-[#102A23] hover:text-white transition-colors"
                >
                  NO
                </button>
              </div>
            ) : feedbackUseful ? (
              <span className="text-[#102A23] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557A68]" />
                Feedback recorded. Thank you.
              </span>
            ) : (
              <span className="text-[#557A68]">Tell us why below:</span>
            )}
          </div>

          {feedbackUseful === false && !feedbackReason && (
            <div className="p-3 bg-[#F5F1E8] border border-[#557A68]/20 space-y-2 text-xs font-mono">
              <span className="text-[#557A68] block">Was AEGIS wrong?</span>
              <div className="flex flex-wrap gap-2">
                {['FALSE POSITIVE', 'MISSED THREAT', 'OTHER'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFeedbackReason(opt)}
                    className="px-2.5 py-1 bg-[#FFFFFF] border border-[#557A68]/30 hover:bg-[#102A23] hover:text-white transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {feedbackReason && (
            <div className="text-xs font-mono text-[#102A23]">
              Reason logged: <span className="font-semibold">{feedbackReason}</span>. Sent to model validation review.
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
            {isReported ? 'THREAT REPORTED TO REGISTRY' : 'REPORT THREAT'}
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
