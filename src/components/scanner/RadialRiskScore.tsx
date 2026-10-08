/**
 * AEGIS Radial Risk Architecture
 * Distinctive geometric concentric rings & radial factor indicators.
 * Strictly using Deep Brown (#3A2418), Brown (#654536), Terracotta (#B86F52), Beige (#E6D6C3), Cream (#F5EFE4), White (#FFFFFF).
 */

import React from 'react';
import { SeverityLevel } from '../../types';

interface RadialRiskScoreProps {
  score: number; // 0-100
  severity: SeverityLevel;
  confidence: number;
  componentScores: {
    nlp: number;
    url: number;
    behavior: number;
    anomaly: number;
    threat: number;
    pattern: number;
  };
  size?: number;
}

export default function RadialRiskScore({
  score,
  severity,
  confidence,
  componentScores,
  size = 340,
}: RadialRiskScoreProps) {
  const center = size / 2;
  const outerRadius = size * 0.44;
  const innerRadius = size * 0.28;
  const coreRadius = size * 0.21;

  const factors = [
    { key: 'NLP', name: 'NLP', value: componentScores.nlp, angle: 30 },
    { key: 'URL', name: 'URL', value: componentScores.url, angle: 90 },
    { key: 'BEHAVIOR', name: 'BEHAVIOR', value: componentScores.behavior, angle: 150 },
    { key: 'ANOMALY', name: 'ANOMALY', value: componentScores.anomaly, angle: 210 },
    { key: 'THREAT', name: 'THREAT', value: componentScores.threat, angle: 270 },
    { key: 'PATTERN', name: 'PATTERN', value: componentScores.pattern, angle: 330 },
  ];

  // Circumference for radial progress
  const circumference = 2 * Math.PI * outerRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Outer Boundary Dotted Track */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius + 8}
            fill="none"
            stroke="#E6D6C3"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Outer Ring Background */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="#E6D6C3"
            strokeWidth="3"
          />

          {/* Active Risk Arc */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke={score <= 20 ? '#102A23' : '#B86F52'}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-700 ease-out"
          />

          {/* Middle Concentric Ring (Structural Divider) */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="#654536"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Inner Core Enclosure */}
          <circle
            cx={center}
            cy={center}
            r={coreRadius}
            fill="#FFFFFF"
            stroke="#654536"
            strokeWidth="1.5"
          />

          {/* Factor Spokes & Nodes */}
          {factors.map((factor) => {
            const rad = (factor.angle * Math.PI) / 180;
            const x1 = center + innerRadius * Math.cos(rad);
            const y1 = center + innerRadius * Math.sin(rad);
            const x2 = center + (outerRadius - 6) * Math.cos(rad);
            const y2 = center + (outerRadius - 6) * Math.sin(rad);

            const isHigh = factor.value > 50;

            return (
              <g key={factor.key}>
                {/* Thin Geometric Spoke */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHigh ? '#B86F52' : '#654536'}
                  strokeWidth={isHigh ? '1.5' : '1'}
                  opacity={isHigh ? '0.9' : '0.35'}
                />

                {/* Concentric factor tick point */}
                <circle
                  cx={x2}
                  cy={y2}
                  r={isHigh ? 3.5 : 2.5}
                  fill={isHigh ? '#B86F52' : '#654536'}
                />
              </g>
            );
          })}

          {/* Center Coordinates & Reticle Crosshairs */}
          <line
            x1={center - 12}
            y1={center - coreRadius + 10}
            x2={center + 12}
            y2={center - coreRadius + 10}
            stroke="#654536"
            strokeWidth="0.75"
            opacity="0.4"
          />
          <line
            x1={center - 12}
            y1={center + coreRadius - 10}
            x2={center + 12}
            y2={center + coreRadius - 10}
            stroke="#654536"
            strokeWidth="0.75"
            opacity="0.4"
          />
        </svg>

        {/* Center Risk Score Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-[#654536] uppercase opacity-75 mb-0.5">
            RISK SCORE
          </span>
          <span className="text-4xl font-mono font-bold text-[#3A2418] tabular-nums leading-none">
            {score}
          </span>
          <span
            className="text-xs font-mono font-bold tracking-wider uppercase mt-1 px-2 py-0.5"
            style={{
              color: score > 60 ? '#B86F52' : score <= 20 ? '#102A23' : '#3A2418',
            }}
          >
            {severity}
          </span>
          <span className="text-[9px] font-mono text-[#654536] opacity-70 mt-0.5">
            {confidence}% CONF
          </span>
        </div>
      </div>

      {/* Surrounding Factors Grid */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-3 pt-3 border-t border-[#654536]/20">
        {factors.map((factor) => {
          const isElevated = factor.value > 50;
          return (
            <div
              key={factor.key}
              className="flex flex-col p-2 bg-[#E6D6C3]/60 border border-[#654536]/15 text-left"
            >
              <span className="text-[10px] font-mono text-[#654536] tracking-wider uppercase">
                {factor.name}
              </span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span
                  className="text-sm font-mono font-bold tabular-nums"
                  style={{ color: isElevated ? '#B86F52' : '#3A2418' }}
                >
                  {factor.value}
                </span>
                <span className="text-[9px] font-mono text-[#654536] opacity-70">
                  /100
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
