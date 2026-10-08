/**
 * AEGIS History
 * Answers: "What have I checked?"
 * Simple, legible log of previous verifications with search and filtering.
 */

import React, { useState } from 'react';
import { ScanResult, ScanInputType } from '../../types';
import { Search, Filter, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onClearHistory?: () => void;
}

export default function HistoryView({
  scans,
  onSelectScan,
  onClearHistory,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = scans.filter((s) => {
    const matchesType = filterType === 'ALL' || s.type === filterType;
    const matchesSearch =
      s.rawInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
            HISTORY
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#102A23] tracking-tight">
            What have you checked?
          </h1>
          <p className="text-sm text-[#557A68]">
            Complete ledger of your prior message, link, and payment verifications.
          </p>
        </div>

        {scans.length > 0 && onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-xs font-mono text-[#557A68] hover:text-[#102A23] transition-colors self-start sm:self-auto"
          >
            CLEAR HISTORY
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#557A68]/20 p-3 rounded-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#557A68] mr-1">TYPE:</span>
          {(['ALL', 'MESSAGE', 'URL', 'TRANSACTION', 'EMAIL', 'DOCUMENT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 text-xs font-mono tracking-wider transition-colors rounded-xs ${
                filterType === t
                  ? 'bg-[#102A23] text-white font-bold'
                  : 'text-[#557A68] hover:bg-[#EAE3D5]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-[#557A68] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5F1E8] border border-[#557A68]/25 rounded-xs text-xs font-mono text-[#102A23] placeholder-[#557A68]/50 focus:outline-none focus:border-[#102A23]"
          />
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFFFF] border border-[#557A68]/20 rounded-xs text-[#557A68] text-xs font-mono">
            No verification records match your query.
          </div>
        ) : (
          filtered.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleDateString([], {
              day: '2-digit',
              month: 'short',
            }).toUpperCase();

            const isHighOrCritical = item.riskScore >= 61;

            return (
              <div
                key={item.id}
                onClick={() => onSelectScan(item)}
                className="p-4 bg-[#FFFFFF] border border-[#557A68]/20 hover:border-[#102A23] transition-all flex items-center justify-between gap-4 cursor-pointer rounded-xs shadow-2xs group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="text-center w-12 shrink-0 border-r border-[#557A68]/20 pr-3">
                    <span className="text-xs font-mono font-bold text-[#102A23] block leading-tight">
                      {dateStr}
                    </span>
                    <span className="text-[10px] font-mono text-[#557A68] block">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#EAE3D5] text-[#102A23] rounded-xs">
                        {item.type}
                      </span>
                      <span className="text-xs font-semibold text-[#102A23] truncate">
                        {item.classification}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#557A68] truncate opacity-80">
                      "{item.rawInput}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-[#102A23] block">
                      {item.riskScore}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold uppercase block"
                      style={{
                        color: isHighOrCritical ? '#102A23' : '#557A68',
                      }}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#557A68] group-hover:text-[#102A23] transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
