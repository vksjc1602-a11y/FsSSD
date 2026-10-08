/**
 * AEGIS Fraud Network Graph
 * Intelligence map of financial entities, criminal campaign clusters, and money-flow relationships.
 * Strictly adheres to Deep Brown (#3A2418), Brown (#654536), Terracotta (#B86F52), Cream (#F5EFE4), Beige (#E6D6C3).
 */

import React, { useState } from 'react';
import { INITIAL_NETWORK_NODES, INITIAL_NETWORK_EDGES } from '../../engine/threatStore';
import { NetworkNode, NetworkEdge } from '../../types';
import { Filter, Search, RotateCcw, ShieldAlert, ArrowRight } from 'lucide-react';

export default function NetworkGraphView() {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [edges] = useState<NetworkEdge[]>(INITIAL_NETWORK_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-campaign-1');
  const [filterType, setFilterType] = useState<string>('ALL');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Connected edges and neighbor nodes
  const connectedEdges = edges.filter(
    (e) => e.source === selectedNodeId || e.target === selectedNodeId
  );
  const neighborNodeIds = new Set(
    connectedEdges.flatMap((e) => [e.source, e.target])
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
          <span>GRAPH INTELLIGENCE ENGINE</span>
          <span>·</span>
          <span>ENTITY DISCOVERY & LINK ANALYSIS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
          FRAUD CAMPAIGN NETWORK TOPOLOGY
        </h1>
        <p className="text-sm text-[#654536] mt-1 max-w-2xl">
          Visualizing relational topologies between spoofed websites, mule bank accounts, command infrastructure, and target consumers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#654536]/25 p-3 flex-wrap">
        <span className="text-xs font-mono text-[#654536]">HIGHLIGHT TYPE:</span>
        {(['ALL', 'CAMPAIGN', 'DOMAIN', 'MERCHANT', 'WALLET', 'TRANSACTION', 'PHONE', 'IP'] as const).map((type) => (
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

      {/* Main Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Network Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#F5EFE4] border border-[#654536]/30 p-4 relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#654536] mb-2 px-2">
            <span>CANVAS: ACTIVE CLUSTER (PHANTOM KYC)</span>
            <span>CLICK NODE TO INSPECT TRAIL</span>
          </div>

          <svg
            className="w-full h-[480px] bg-[#F5EFE4] border border-[#654536]/15"
            viewBox="0 0 860 420"
          >
            {/* Background grid reticle */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E6D6C3" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="860" height="420" fill="url(#grid)" />

            {/* Edge lines */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.source);
              const tgt = nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isDirectlyConnected =
                edge.source === selectedNodeId || edge.target === selectedNodeId;

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isDirectlyConnected ? '#B86F52' : '#654536'}
                    strokeWidth={isDirectlyConnected ? '2' : '1'}
                    strokeDasharray={edge.relation === 'routed_via' ? '3 3' : 'none'}
                    opacity={isDirectlyConnected ? '0.9' : '0.25'}
                  />
                  {/* Subtle relation text on active link */}
                  {isDirectlyConnected && (
                    <text
                      x={((src.x || 0) + (tgt.x || 0)) / 2}
                      y={((src.y || 0) + (tgt.y || 0)) / 2 - 4}
                      fill="#654536"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                      className="opacity-75"
                    >
                      {edge.relation}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Node markers */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isNeighbor = neighborNodeIds.has(node.id);
              const matchesFilter = filterType === 'ALL' || node.type === filterType;
              const isHighRisk = node.riskScore >= 80;
              const isCleared = node.riskScore <= 20;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  {/* Selected halo */}
                  {isSelected && (
                    <circle
                      r="22"
                      fill="none"
                      stroke="#B86F52"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Main Node Disc */}
                  <circle
                    r={isSelected ? 15 : isHighRisk ? 13 : 10}
                    fill={
                      isSelected
                        ? '#B86F52'
                        : isHighRisk
                        ? '#3A2418'
                        : isCleared
                        ? '#102A23'
                        : '#E6D6C3'
                    }
                    stroke={isSelected ? '#FFFFFF' : '#654536'}
                    strokeWidth={isSelected ? '2' : '1.5'}
                    opacity={matchesFilter ? 1 : 0.3}
                  />

                  {/* Risk Score indicator inside */}
                  <text
                    y="3"
                    textAnchor="middle"
                    fill={isSelected || isHighRisk || isCleared ? '#FFFFFF' : '#3A2418'}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {node.riskScore}
                  </text>

                  {/* Label */}
                  <text
                    y={isSelected ? 26 : 22}
                    textAnchor="middle"
                    fill="#3A2418"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {node.label}
                  </text>

                  <text
                    y={isSelected ? 36 : 32}
                    textAnchor="middle"
                    fill="#654536"
                    fontSize="8"
                    fontFamily="JetBrains Mono"
                    className="opacity-80"
                  >
                    [{node.type}]
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map legend */}
          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-[#654536] mt-3 pt-2 border-t border-[#654536]/15">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#B86F52]" /> SELECTED NODE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#3A2418]" /> CRITICAL RISK (≥80)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#102A23]" /> AUTHENTICATED (≤20)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#E6D6C3] border border-[#654536]" /> RECEPTIVE NODE
              </span>
            </div>
            <span>TOTAL NODES: {nodes.length} · EDGES: {edges.length}</span>
          </div>
        </div>

        {/* Node Inspector Dossier (4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
          <div className="pb-3 border-b border-[#654536]/20">
            <div className="flex items-center justify-between text-xs font-mono text-[#654536] mb-1">
              <span>NODE INSPECTION</span>
              <span>#{selectedNode.id}</span>
            </div>
            <h2 className="text-lg font-semibold text-[#3A2418]">
              {selectedNode.label}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono px-2 py-0.5 bg-[#3A2418] text-white">
                {selectedNode.type}
              </span>
              <span className="text-xs font-mono font-bold text-[#B86F52]">
                RISK: {selectedNode.riskScore}/100
              </span>
            </div>
          </div>

          {/* Connected Relationships */}
          <div>
            <h3 className="text-xs font-mono text-[#654536] uppercase tracking-wider mb-2">
              CONNECTED RELATIONSHIPS ({connectedEdges.length})
            </h3>
            <div className="space-y-2">
              {connectedEdges.map((e) => {
                const otherId = e.source === selectedNodeId ? e.target : e.source;
                const otherNode = nodes.find((n) => n.id === otherId);
                const isOutbound = e.source === selectedNodeId;

                return (
                  <div
                    key={e.id}
                    onClick={() => otherNode && setSelectedNodeId(otherNode.id)}
                    className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15 hover:border-[#B86F52] cursor-pointer transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#654536] mb-1">
                      <span>{isOutbound ? 'OUTBOUND' : 'INBOUND'}</span>
                      <span className="text-[#B86F52] font-semibold">{e.relation}</span>
                    </div>
                    <div className="font-semibold text-[#3A2418] flex items-center justify-between">
                      <span>{otherNode?.label}</span>
                      <span className="text-[10px] text-[#654536]">[{otherNode?.type}]</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Containment Protocol */}
          <div className="p-3 bg-[#E6D6C3]/60 border border-[#654536]/25 space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#3A2418] uppercase tracking-wider block">
              GRAPH ISOLATION PROTOCOL
            </span>
            <p className="text-xs text-[#3A2418]">
              Flagging this node propagates transitive risk to connected financial accounts and URLs within 2 network hops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
