/**
 * AEGIS Settings
 * Minimal, purposeful settings.
 */

import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Shield, Bell, Lock, Link2, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onClearHistory: () => void;
}

export default function SettingsView({ currentRole, onRoleChange, onClearHistory }: SettingsViewProps) {
  const [criticalPush, setCriticalPush] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [autoPurgeHistory, setAutoPurgeHistory] = useState(false);
  const [messageCopiedNotice, setMessageCopiedNotice] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none py-2">
      {/* Editorial Title */}
      <div className="space-y-1">
        <span className="text-xs font-mono tracking-widest text-[#557A68] uppercase font-semibold">
          PREFERENCES
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#102A23] tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[#557A68]">
          Manage account security, incident notifications, and connected verification feeds.
        </p>
      </div>

      {/* Account & Profile */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#557A68]/15">
          <div>
            <h2 className="text-sm font-semibold text-[#102A23]">
              ACCOUNT & DEFENSE PROFILE
            </h2>
            <p className="text-xs text-[#557A68]">
              Primary protection posture configured for this terminal.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-[#EAE3D5] text-[#102A23] font-bold rounded-xs">
            {currentRole}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#557A68] block mb-1">PROTECTION PROFILE</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="w-full p-2.5 bg-[#F5F1E8] border border-[#557A68]/30 text-[#102A23] font-bold rounded-xs focus:outline-none focus:border-[#102A23]"
            >
              <option value="INDIVIDUAL">INDIVIDUAL (Personal)</option>
              <option value="FAMILY">FAMILY (Senior / Guarded)</option>
              <option value="BUSINESS">BUSINESS (Treasury / Invoices)</option>
              <option value="ANALYST">ANALYST (Investigative)</option>
              <option value="ENTERPRISE">ENTERPRISE (Gateway / Core)</option>
            </select>
          </div>

          <div>
            <span className="text-[#557A68] block mb-1">DATA RESIDENCY</span>
            <div className="p-2.5 bg-[#F5F1E8] border border-[#557A68]/20 text-[#102A23] rounded-xs">
              Local Vault · Ephemeral Cache Only
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4 shadow-xs">
        <h2 className="text-sm font-semibold text-[#102A23] pb-2 border-b border-[#557A68]/15">
          SECURITY
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#102A23] block">MFA / Cryptographic Authenticator</span>
              <span className="text-[#557A68]">Hardware security keys & biometric passkeys verified.</span>
            </div>
            <span className="text-xs font-mono text-[#102A23] font-bold">ENABLED</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#557A68]/10">
            <div>
              <span className="font-semibold text-[#102A23] block">Zero-Retention Volatile Scanning</span>
              <span className="text-[#557A68]">Purge all scanned text from memory upon verdict generation.</span>
            </div>
            <span className="text-xs font-mono text-[#102A23] font-bold">ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4 shadow-xs">
        <h2 className="text-sm font-semibold text-[#102A23] pb-2 border-b border-[#557A68]/15">
          NOTIFICATIONS
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#102A23] block">Critical Threat Push Alerts</span>
              <span className="text-[#557A68]">Immediate alerts when active phishing links are detected in SMS.</span>
            </div>
            <button
              onClick={() => setCriticalPush(!criticalPush)}
              className={`px-3 py-1 font-mono text-xs font-bold rounded-xs transition-colors ${
                criticalPush ? 'bg-[#102A23] text-white' : 'bg-[#EAE3D5] text-[#557A68]'
              }`}
            >
              {criticalPush ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#557A68]/10">
            <div>
              <span className="font-semibold text-[#102A23] block">Weekly Security Summary</span>
              <span className="text-[#557A68]">Quiet weekly digest of blocked attempts.</span>
            </div>
            <button
              onClick={() => setEmailDigest(!emailDigest)}
              className={`px-3 py-1 font-mono text-xs font-bold rounded-xs transition-colors ${
                emailDigest ? 'bg-[#102A23] text-white' : 'bg-[#EAE3D5] text-[#557A68]'
              }`}
            >
              {emailDigest ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Controls */}
      <div className="bg-[#FFFFFF] border border-[#557A68]/25 p-6 rounded-xs space-y-4 shadow-xs">
        <h2 className="text-sm font-semibold text-[#102A23] pb-2 border-b border-[#557A68]/15">
          PRIVACY & LOCAL DATA
        </h2>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-[#102A23] block">Clear Local Scan History</span>
            <span className="text-[#557A68]">Erase all previous verification logs from this device.</span>
          </div>
          <button
            onClick={() => {
              onClearHistory();
              setMessageCopiedNotice(true);
              setTimeout(() => setMessageCopiedNotice(false), 2000);
            }}
            className="px-3.5 py-1.5 font-mono text-xs border border-[#557A68]/30 hover:bg-[#102A23] hover:text-white transition-colors rounded-xs"
          >
            {messageCopiedNotice ? 'CLEARED' : 'CLEAR NOW'}
          </button>
        </div>
      </div>
    </div>
  );
}
