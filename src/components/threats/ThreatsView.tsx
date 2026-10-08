/**
 * AEGIS Threat Intelligence
 * Adversarial scam campaigns, indicators of compromise (IoCs), and criminal syndicate tracking.
 */

import React, { useState } from 'react';
import { THREAT_INTELLIGENCE_ENTITIES } from '../../engine/threatStore';
import { ThreatEntity } from '../../types';
import { ShieldAlert, Globe, Phone, Mail, ShoppingBag, Wallet, Tag, ExternalLink, Search, Filter } from 'lucide-react';

export default function ThreatsView() {
  const [entities, setEntities] = useState<ThreatEntity[]>(THREAT_INTELLIGENCE_ENTITIES);
  const [selectedEntity, setSelectedEntity] = useState<ThreatEntity | null>(entities[0]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = entities.filter((e) => {
    const matchesType = filterType === 'ALL' || e.type === filterType;
    const matchesSearch =
      e.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.associatedCampaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
          <span>THREAT INTELLIGENCE REPOSITORY</span>
          <span>·</span>
          <span>IOC TELEMETRY & CAMPAIGN REGISTRY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
          ADVERSARIAL ENTITY DOSSIERS
        </h1>
        <p className="text-sm text-[#654536] mt-1 max-w-2xl">
          Cataloged infrastructure, payment gateways, mule wallets, and deceptive nodes identified across global financial investigations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#654536]/25 p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#654536] mr-1">ENTITY TYPE:</span>
          {(['ALL', 'CAMPAIGN', 'DOMAIN', 'PHONE', 'MERCHANT', 'WALLET', 'EMAIL'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-colors ${
                filterType === type
                  ? 'bg-[#3A2418] text-white'
                  : 'text-[#654536] hover:bg-[#E6D6C3]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#654536] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search indicator, campaign, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5EFE4] border border-[#654536]/25 text-xs font-mono text-[#3A2418] placeholder-[#654536]/50 focus:outline-none focus:border-[#B86F52]"
          />
        </div>
      </div>

      {/* Threat Entities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* List (8 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#654536]/30 divide-y divide-[#654536]/15">
          {filteredEntities.map((item) => {
            const isSelected = selectedEntity?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedEntity(item)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#E6D6C3]/75' : 'hover:bg-[#F5EFE4]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#3A2418]">
                      #{item.id.replace('THREAT-ENT-', 'AE-')}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#3A2418] text-white">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#B86F52]">
                      SCORE {item.reputationScore}/100
                    </span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-[#3A2418] mb-1">
                  {item.value}
                </div>

                <div className="text-xs font-mono text-[#654536] mb-2">
                  Campaign: <span className="text-[#3A2418]">{item.associatedCampaign}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#654536]/10 text-[10px] font-mono text-[#654536]">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t) => (
                      <span key={t} className="border border-[#654536]/20 px-1 py-0.2 bg-[#F5EFE4]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span>{item.reportsCount} confirmed reports</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dossier Inspector (5 cols) */}
        {selectedEntity && (
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
            <div className="pb-3 border-b border-[#654536]/20">
              <div className="flex items-center justify-between text-xs font-mono text-[#654536] mb-1">
                <span>INDICATOR DOSSIER</span>
                <span>#{selectedEntity.id}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#3A2418]">
                {selectedEntity.value}
              </h2>
              <span className="inline-block mt-1 text-xs font-mono px-2 py-0.5 bg-[#E6D6C3] text-[#3A2418]">
                {selectedEntity.type} IDENTIFIER
              </span>
            </div>

            {/* Impact Metric Card */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F5EFE4] border border-[#654536]/15">
              <div>
                <span className="block text-[10px] font-mono text-[#654536] uppercase">
                  MALICE CONFIDENCE
                </span>
                <span className="text-2xl font-mono font-bold text-[#B86F52]">
                  {selectedEntity.reputationScore}%
                </span>
                <span className="block text-[10px] font-mono text-[#654536] mt-0.5">
                  CRITICAL THREAT
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-[#654536] uppercase">
                  ESTIMATED IMPACT
                </span>
                <span className="text-2xl font-mono font-bold text-[#3A2418]">
                  ${(selectedEntity.financialImpactEstimateUsd / 1000).toLocaleString()}k
                </span>
                <span className="block text-[10px] font-mono text-[#654536] mt-0.5">
                  FINANCIAL LOSS
                </span>
              </div>
            </div>

            {/* Campaign Association */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#654536] uppercase block">
                ASSOCIATED SCAM CAMPAIGN
              </span>
              <div className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15 font-mono text-xs text-[#3A2418]">
                {selectedEntity.associatedCampaign}
              </div>
            </div>

            {/* Timeline info */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 border border-[#654536]/15 bg-[#F5EFE4]/30">
                <span className="text-[10px] text-[#654536] block">FIRST TELEMETRY</span>
                <span className="text-[#3A2418]">{selectedEntity.firstSeen}</span>
              </div>
              <div className="p-2 border border-[#654536]/15 bg-[#F5EFE4]/30">
                <span className="text-[10px] text-[#654536] block">LAST ACTIVITY</span>
                <span className="text-[#3A2418]">{selectedEntity.lastSeen}</span>
              </div>
            </div>

            {/* Tactics & Signatures */}
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase block mb-1">
                TACTICS, TECHNIQUES & PROCEDURES (TTPS)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEntity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[11px] font-mono bg-[#E6D6C3] text-[#3A2418] border border-[#654536]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Containment Protocols */}
            <div className="p-3 bg-[#E6D6C3]/60 border border-[#654536]/25 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#3A2418] uppercase tracking-wider block">
                DEFENSIVE ACTIONS IN EFFECT
              </span>
              <ul className="text-xs text-[#3A2418] space-y-1 list-disc list-inside">
                <li>Automated perimeter boundary DNS blackhole applied</li>
                <li>Financial routing settlement quarantine triggered</li>
                <li>Notification dispatched to telecommunications gateway</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
