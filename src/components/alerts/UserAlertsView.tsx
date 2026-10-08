/**
 * AEGIS Alerts
 * Answers: "What requires my attention?"
 * Simple, clear notifications prioritized by severity.
 */

import React, { useState } from 'react';
import { AlertRecord, SeverityLevel } from '../../types';
import { ShieldAlert, AlertTriangle, Check, ArrowRight } from 'lucide-react';

interface UserAlertsViewProps {
  alerts: AlertRecord[];
  onDismissAlert?: (id: string) => void;
  onViewScanDetail?: (alert: AlertRecord) => void;
}

export default function UserAlertsView({
  alerts,
  onDismissAlert,
  onViewScanDetail,
}: UserAlertsViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none py-2">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
          ALERTS
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#102A23] tracking-tight">
          What requires your attention?
        </h1>
        <p className="text-sm text-[#557A68]">
          Prioritized notifications of high-risk impersonation attacks and intercepted scam payloads.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#557A68]/20 pb-3">
        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors rounded-xs ${
              filterSeverity === sev
                ? 'bg-[#102A23] text-white font-bold'
                : 'text-[#557A68] hover:bg-[#EAE3D5]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Simple Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFFFF] border border-[#557A68]/20 rounded-xs text-[#557A68] text-xs font-mono">
            No active alerts in this severity category.
          </div>
        ) : (
          filtered.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className="bg-[#FFFFFF] border border-[#557A68]/25 p-5 rounded-xs space-y-3 transition-all hover:border-[#102A23] shadow-xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs"
                        style={{
                          backgroundColor: isCritical ? '#102A23' : isHigh ? '#EAE3D5' : '#F5F1E8',
                          color: isCritical ? '#FFFFFF' : '#102A23',
                        }}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs font-mono text-[#557A68]">
                        · {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#102A23]">
                      {alert.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                    className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-[#557A68]/30 hover:bg-[#102A23] hover:text-white transition-colors rounded-xs"
                  >
                    {selectedAlert?.id === alert.id ? 'CLOSE' : 'VIEW'}
                  </button>
                </div>

                <p className="text-xs text-[#557A68] leading-relaxed">
                  {alert.summary}
                </p>

                {/* Expanded Details Drawer */}
                {selectedAlert?.id === alert.id && (
                  <div className="pt-3 border-t border-[#557A68]/15 space-y-2 text-xs font-mono bg-[#F5F1E8]/60 p-3 rounded-xs">
                    <div>
                      <span className="text-[#557A68] block text-[10px]">REASON / CONTEXT</span>
                      <span className="text-[#102A23] font-semibold">{alert.entityAffected}</span>
                    </div>
                    <div>
                      <span className="text-[#557A68] block text-[10px]">RECOMMENDED ACTION</span>
                      <span className="text-[#102A23]">Do not disclose authentication tokens or approve funds transfer.</span>
                    </div>
                    {onDismissAlert && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            onDismissAlert(alert.id);
                            setSelectedAlert(null);
                          }}
                          className="px-3 py-1 bg-[#102A23] text-white text-[11px] font-mono rounded-xs"
                        >
                          MARK RESOLVED
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
