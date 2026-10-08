/**
 * AEGIS Command Center
 * Editorial Threat Intelligence Briefing & Executive Risk Overview.
 */

import React from 'react';
import { THREAT_INTELLIGENCE_ENTITIES, INITIAL_ALERTS } from '../../engine/threatStore';
import { Shield, ArrowUpRight, Activity, AlertTriangle, Layers, Filter } from 'lucide-react';

interface CommandCenterProps {
  onNavigate: (view: string) => void;
}

export default function CommandCenterView({ onNavigate }: CommandCenterProps) {
  // Timeline sample datapoints (24 hours activity)
  const timelinePoints = [
    { time: '00:00', threats: 12, blocked: 4 },
    { time: '03:00', threats: 8, blocked: 2 },
    { time: '06:00', threats: 18, blocked: 7 },
    { time: '09:00', threats: 54, blocked: 28 },
    { time: '12:00', threats: 72, blocked: 39 },
    { time: '15:00', threats: 88, blocked: 46 },
    { time: '18:00', threats: 94, blocked: 52 },
    { time: '21:00', threats: 62, blocked: 31 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Editorial Intelligence Briefing Header */}
      <div className="border-b border-[#654536]/25 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
            <span>AEGIS THREAT BRIEFING</span>
            <span>·</span>
            <span>CYCLE: 2026-10-07</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              STATUS: <span className="bg-[#102A23] text-white px-1.5 py-0.5 text-[10px] font-bold tracking-wider">ACTIVE DEFENSE</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#3A2418]">
            AEGIS COMMAND CENTER
          </h1>
          <p className="text-sm text-[#654536] mt-1 max-w-2xl">
            Live global financial scam posture, perimeter telemetry, active adversarial campaigns, and automated mitigation stream.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('SCANNER')}
            className="px-5 py-2 text-xs font-mono font-medium tracking-wider uppercase text-white bg-[#B86F52] hover:bg-[#A35D42] transition-colors shadow-xs"
          >
            LAUNCH SCANNER →
          </button>
        </div>
      </div>

      {/* Hero Intelligence Briefing Block (Editorial Composition) */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Large Primary Threat Level (Left 4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#654536]/20 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-widest text-[#654536] uppercase opacity-80 mb-2">
              AGGREGATE THREAT LEVEL
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl md:text-7xl font-mono font-bold text-[#3A2418] tabular-nums leading-none">
                74
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-mono font-bold text-[#B86F52] tracking-wider uppercase">
                  HIGH SEVERITY
                </span>
                <span className="text-[11px] font-mono text-[#654536] opacity-75">
                  ELEVATED CAMPAIGN RISK
                </span>
              </div>
            </div>

            {/* Geometric Multi-Segment Threat Gauge */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-[#654536]">
                <span>BASELINE: 20</span>
                <span>CRITICAL THRESHOLD: 80</span>
              </div>
              <div className="grid grid-cols-10 gap-1 h-2">
                {[...Array(10)].map((_, i) => {
                  const filled = i < 7;
                  const isHigh = i >= 6;
                  return (
                    <div
                      key={i}
                      className="h-full"
                      style={{
                        backgroundColor: filled
                          ? isHigh
                            ? '#B86F52'
                            : '#3A2418'
                          : '#E6D6C3',
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-[#654536] pt-1">
                Triggered by an aggressive surge in banking KYC credential harvesting across telecom gateways.
              </p>
            </div>
          </div>

          {/* Key Intelligence Metrics (Right 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#654536] uppercase tracking-wider block">
                ACTIVE THREATS
              </span>
              <span className="text-3xl font-mono font-semibold text-[#3A2418] tabular-nums block">
                18
              </span>
              <span className="text-[11px] font-mono text-[#B86F52] block">
                +4 new campaigns
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#654536] uppercase tracking-wider block">
                SCANS TODAY
              </span>
              <span className="text-3xl font-mono font-semibold text-[#3A2418] tabular-nums block">
                1,284
              </span>
              <span className="text-[11px] font-mono text-[#654536] opacity-80 block">
                +14% vs 7d avg
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#654536] uppercase tracking-wider block">
                BLOCKED ATTEMPTS
              </span>
              <span className="text-3xl font-mono font-semibold text-[#3A2418] tabular-nums block">
                93
              </span>
              <span className="text-[11px] font-mono text-[#102A23] font-bold block">
                $412,000 preserved
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#654536] uppercase tracking-wider block">
                MODEL CONFIDENCE
              </span>
              <span className="text-3xl font-mono font-semibold text-[#3A2418] tabular-nums block">
                96.2%
              </span>
              <span className="text-[11px] font-mono text-[#654536] opacity-80 block">
                1.2% false positive
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Threat Activity Timeline Visualization */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#654536]/15 gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#3A2418] tracking-tight">
              THREAT ACTIVITY & INTERCEPTION TIMELINE
            </h2>
            <p className="text-xs text-[#654536]">
              Hourly detected hostile scam payloads vs automated security interceptions across the last 24 hours.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#3A2418]">
              <span className="w-2.5 h-2.5 bg-[#3A2418]" /> TOTAL THREAT DETECTIONS
            </span>
            <span className="flex items-center gap-1.5 text-[#B86F52]">
              <span className="w-2.5 h-2.5 bg-[#B86F52]" /> AUTONOMOUS INTERCEPTIONS
            </span>
          </div>
        </div>

        {/* Minimalist SVG Timeline Visualization */}
        <div className="w-full h-44 relative pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 140" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="800" y2="20" stroke="#E6D6C3" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="800" y2="60" stroke="#E6D6C3" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#E6D6C3" strokeWidth="1" strokeDasharray="3 3" />

            {/* Area Path for Threats */}
            <polygon
              points={`0,140 0,${140 - (timelinePoints[0].threats / 100) * 110} 114,${140 - (timelinePoints[1].threats / 100) * 110} 228,${140 - (timelinePoints[2].threats / 100) * 110} 342,${140 - (timelinePoints[3].threats / 100) * 110} 456,${140 - (timelinePoints[4].threats / 100) * 110} 570,${140 - (timelinePoints[5].threats / 100) * 110} 684,${140 - (timelinePoints[6].threats / 100) * 110} 800,${140 - (timelinePoints[7].threats / 100) * 110} 800,140`}
              fill="#E6D6C3"
              opacity="0.45"
            />

            {/* Line Path for Threats (Deep Brown) */}
            <polyline
              points={`0,${140 - (timelinePoints[0].threats / 100) * 110} 114,${140 - (timelinePoints[1].threats / 100) * 110} 228,${140 - (timelinePoints[2].threats / 100) * 110} 342,${140 - (timelinePoints[3].threats / 100) * 110} 456,${140 - (timelinePoints[4].threats / 100) * 110} 570,${140 - (timelinePoints[5].threats / 100) * 110} 684,${140 - (timelinePoints[6].threats / 100) * 110} 800,${140 - (timelinePoints[7].threats / 100) * 110}`}
              fill="none"
              stroke="#3A2418"
              strokeWidth="2.5"
            />

            {/* Line Path for Interceptions (Terracotta) */}
            <polyline
              points={`0,${140 - (timelinePoints[0].blocked / 100) * 110} 114,${140 - (timelinePoints[1].blocked / 100) * 110} 228,${140 - (timelinePoints[2].blocked / 100) * 110} 342,${140 - (timelinePoints[3].blocked / 100) * 110} 456,${140 - (timelinePoints[4].blocked / 100) * 110} 570,${140 - (timelinePoints[5].blocked / 100) * 110} 684,${140 - (timelinePoints[6].blocked / 100) * 110} 800,${140 - (timelinePoints[7].blocked / 100) * 110}`}
              fill="none"
              stroke="#B86F52"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* Dots */}
            {timelinePoints.map((pt, idx) => {
              const x = idx * 114.2;
              const y1 = 140 - (pt.threats / 100) * 110;
              const y2 = 140 - (pt.blocked / 100) * 110;
              return (
                <g key={pt.time}>
                  <circle cx={x} cy={y1} r="3" fill="#3A2418" />
                  <circle cx={x} cy={y2} r="2.5" fill="#B86F52" />
                </g>
              );
            })}
          </svg>

          {/* Time axis labels */}
          <div className="flex justify-between text-[10px] font-mono text-[#654536] pt-2 border-t border-[#654536]/15">
            {timelinePoints.map((pt) => (
              <span key={pt.time}>{pt.time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Split Section: Recent Intelligence Briefing + Attack Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Intelligence Dossiers (Left 8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#654536]/30 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#654536]/15">
            <div>
              <h2 className="text-base font-semibold text-[#3A2418] tracking-tight">
                RECENT INTELLIGENCE DOSSIERS
              </h2>
              <span className="text-xs text-[#654536]">
                Identified hostile campaigns and critical infrastructure signatures.
              </span>
            </div>
            <button
              onClick={() => onNavigate('THREATS')}
              className="text-xs font-mono text-[#654536] hover:text-[#B86F52] transition-colors"
            >
              VIEW ALL THREATS →
            </button>
          </div>

          <div className="divide-y divide-[#654536]/15">
            {THREAT_INTELLIGENCE_ENTITIES.slice(0, 4).map((threat) => (
              <div key={threat.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#3A2418]">
                      #{threat.id.replace('THREAT-ENT-', 'AE-')}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#E6D6C3] text-[#3A2418]">
                      {threat.type}
                    </span>
                    <span className="text-[11px] font-mono text-[#654536]">
                      {threat.reportsCount} reports
                    </span>
                  </div>
                  <div className="text-sm font-medium text-[#3A2418]">
                    {threat.value}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-[#654536]">
                    {threat.tags.map((tag) => (
                      <span key={tag} className="border border-[#654536]/20 px-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-xs font-mono font-bold text-[#B86F52]">
                    RISK {threat.reputationScore}
                  </span>
                  <span className="block text-[11px] font-mono text-[#654536]">
                    ${(threat.financialImpactEstimateUsd / 1000).toFixed(0)}k est. impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Attack Vectors Breakdown (Right 4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#654536]/30 p-6 space-y-4">
          <div className="pb-3 border-b border-[#654536]/15">
            <h2 className="text-base font-semibold text-[#3A2418] tracking-tight">
              VECTOR BREAKDOWN
            </h2>
            <span className="text-xs text-[#654536]">
              Distribution of current attack campaigns.
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'SMS Banking KYC Phishing', pct: 42 },
              { label: 'BEC Invoice Redirection', pct: 24 },
              { label: 'Telegram Crypto & Task Scams', pct: 18 },
              { label: 'Customs & Courier Delivery Fees', pct: 16 },
            ].map((v) => (
              <div key={v.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3A2418] font-medium">{v.label}</span>
                  <span className="font-mono text-[#3A2418] font-bold">{v.pct}%</span>
                </div>
                <div className="w-full bg-[#E6D6C3] h-2">
                  <div
                    className="h-full bg-[#3A2418]"
                    style={{
                      width: `${v.pct}%`,
                      backgroundColor: v.pct >= 30 ? '#B86F52' : '#3A2418'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#654536]/15 bg-[#F5EFE4] p-3">
            <span className="block text-[10px] font-mono text-[#654536] uppercase tracking-wider mb-1">
              DEFENSE RECOMMENDATION
            </span>
            <p className="text-xs text-[#3A2418]">
              Automate inbound SMS perimeter filtering for disposable <code className="font-mono text-[#B86F52]">.xyz/.top</code> links soliciting KYC credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
