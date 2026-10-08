/**
 * AEGIS Vertical Navigation Sidebar
 * Strict 5-Item User Navigation:
 * 1. HOME
 * 2. SCAN
 * 3. ALERTS
 * 4. HISTORY
 * 5. PROTECTION
 * Bottom:
 * SETTINGS
 * PRIVACY
 * (Quiet Admin Console entry)
 */

import React from 'react';
import AegisLogo from '../common/AegisLogo';
import {
  Home,
  ScanLine,
  Bell,
  Clock,
  ShieldCheck,
  Settings,
  Lock,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  unreadAlertsCount?: number;
}

const PRIMARY_NAV = [
  { id: 'HOME', label: 'HOME', icon: Home },
  { id: 'SCAN', label: 'SCAN', icon: ScanLine },
  { id: 'ALERTS', label: 'ALERTS', icon: Bell, hasBadge: true },
  { id: 'HISTORY', label: 'HISTORY', icon: Clock },
  { id: 'PROTECTION', label: 'PROTECTION', icon: ShieldCheck },
];

export default function Sidebar({
  currentView,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  unreadAlertsCount = 2,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#102A23]/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#102A23] text-[#F5F1E8] flex flex-col border-r border-[#1F493B] transition-transform duration-200 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1F493B] flex items-center justify-between">
          <AegisLogo variant="light" size={28} showText={true} />
        </div>

        {/* Primary 5-Item Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {PRIMARY_NAV.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider transition-colors text-left rounded-xs ${
                  isActive
                    ? 'bg-[#1F493B] text-white font-bold'
                    : 'text-[#9BAF9F] hover:text-white hover:bg-[#1F493B]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#9BAF9F]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.hasBadge && unreadAlertsCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 font-mono font-bold rounded-xs ${
                      isActive ? 'bg-[#102A23] text-white' : 'bg-[#557A68] text-white'
                    }`}
                  >
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: SETTINGS & PRIVACY */}
        <div className="p-3 border-t border-[#1F493B] space-y-1 bg-[#0B1E19]">
          <button
            onClick={() => {
              onNavigate('SETTINGS');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wider transition-colors text-left rounded-xs ${
              currentView === 'SETTINGS'
                ? 'bg-[#1F493B] text-white font-bold'
                : 'text-[#9BAF9F] hover:text-white hover:bg-[#1F493B]/40'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() => {
              onNavigate('PRIVACY');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wider transition-colors text-left rounded-xs ${
              currentView === 'PRIVACY'
                ? 'bg-[#1F493B] text-white font-bold'
                : 'text-[#9BAF9F] hover:text-white hover:bg-[#1F493B]/40'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>PRIVACY</span>
          </button>

          {/* Quiet Administrative / Internal Link */}
          <div className="pt-2 border-t border-[#1F493B]/60">
            <button
              onClick={() => {
                onNavigate('ADMIN');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-mono tracking-wider text-[#9BAF9F]/70 hover:text-white transition-colors text-left ${
                currentView === 'ADMIN' ? 'text-white font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                <span>ADMIN CONSOLE</span>
              </div>
              <span className="text-[9px] px-1 bg-[#1F493B] rounded-2xs">DEV</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
