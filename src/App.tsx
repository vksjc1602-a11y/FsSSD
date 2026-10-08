/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import HomeView from './components/home/HomeView';
import ScanView from './components/scan/ScanView';
import RiskResultView from './components/scan/RiskResultView';
import UserAlertsView from './components/alerts/UserAlertsView';
import HistoryView from './components/history/HistoryView';
import ProtectionView from './components/protection/ProtectionView';
import SettingsView from './components/settings/SettingsView';
import PrivacyView from './components/privacy/PrivacyView';
import AdminConsoleView from './components/admin/AdminConsoleView';
import LandingPageView from './components/landing/LandingPageView';
import { ScanInputType, ScanResult, AlertRecord, UserRole } from './types';
import { INITIAL_ALERTS } from './engine/threatStore';
import { analyzeMessageOrInput } from './engine/riskEngine';

// Seed initial history records
const SEED_HISTORY: ScanResult[] = [
  analyzeMessageOrInput('Your SBI netbanking access is blocked today. Verify KYC immediately at: http://sbi-kyc-verify.top/auth', 'MESSAGE'),
  analyzeMessageOrInput('https://security-login-sbi-portal.xyz/auth?session=unclaimed_parcel_fee', 'URL'),
  analyzeMessageOrInput('Your salary account was credited with INR 78,500 on 05-OCT-2026. Ref UPI/49219482.', 'MESSAGE'),
  analyzeMessageOrInput('Subject: URGENT: Revised Wire Settlement for Q3. Disburse invoice to new account IBAN GB49BARC2091.', 'EMAIL')
];

export default function App() {
  const [currentView, setCurrentView] = useState<string>('HOME');
  const [currentRole, setCurrentRole] = useState<UserRole>('INDIVIDUAL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scan & History State
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(SEED_HISTORY);
  const [scanPrefilledType, setScanPrefilledType] = useState<ScanInputType>('MESSAGE');
  const [selectedScanDetail, setSelectedScanDetail] = useState<ScanResult | null>(null);

  // Alerts State
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_ALERTS);

  const handleStartQuickScan = (type: ScanInputType) => {
    setScanPrefilledType(type);
    setSelectedScanDetail(null);
    setCurrentView('SCAN');
  };

  const handleSaveResultToHistory = (result: ScanResult) => {
    setScanHistory([result, ...scanHistory]);
  };

  const handleSelectHistoryItem = (scan: ScanResult) => {
    setSelectedScanDetail(scan);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    setSelectedScanDetail(null);
  };

  // Dedicated Landing Page
  if (currentView === 'LANDING') {
    return (
      <LandingPageView
        onEnterPlatform={(targetView) => setCurrentView(targetView || 'HOME')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#102A23] flex flex-col antialiased">
      {/* 5-Item User Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedScanDetail(null);
          setCurrentView(view);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        unreadAlertsCount={alerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH').length}
      />

      {/* Main Content Viewport (offset by 240px on lg screens) */}
      <div className="lg:pl-60 flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <Navbar
          currentView={currentView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickScan={() => handleStartQuickScan('MESSAGE')}
        />

        {/* Viewport Canvas */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Detail View for a selected History/Scan Item */}
          {selectedScanDetail ? (
            <RiskResultView
              result={selectedScanDetail}
              onScanAnother={() => {
                setSelectedScanDetail(null);
                setCurrentView('SCAN');
              }}
            />
          ) : (
            <>
              {currentView === 'HOME' && (
                <HomeView
                  onStartScan={handleStartQuickScan}
                  onNavigate={setCurrentView}
                  onSelectAlert={(alertId) => {
                    setCurrentView('ALERTS');
                  }}
                  recentScans={scanHistory}
                  alerts={alerts}
                />
              )}

              {currentView === 'SCAN' && (
                <ScanView
                  initialType={scanPrefilledType}
                  onSaveResultToHistory={handleSaveResultToHistory}
                />
              )}

              {currentView === 'ALERTS' && (
                <UserAlertsView
                  alerts={alerts}
                  onDismissAlert={handleDismissAlert}
                  onViewScanDetail={() => {}}
                />
              )}

              {currentView === 'HISTORY' && (
                <HistoryView
                  scans={scanHistory}
                  onSelectScan={handleSelectHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              )}

              {currentView === 'PROTECTION' && <ProtectionView />}

              {currentView === 'SETTINGS' && (
                <SettingsView
                  currentRole={currentRole}
                  onRoleChange={setCurrentRole}
                  onClearHistory={handleClearHistory}
                />
              )}

              {currentView === 'PRIVACY' && <PrivacyView />}

              {currentView === 'ADMIN' && (
                <AdminConsoleView
                  onExitAdmin={() => setCurrentView('HOME')}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
