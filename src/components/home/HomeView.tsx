/**
 * AEGIS Home
 * Answers: "Am I safe?"
 * Calm, understandable, zero clutter, direct quick-scan entry points.
 */

import React from 'react';
import { ScanInputType, ScanResult, AlertRecord } from '../../types';
import { ShieldCheck, ArrowRight, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  onStartScan: (type: ScanInputType) => void;
  onNavigate: (view: string) => void;
  onSelectAlert: (alertId: string) => void;
  recentScans: ScanResult[];
  alerts: AlertRecord[];
}

export default function HomeView({
  onStartScan,
  onNavigate,
  onSelectAlert,
  recentScans,
  alerts,
}: HomeViewProps) {
  const lastScan = recentScans[0];
  const criticalOrHighAlerts = alerts.filter(
    (a) => a.severity === 'CRITICAL' || a.severity === 'HIGH'
  ).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Editorial Welcome Header */}
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
          AEGIS
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#102A23]">
          Good morning.
        </h1>
      </div>

      {/* Primary Security Status Box */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-7 md:p-9 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#557A68] tracking-widest uppercase">
              YOUR FINANCIAL SECURITY
            </span>
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl font-mono font-bold text-[#102A23] tracking-tight">
                PROTECTED
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#102A23] text-white text-xs font-mono font-semibold rounded-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9BAF9F]" />
                ACTIVE
              </span>
            </div>
            <p className="text-sm text-[#557A68]">
              No critical threats targeting your accounts or verified contacts.
            </p>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-[#557A68]/20 pt-4 md:pt-0 md:pl-8 flex flex-col justify-center space-y-1 text-xs font-mono text-[#557A68]">
            <div>Perimeter Defense: <span className="text-[#102A23] font-semibold">ONLINE</span></div>
            <div>Scam Filter: <span className="text-[#102A23] font-semibold">ENGAGED</span></div>
            <div>Threat Invariants: <span className="text-[#102A23] font-semibold">VERIFIED</span></div>
          </div>
        </div>
      </div>

      {/* Recent Activity Stats */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-[#557A68] tracking-wider uppercase">
          RECENT ACTIVITY
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Last Scan */}
          <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs">
            <span className="text-xs font-mono text-[#557A68] block">LAST SCAN</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg font-mono font-bold text-[#102A23]">
                Risk: {lastScan ? lastScan.severity : 'LOW'}
              </span>
              <span className="text-xs font-mono text-[#557A68]">
                {lastScan ? new Date(lastScan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'}
              </span>
            </div>
            <p className="text-xs text-[#557A68] mt-1 truncate">
              {lastScan ? lastScan.classification : 'No threats flagged in recent check'}
            </p>
          </div>

          {/* Last Alert */}
          <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs">
            <span className="text-xs font-mono text-[#557A68] block">LAST ALERT</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg font-mono font-bold text-[#102A23]">
                2 hours ago
              </span>
              <span className="text-xs font-mono px-1.5 py-0.2 bg-[#EAE3D5] text-[#102A23] font-semibold">
                LOGGED
              </span>
            </div>
            <p className="text-xs text-[#557A68] mt-1">
              Phishing attempt intercepted
            </p>
          </div>

          {/* Protected Threats Count */}
          <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs">
            <span className="text-xs font-mono text-[#557A68] block">PROTECTED THREATS</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-mono font-bold text-[#102A23] tabular-nums">
                12
              </span>
              <span className="text-xs font-mono text-[#557A68]">
                30-day window
              </span>
            </div>
            <p className="text-xs text-[#557A68] mt-1">
              Simulated & intercepted attacks
            </p>
          </div>
        </div>
      </div>

      {/* Quick Scan Action Section */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4">
        <div>
          <span className="text-xs font-mono text-[#557A68] tracking-widest uppercase block">
            QUICK SCAN
          </span>
          <h2 className="text-lg font-semibold text-[#102A23] mt-0.5">
            What would you like to check?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(['MESSAGE', 'URL', 'TRANSACTION', 'EMAIL', 'DOCUMENT'] as ScanInputType[]).map((type) => (
            <button
              key={type}
              onClick={() => onStartScan(type)}
              className="p-3 text-center bg-[#F5F1E8] border border-[#557A68]/25 hover:border-[#102A23] hover:bg-[#EAE3D5] transition-all group rounded-xs"
            >
              <span className="text-xs font-mono font-bold text-[#102A23] group-hover:text-[#102A23] tracking-wider block">
                {type}
              </span>
              <span className="text-[10px] font-mono text-[#557A68] mt-0.5 block opacity-80">
                CHECK NOW →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Alerts (Simple & Calm Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#557A68] tracking-wider uppercase">
            RECENT ALERTS
          </span>
          <button
            onClick={() => onNavigate('ALERTS')}
            className="text-xs font-mono text-[#557A68] hover:text-[#102A23] transition-colors"
          >
            VIEW ALL ALERTS →
          </button>
        </div>

        <div className="space-y-2.5">
          {criticalOrHighAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert.id)}
              className="p-4 bg-[#FFFFFF] border border-[#557A68]/20 hover:border-[#102A23] transition-all flex items-center justify-between gap-4 cursor-pointer rounded-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#102A23]">
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#557A68]">
                    · {alert.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#557A68] line-clamp-1">
                  {alert.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span
                  className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: alert.severity === 'CRITICAL' ? '#102A23' : '#EAE3D5',
                    color: alert.severity === 'CRITICAL' ? '#FFFFFF' : '#102A23',
                  }}
                >
                  {alert.severity}
                </span>
                <ArrowRight className="w-4 h-4 text-[#557A68]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
