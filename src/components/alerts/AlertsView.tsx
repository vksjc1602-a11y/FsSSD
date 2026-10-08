/**
 * AEGIS Alerts Center
 * Severity-governed alert triage adhering strictly to:
 * CRITICAL: Deep Brown panel (#3A2418), Terracotta indicator (#B86F52)
 * HIGH: Beige panel (#E6D6C3), Terracotta indicator (#B86F52)
 * MEDIUM: Cream panel (#F5EFE4), Brown indicator (#654536)
 * LOW: White panel (#FFFFFF), Brown typography (#654536)
 */

import React, { useState } from 'react';
import { INITIAL_ALERTS } from '../../engine/threatStore';
import { AlertRecord, SeverityLevel } from '../../types';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, Filter, Eye } from 'lucide-react';

export default function AlertsView() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesStat = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesSev && matchesStat;
  });

  const handleUpdateStatus = (id: string, newStatus: AlertRecord['status']) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
          <span>REAL-TIME INCIDENT NOTIFICATIONS</span>
          <span>·</span>
          <span>AUTONOMOUS TRIAGE ENGINE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
          SECURITY ALERTS CENTER
        </h1>
        <p className="text-sm text-[#654536] mt-1 max-w-2xl">
          High-priority fraud events, mass credential phishing surges, and abnormal settlement deviations requiring analyst action.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] border border-[#654536]/25 p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#654536] mr-1">SEVERITY:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors ${
                filterSeverity === sev
                  ? 'bg-[#3A2418] text-white'
                  : 'text-[#654536] hover:bg-[#E6D6C3]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-[#654536] mr-1">STATUS:</span>
          {(['ALL', 'ACTIVE', 'INVESTIGATING', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors ${
                filterStatus === stat
                  ? 'bg-[#3A2418] text-white'
                  : 'text-[#654536] hover:bg-[#E6D6C3]'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          // Strict Styling Mapping:
          // CRITICAL: Deep Brown panel, Terracotta indicator
          // HIGH: Beige panel, Terracotta indicator
          // MEDIUM: Cream panel, Brown indicator
          // LOW: White panel, Brown typography
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';
          const isMedium = alert.severity === 'MEDIUM';

          const panelBg = isCritical
            ? 'bg-[#3A2418] text-white border-[#3A2418]'
            : isHigh
            ? 'bg-[#E6D6C3] text-[#3A2418] border-[#654536]/30'
            : isMedium
            ? 'bg-[#F5EFE4] text-[#3A2418] border-[#654536]/25'
            : 'bg-[#FFFFFF] text-[#3A2418] border-[#654536]/20';

          const indicatorColor = isCritical || isHigh ? '#B86F52' : '#654536';
          const metaTextColor = isCritical ? 'text-[#E6D6C3]' : 'text-[#654536]';

          return (
            <div
              key={alert.id}
              className={`p-5 border transition-all ${panelBg}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Category & Status Bar */}
                  <div className="flex items-center gap-2.5 text-xs font-mono flex-wrap">
                    <span
                      className="w-2.5 h-2.5 inline-block shrink-0"
                      style={{ backgroundColor: indicatorColor }}
                    />
                    <span className="font-bold tracking-wider uppercase">
                      {alert.severity} SEVERITY
                    </span>
                    <span className={metaTextColor}>·</span>
                    <span className={metaTextColor}>#{alert.id}</span>
                    <span className={metaTextColor}>·</span>
                    <span className={metaTextColor}>{alert.timestamp}</span>
                    <span className={metaTextColor}>·</span>
                    <span className="px-1.5 py-0.2 border border-current text-[10px]">
                      {alert.category}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-lg font-semibold tracking-tight">
                    {alert.title}
                  </h3>
                  <p className={`text-sm ${metaTextColor}`}>
                    {alert.summary}
                  </p>

                  <div className={`text-xs font-mono pt-1 ${metaTextColor}`}>
                    TARGET IMPACT: <span className="font-semibold">{alert.entityAffected}</span>
                    {alert.assignedAnalyst && (
                      <span> · ASSIGNED: <span className="font-semibold">{alert.assignedAnalyst}</span></span>
                    )}
                  </div>
                </div>

                {/* Triage Actions */}
                <div className="shrink-0 flex flex-col items-end gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase opacity-75">STATUS:</span>
                    <span className="font-bold uppercase px-2 py-0.5 border border-current">
                      {alert.status}
                    </span>
                  </div>

                  {alert.status !== 'RESOLVED' && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'INVESTIGATING')}
                          className="px-2.5 py-1 border border-current hover:bg-[#B86F52] hover:text-white hover:border-[#B86F52] transition-colors"
                        >
                          INVESTIGATE
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                        className="px-2.5 py-1 bg-[#B86F52] text-white hover:bg-[#A35D42] transition-colors font-semibold"
                      >
                        RESOLVE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
