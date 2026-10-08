/**
 * AEGIS Top Bar Layout
 * Adheres to 3-Zone Top Bar Contract with clean breadcrumb & quick scan action.
 */

import React from 'react';
import { Menu, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onOpenMobileMenu: () => void;
  onQuickScan: () => void;
}

export default function Navbar({ currentView, onOpenMobileMenu, onQuickScan }: NavbarProps) {
  const viewTitles: Record<string, string> = {
    HOME: 'SECURITY OVERVIEW',
    SCAN: 'VERIFICATION SCANNER',
    ALERTS: 'SECURITY ALERTS',
    HISTORY: 'VERIFICATION HISTORY',
    PROTECTION: 'AUTOMATIC PROTECTION',
    SETTINGS: 'SETTINGS',
    PRIVACY: 'PRIVACY ARCHITECTURE',
    ADMIN: 'ADMINISTRATIVE CONSOLE'
  };

  return (
    <header className="h-14 border-b border-[#557A68]/20 bg-[#F5F1E8] px-4 md:px-6 flex items-center justify-between select-none shrink-0 sticky top-0 z-30">
      {/* Zone 1: Breadcrumbs & Mobile trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 text-[#102A23] hover:bg-[#EAE3D5] transition-colors rounded-xs"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#557A68]">
          <span className="font-bold text-[#102A23]">AEGIS</span>
          <span>/</span>
          <span className="text-[#102A23] font-medium tracking-wider">
            {viewTitles[currentView] || currentView}
          </span>
        </div>
      </div>

      {/* Zone 2: Real-time System Telemetry Marker */}
      <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-[#102A23]">
          <span className="w-2 h-2 rounded-full bg-[#102A23] animate-pulse" />
          <span>STATUS:</span>
          <span className="font-bold text-[#102A23]">PROTECTED</span>
        </span>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-3">
        {currentView !== 'SCAN' && (
          <button
            onClick={onQuickScan}
            className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase text-white bg-[#102A23] hover:bg-[#1F493B] transition-colors rounded-xs flex items-center gap-1.5 shadow-2xs"
          >
            <span>SCAN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
