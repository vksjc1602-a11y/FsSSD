/**
 * AEGIS Security & Privacy Center
 * Data minimization invariants, cryptographic posture, RBAC, and immutable audit logs.
 */

import React, { useState } from 'react';
import { INITIAL_AUDIT_LOGS } from '../../engine/threatStore';
import { AuditLogRecord, UserRole } from '../../types';
import { Shield, Lock, Key, EyeOff, FileText, CheckCircle2, UserCheck, Database } from 'lucide-react';

interface SecurityCenterProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function SecurityCenterView({ currentRole, onRoleChange }: SecurityCenterProps) {
  const [auditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [zeroRetention, setZeroRetention] = useState(true);
  const [piiAnonymization, setPiiAnonymization] = useState(true);
  const [autoPerimeterScan, setAutoPerimeterScan] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
            <span>GOVERNANCE & PRIVACY ARCHITECTURE</span>
            <span>·</span>
            <span>DATA MINIMIZATION INVARIANTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
            SECURITY & PRIVACY CENTER
          </h1>
          <p className="text-sm text-[#654536] mt-1 max-w-2xl">
            AEGIS enforces mathematical privacy guarantees: raw phone numbers are one-way hashed, bank accounts are masked, and scans execute ephemerally.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#654536]">ACTIVE RBAC ROLE:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="p-1.5 bg-[#FFFFFF] border border-[#654536]/30 font-bold text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
          >
            <option value="ANALYST">ANALYST</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
            <option value="INDIVIDUAL">INDIVIDUAL</option>
            <option value="FAMILY">FAMILY</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </div>
      </div>

      {/* Cryptographic Architecture Invariants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3A2418]">
            <Lock className="w-4 h-4 text-[#B86F52]" />
            <span>ENCRYPTION IN TRANSIT & AT REST</span>
          </div>
          <p className="text-xs text-[#654536]">
            All communications protected via TLS 1.3 with ChaCha20-Poly1305 / AES-256-GCM. Cryptographic keys rotated daily in secure KMS modules.
          </p>
          <div className="pt-2">
            <span className="inline-block px-2 py-0.5 bg-[#102A23] text-white text-[10px] font-mono font-bold tracking-wider">
              STATUS: STRICT COMPLIANCE
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3A2418]">
            <EyeOff className="w-4 h-4 text-[#B86F52]" />
            <span>DATA MINIMIZATION MANDATE</span>
          </div>
          <p className="text-xs text-[#654536]">
            AEGIS architecture structurally forbids storage of OTPs, ATM PINs, CVVs, or unhashed identification credentials. Scanned payloads expire ephemerally.
          </p>
          <div className="pt-2">
            <span className="inline-block px-2 py-0.5 bg-[#102A23] text-white text-[10px] font-mono font-bold tracking-wider">
              STATUS: ENFORCED AT GATEWAY
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3A2418]">
            <Key className="w-4 h-4 text-[#B86F52]" />
            <span>ONE-WAY PII TOKENIZATION</span>
          </div>
          <p className="text-xs text-[#654536]">
            Target phone numbers and accounts are converted to salted HMAC-SHA256 tokens before evaluating graph edge relationships.
          </p>
          <div className="pt-2">
            <span className="inline-block px-2 py-0.5 bg-[#102A23] text-white text-[10px] font-mono font-bold tracking-wider">
              STATUS: ZERO CLEAR-TEXT EXPOSURE
            </span>
          </div>
        </div>
      </div>

      {/* User Privacy & Permission Controls */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#3A2418] tracking-tight">
          DATA RESIDENCY & SCANNING PERMISSIONS
        </h2>

        <div className="divide-y divide-[#654536]/15">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#3A2418] block">
                ZERO-RETENTION VOLATILE SCANNING
              </span>
              <p className="text-xs text-[#654536] mt-0.5">
                Process verification requests in volatile memory; immediately purge raw input from server cache following verdict generation.
              </p>
            </div>
            <button
              onClick={() => setZeroRetention(!zeroRetention)}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
                zeroRetention ? 'bg-[#3A2418] text-white' : 'bg-[#E6D6C3] text-[#654536]'
              }`}
            >
              {zeroRetention ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#3A2418] block">
                AUTOMATED PERIMETER DEFENSE SYNDICATION
              </span>
              <p className="text-xs text-[#654536] mt-0.5">
                Allow AEGIS to autonomously broadcast verified IoC hashes to national financial intelligence nodes.
              </p>
            </div>
            <button
              onClick={() => setAutoPerimeterScan(!autoPerimeterScan)}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
                autoPerimeterScan ? 'bg-[#3A2418] text-white' : 'bg-[#E6D6C3] text-[#654536]'
              }`}
            >
              {autoPerimeterScan ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#3A2418] block">
                STRICT PII SANITIZATION & REDACTION
              </span>
              <p className="text-xs text-[#654536] mt-0.5">
                Mask account numbers (e.g. <code className="text-[#B86F52]">****4912</code>) and redact sender names prior to model feature extraction.
              </p>
            </div>
            <button
              onClick={() => setPiiAnonymization(!piiAnonymization)}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
                piiAnonymization ? 'bg-[#3A2418] text-white' : 'bg-[#E6D6C3] text-[#654536]'
              }`}
            >
              {piiAnonymization ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Immutable Security Audit Logs */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#654536]/15">
          <div>
            <h2 className="text-base font-semibold text-[#3A2418] tracking-tight">
              SECURITY AUDIT LOGS
            </h2>
            <p className="text-xs text-[#654536]">
              Immutable ledger of privileged model promotions, quarantine actions, and administrative interventions.
            </p>
          </div>
          <span className="text-xs font-mono text-[#654536]">CRYPTOGRAPHICALLY SIGNED</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#E6D6C3]/60 border-b border-[#654536]/20 text-[#654536] text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">LOG ID</th>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">ACTOR</th>
                <th className="py-2.5 px-3">ROLE</th>
                <th className="py-2.5 px-3">ACTION</th>
                <th className="py-2.5 px-3">RESOURCE</th>
                <th className="py-2.5 px-3">SIGNATURE HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#654536]/15 text-[#3A2418]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5EFE4]">
                  <td className="py-2.5 px-3 font-bold">{log.id}</td>
                  <td className="py-2.5 px-3 text-[#654536] text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-medium">{log.actor}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.2 bg-[#E6D6C3] text-[#3A2418] text-[10px]">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#B86F52]">{log.action}</td>
                  <td className="py-2.5 px-3 text-[#654536] truncate max-w-[160px]">{log.resource}</td>
                  <td className="py-2.5 px-3 text-[10px] text-[#654536] truncate max-w-[120px] font-mono">
                    {log.signatureHash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
