/**
 * AEGIS Admin & Internal Engineering Console
 * Secluded internal area for datasets, ML models, IoC registry, and audit logging.
 * Admin Navigation: OVERVIEW | DATASETS | MODELS | THREATS | SYSTEM | AUDIT
 */

import React, { useState } from 'react';
import DatasetLabView from '../dataset/DatasetLabView';
import ModelLabView from '../models/ModelLabView';
import ThreatsView from '../threats/ThreatsView';
import { INITIAL_AUDIT_LOGS } from '../../engine/threatStore';
import { Shield, Database, Cpu, ShieldAlert, Activity, FileText, ArrowLeft } from 'lucide-react';

interface AdminConsoleViewProps {
  onExitAdmin: () => void;
}

export default function AdminConsoleView({ onExitAdmin }: AdminConsoleViewProps) {
  const [adminTab, setAdminTab] = useState<'OVERVIEW' | 'DATASETS' | 'MODELS' | 'THREATS' | 'SYSTEM' | 'AUDIT'>('OVERVIEW');

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none py-2">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#557A68]/20 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="p-1.5 bg-[#FFFFFF] border border-[#557A68]/25 hover:bg-[#EAE3D5] text-[#102A23] rounded-xs transition-colors"
            title="Return to user interface"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#557A68]">
              <span className="font-bold text-[#102A23]">AEGIS INTERNAL</span>
              <span>/</span>
              <span>ADMINISTRATIVE CONSOLE</span>
            </div>
            <h1 className="text-xl font-semibold text-[#102A23]">
              ML Pipeline, Dataset Engineering & Security Audits
            </h1>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-[#102A23] text-white text-xs font-mono font-bold tracking-wider rounded-xs self-start sm:self-auto">
          ADMIN CLEARANCE: PRIVILEGED
        </span>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-[#557A68]/20 pb-3 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'OVERVIEW', icon: Activity },
          { id: 'DATASETS', label: 'DATASETS', icon: Database },
          { id: 'MODELS', label: 'MODELS', icon: Cpu },
          { id: 'THREATS', label: 'THREATS', icon: ShieldAlert },
          { id: 'SYSTEM', label: 'SYSTEM', icon: Shield },
          { id: 'AUDIT', label: 'AUDIT', icon: FileText },
        ].map((tab) => {
          const isCurrent = adminTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-wider uppercase transition-colors whitespace-nowrap rounded-xs flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-[#102A23] text-white'
                  : 'text-[#557A68] hover:bg-[#EAE3D5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {adminTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs space-y-1">
              <span className="text-xs font-mono text-[#557A68] uppercase">INGESTED CORPORA</span>
              <span className="text-2xl font-mono font-bold text-[#102A23] block">5 Datasets</span>
              <span className="text-xs text-[#557A68]">53,604 normalized records</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs space-y-1">
              <span className="text-xs font-mono text-[#557A68] uppercase">PRODUCTION MODELS</span>
              <span className="text-2xl font-mono font-bold text-[#102A23] block">4 Active</span>
              <span className="text-xs text-[#557A68]">Ensemble F1: 97.9%</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#557A68]/20 p-5 rounded-xs space-y-1">
              <span className="text-xs font-mono text-[#557A68] uppercase">CATALOGED IOCS</span>
              <span className="text-2xl font-mono font-bold text-[#102A23] block">1,482 Entities</span>
              <span className="text-xs text-[#557A68]">18 active scam campaigns</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-3">
            <h2 className="text-sm font-semibold text-[#102A23] uppercase font-mono">
              ENGINE PIPELINE INVARIANTS
            </h2>
            <p className="text-xs text-[#557A68] leading-relaxed">
              AEGIS trains multi-layer heuristics on Kaggle datasets (SMS spam, Phishing URLs, Credit Card Fraud, BEC Invoices) and standardizes them into canonical schemas. Models undergo rigorous benchmark evaluation before promotion.
            </p>
          </div>
        </div>
      )}

      {adminTab === 'DATASETS' && <DatasetLabView />}
      {adminTab === 'MODELS' && <ModelLabView />}
      {adminTab === 'THREATS' && <ThreatsView />}

      {adminTab === 'SYSTEM' && (
        <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4">
          <h2 className="text-sm font-semibold text-[#102A23] uppercase font-mono pb-2 border-b border-[#557A68]/15">
            INTERNAL SYSTEM HEALTH
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#F5F1E8] rounded-xs border border-[#557A68]/20">
              <span className="text-[#557A68] block">API GATEWAY</span>
              <span className="font-bold text-[#102A23]">ONLINE (18ms)</span>
            </div>
            <div className="p-3 bg-[#F5F1E8] rounded-xs border border-[#557A68]/20">
              <span className="text-[#557A68] block">ML ENSEMBLE</span>
              <span className="font-bold text-[#102A23]">ONLINE (v3.4.1)</span>
            </div>
            <div className="p-3 bg-[#F5F1E8] rounded-xs border border-[#557A68]/20">
              <span className="text-[#557A68] block">DATABASE VAULT</span>
              <span className="font-bold text-[#102A23]">ONLINE (Encrypted)</span>
            </div>
            <div className="p-3 bg-[#F5F1E8] rounded-xs border border-[#557A68]/20">
              <span className="text-[#557A68] block">THREAT FEED</span>
              <span className="font-bold text-[#102A23]">SYNCHRONIZED</span>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'AUDIT' && (
        <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4">
          <h2 className="text-sm font-semibold text-[#102A23] uppercase font-mono pb-2 border-b border-[#557A68]/15">
            SECURITY AUDIT LEDGER
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#EAE3D5] text-[#557A68] text-[10px] uppercase">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">TIME</th>
                  <th className="p-2">ACTOR</th>
                  <th className="p-2">ACTION</th>
                  <th className="p-2">RESOURCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#557A68]/15 text-[#102A23]">
                {INITIAL_AUDIT_LOGS.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2 font-bold">{l.id}</td>
                    <td className="p-2 text-[#557A68]">{l.timestamp}</td>
                    <td className="p-2">{l.actor}</td>
                    <td className="p-2 font-semibold text-[#102A23]">{l.action}</td>
                    <td className="p-2 text-[#557A68]">{l.resource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
