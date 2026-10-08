/**
 * AEGIS Transaction Risk Engine
 * Real-time payment stream analysis, behavioral anomaly detection, and merchant risk verification.
 */

import React, { useState } from 'react';
import { TransactionRecord } from '../../types';
import { INITIAL_TRANSACTIONS } from '../../engine/threatStore';
import { ShieldAlert, AlertTriangle, ArrowUpDown, Filter, CheckCircle2, XCircle, Search, PlusCircle } from 'lucide-react';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(transactions[0]);
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulator state
  const [simSender, setSimSender] = useState('AC-****5012 (User Personal)');
  const [simRecipient, setSimRecipient] = useState('MERCH-NEW-REGISTERED-44');
  const [simAmount, setSimAmount] = useState('75000');
  const [simChannel, setSimChannel] = useState<'UPI' | 'NEFT' | 'CARD' | 'WIRE'>('UPI');
  const [simDesc, setSimDesc] = useState('Instant KYC Verification Security Advance');
  const [showSimulator, setShowSimulator] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(simAmount) || 1000;
    
    // Heuristic anomaly calculation
    let anomaly = 15;
    let risk = 20;
    const flags: string[] = [];

    if (amt > 50000) {
      anomaly += 35;
      flags.push('Amount exceeds 90-day moving threshold');
    }
    if (simChannel === 'UPI' && amt > 25000) {
      anomaly += 25;
      risk += 20;
      flags.push('High-value UPI P2M velocity spike');
    }
    if (/kyc|advance|deposit|lottery|crypto|urgent/i.test(simDesc)) {
      risk += 45;
      flags.push('High-risk social engineering terminology in description');
    }
    if (simRecipient.toLowerCase().includes('new') || simRecipient.toLowerCase().includes('mule')) {
      risk += 30;
      flags.push('Recipient registered < 48 hours ago');
    }

    const finalRisk = Math.min(100, Math.max(10, risk));
    const finalAnomaly = Math.min(100, Math.max(10, anomaly));

    const newTxn: TransactionRecord = {
      id: `TXN-${Math.floor(90220 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      senderAccount: simSender,
      senderName: simSender.split(' ')[0],
      recipientAccount: simRecipient,
      recipientName: simRecipient,
      amount: amt,
      currency: 'INR',
      channel: simChannel,
      description: simDesc,
      anomalyScore: finalAnomaly,
      riskScore: finalRisk,
      severity: finalRisk >= 80 ? 'CRITICAL' : finalRisk >= 60 ? 'HIGH' : finalRisk >= 40 ? 'MODERATE' : 'LOW',
      status: finalRisk >= 80 ? 'BLOCKED' : finalRisk >= 60 ? 'QUARANTINED' : 'CLEARED',
      flags
    };

    setTransactions([newTxn, ...transactions]);
    setSelectedTxn(newTxn);
    setShowSimulator(false);
  };

  const filteredTxns = transactions.filter((t) => {
    const matchesChannel = filterChannel === 'ALL' || t.channel === filterChannel;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.recipientAccount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
            <span>TRANSACTION RISK ENGINE</span>
            <span>·</span>
            <span>BEHAVIORAL ANOMALY DETECTOR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
            FINANCIAL TRANSACTION STREAM
          </h1>
          <p className="text-sm text-[#654536] mt-1 max-w-2xl">
            Live evaluation of payment transfers, UPI requests, merchant counterparties, and settlement anomalies.
          </p>
        </div>

        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="px-4 py-2 text-xs font-mono font-medium tracking-wider uppercase text-white bg-[#3A2418] hover:bg-[#25170F] transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#B86F52]" />
          <span>SIMULATE TRANSACTION</span>
        </button>
      </div>

      {/* Simulator Drawer (Collapsible) */}
      {showSimulator && (
        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#654536]/15">
            <h2 className="text-xs font-mono font-bold text-[#3A2418] uppercase tracking-wider">
              INJECT SYNTHETIC TRANSACTION SCENARIO
            </h2>
            <button
              onClick={() => setShowSimulator(false)}
              className="text-xs font-mono text-[#654536] hover:text-[#3A2418]"
            >
              CANCEL
            </button>
          </div>

          <form onSubmit={handleSimulate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-[#654536] mb-1">SENDER ACCOUNT</label>
              <input
                type="text"
                value={simSender}
                onChange={(e) => setSimSender(e.target.value)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#654536] mb-1">RECIPIENT / MERCHANT</label>
              <input
                type="text"
                value={simRecipient}
                onChange={(e) => setSimRecipient(e.target.value)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#654536] mb-1">AMOUNT (INR)</label>
              <input
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#654536] mb-1">CHANNEL</label>
              <select
                value={simChannel}
                onChange={(e) => setSimChannel(e.target.value as any)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              >
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="CARD">CARD</option>
                <option value="WIRE">WIRE</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[#654536] mb-1">NARRATIVE / DESCRIPTION</label>
              <input
                type="text"
                value={simDesc}
                onChange={(e) => setSimDesc(e.target.value)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full p-2 text-center bg-[#B86F52] hover:bg-[#A35D42] text-white font-bold transition-colors"
              >
                EVALUATE RISK →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#654536]/25 p-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#654536]" />
          <span className="text-xs font-mono text-[#654536]">CHANNEL:</span>
          {(['ALL', 'UPI', 'CARD', 'WIRE', 'NEFT'] as const).map((chan) => (
            <button
              key={chan}
              onClick={() => setFilterChannel(chan)}
              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors ${
                filterChannel === chan
                  ? 'bg-[#3A2418] text-white'
                  : 'text-[#654536] hover:bg-[#E6D6C3]'
              }`}
            >
              {chan}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#654536] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search txn ID, recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5EFE4] border border-[#654536]/25 text-xs font-mono text-[#3A2418] placeholder-[#654536]/50 focus:outline-none focus:border-[#B86F52]"
          />
        </div>
      </div>

      {/* Main Terminal View: Data Table + Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table List (Left 8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#654536]/30 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#E6D6C3]/60 border-b border-[#654536]/20 text-[#654536] text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">TXN ID</th>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">RECIPIENT / COUNTERPARTY</th>
                <th className="py-2.5 px-3 text-right">AMOUNT</th>
                <th className="py-2.5 px-3">CHAN</th>
                <th className="py-2.5 px-3 text-right">RISK</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#654536]/15 text-[#3A2418]">
              {filteredTxns.map((txn) => {
                const isSelected = selectedTxn?.id === txn.id;
                const isCritical = txn.riskScore >= 80;
                return (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#E6D6C3]/80 font-medium'
                        : 'hover:bg-[#F5EFE4]'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-[#3A2418] whitespace-nowrap">
                      {txn.id}
                    </td>
                    <td className="py-3 px-3 text-[#654536] text-[11px] whitespace-nowrap">
                      {txn.timestamp.split(' ')[1]}
                    </td>
                    <td className="py-3 px-3 max-w-[180px] truncate" title={txn.recipientAccount}>
                      <span className="block text-[#3A2418] font-medium">{txn.recipientName}</span>
                      <span className="text-[10px] text-[#654536] block truncate">{txn.recipientAccount}</span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums whitespace-nowrap font-semibold">
                      {txn.currency} {txn.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 text-[10px] bg-[#E6D6C3] text-[#3A2418]">
                        {txn.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold">
                      <span style={{ color: isCritical ? '#B86F52' : '#3A2418' }}>
                        {txn.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor:
                            txn.status === 'BLOCKED'
                              ? '#3A2418'
                              : txn.status === 'QUARANTINED'
                              ? '#E6D6C3'
                              : '#102A23',
                          color:
                            txn.status === 'BLOCKED'
                              ? '#B86F52'
                              : txn.status === 'QUARANTINED'
                              ? '#3A2418'
                              : '#FFFFFF',
                        }}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Transaction Dossier (Right 4 cols) */}
        {selectedTxn && (
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
            <div className="pb-3 border-b border-[#654536]/20">
              <div className="flex items-center justify-between text-xs font-mono text-[#654536] mb-1">
                <span>INSPECTOR</span>
                <span>{selectedTxn.timestamp}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#3A2418]">
                {selectedTxn.id}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-mono font-bold text-[#3A2418]">
                  {selectedTxn.currency} {selectedTxn.amount.toLocaleString()}
                </span>
                <span className="text-xs font-mono px-1.5 py-0.5 bg-[#E6D6C3] text-[#3A2418]">
                  {selectedTxn.channel}
                </span>
              </div>
            </div>

            {/* Risk & Anomaly Bar */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F5EFE4] border border-[#654536]/15">
              <div>
                <span className="block text-[10px] font-mono text-[#654536] uppercase">
                  RISK SCORE
                </span>
                <span
                  className="text-2xl font-mono font-bold"
                  style={{
                    color: selectedTxn.riskScore >= 70 ? '#B86F52' : '#3A2418',
                  }}
                >
                  {selectedTxn.riskScore}/100
                </span>
                <span className="block text-[10px] font-mono font-semibold uppercase mt-0.5">
                  {selectedTxn.severity}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-[#654536] uppercase">
                  ANOMALY SCORE
                </span>
                <span className="text-2xl font-mono font-bold text-[#3A2418]">
                  {selectedTxn.anomalyScore}/100
                </span>
                <span className="block text-[10px] font-mono text-[#654536] mt-0.5">
                  ISOLATION FOREST
                </span>
              </div>
            </div>

            {/* Parties */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 border border-[#654536]/15 bg-[#F5EFE4]/40">
                <span className="text-[10px] text-[#654536] block">ORIGINATING SENDER</span>
                <span className="text-[#3A2418] font-bold">{selectedTxn.senderName}</span>
                <span className="text-[10px] text-[#654536] block">{selectedTxn.senderAccount}</span>
              </div>

              <div className="p-2 border border-[#654536]/15 bg-[#F5EFE4]/40">
                <span className="text-[10px] text-[#654536] block">DESTINATION BENEFICIARY</span>
                <span className="text-[#3A2418] font-bold">{selectedTxn.recipientName}</span>
                <span className="text-[10px] text-[#654536] block">{selectedTxn.recipientAccount}</span>
              </div>
            </div>

            {/* Narrative */}
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase block mb-1">
                TRANSACTION NARRATIVE
              </span>
              <p className="text-xs bg-[#F5EFE4] p-2.5 border border-[#654536]/15 font-mono text-[#3A2418]">
                "{selectedTxn.description}"
              </p>
            </div>

            {/* Triggered Flags */}
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase block mb-1">
                ENGINE INVARIANTS & FLAGS
              </span>
              <div className="space-y-1">
                {selectedTxn.flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-[#3A2418]">
                    <span className="text-[#B86F52] font-bold">!</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[#654536]/15 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-[#654536]">STATUS:</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      selectedTxn.status === 'BLOCKED'
                        ? '#3A2418'
                        : selectedTxn.status === 'QUARANTINED'
                        ? '#E6D6C3'
                        : '#102A23',
                    color:
                      selectedTxn.status === 'BLOCKED'
                        ? '#B86F52'
                        : selectedTxn.status === 'QUARANTINED'
                        ? '#3A2418'
                        : '#FFFFFF',
                  }}
                >
                  {selectedTxn.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const updated = transactions.map(t => t.id === selectedTxn.id ? { ...t, status: 'BLOCKED' as const } : t);
                    setTransactions(updated);
                    setSelectedTxn({ ...selectedTxn, status: 'BLOCKED' });
                  }}
                  className="px-2.5 py-1 text-xs font-mono bg-[#3A2418] text-[#B86F52] font-bold hover:bg-[#20130B]"
                >
                  HALT SETTLEMENT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
