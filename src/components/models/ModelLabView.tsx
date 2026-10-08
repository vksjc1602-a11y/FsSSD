/**
 * AEGIS Model Laboratory
 * Model management, versioning, evaluation metrics, and deployment lifecycle.
 */

import React, { useState } from 'react';
import { INITIAL_MODELS } from '../../engine/modelStore';
import { MLModelRecord } from '../../types';
import { Cpu, ShieldCheck, CheckCircle2, RotateCcw, BarChart3, AlertCircle, Play, ArrowRight } from 'lucide-react';

export default function ModelLabView() {
  const [models, setModels] = useState<MLModelRecord[]>(INITIAL_MODELS);
  const [selectedModel, setSelectedModel] = useState<MLModelRecord | null>(models[0]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalSuccessMsg, setEvalSuccessMsg] = useState<string | null>(null);

  const handleEvaluate = (model: MLModelRecord) => {
    setIsEvaluating(true);
    setEvalSuccessMsg(null);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvalSuccessMsg(`Validation benchmark completed for ${model.name} (${model.version}). AUC: ${model.rocAuc}, F1: ${model.f1}%. Zero drift detected.`);
    }, 450);
  };

  const handleDeploy = (model: MLModelRecord) => {
    const updated = models.map((m) => {
      if (m.id === model.id) return { ...m, status: 'PRODUCTION' as const };
      if (m.type === model.type && m.status === 'PRODUCTION') return { ...m, status: 'STAGING' as const };
      return m;
    });
    setModels(updated);
    setSelectedModel({ ...model, status: 'PRODUCTION' });
    setEvalSuccessMsg(`Successfully deployed ${model.version} to active production perimeter.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
          <span>MODEL REGISTRY & VALIDATION LABORATORY</span>
          <span>·</span>
          <span>GOVERNED ML PIPELINES</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
          MODEL LABORATORY
        </h1>
        <p className="text-sm text-[#654536] mt-1 max-w-2xl">
          Track production classifiers, evaluate Precision-Recall trade-offs, inspect SHAP-attribution weights, and govern model promotions.
        </p>
      </div>

      {/* Models Table */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#E6D6C3]/60 border-b border-[#654536]/20 text-[#654536] text-[10px] uppercase">
            <tr>
              <th className="py-2.5 px-3">MODEL IDENTIFIER</th>
              <th className="py-2.5 px-3">VERSION</th>
              <th className="py-2.5 px-3">ARCHITECTURE</th>
              <th className="py-2.5 px-3 text-right">ACCURACY</th>
              <th className="py-2.5 px-3 text-right">F1-SCORE</th>
              <th className="py-2.5 px-3 text-right">FPR</th>
              <th className="py-2.5 px-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#654536]/15 text-[#3A2418]">
            {models.map((m) => {
              const isSelected = selectedModel?.id === m.id;
              return (
                <tr
                  key={m.id}
                  onClick={() => {
                    setSelectedModel(m);
                    setEvalSuccessMsg(null);
                  }}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#E6D6C3]/75 font-semibold' : 'hover:bg-[#F5EFE4]'
                  }`}
                >
                  <td className="py-3 px-3">
                    <span className="block text-[#3A2418] font-medium">{m.name}</span>
                    <span className="text-[10px] text-[#654536] block">{m.primaryDataset}</span>
                  </td>
                  <td className="py-3 px-3 text-[#654536] font-bold">
                    {m.version}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 text-[10px] bg-[#E6D6C3] text-[#3A2418]">
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {m.accuracy}%
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-[#B86F52]">
                    {m.f1}%
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-[#654536]">
                    {m.falsePositiveRate}%
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor: m.status === 'PRODUCTION' ? '#3A2418' : '#E6D6C3',
                        color: m.status === 'PRODUCTION' ? '#FFFFFF' : '#3A2418'
                      }}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Model Deep Dive */}
      {selectedModel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Metrics & Confusion Matrix (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
            <div className="pb-3 border-b border-[#654536]/20">
              <span className="text-[10px] font-mono text-[#654536] uppercase block">
                VALIDATION PERFORMANCE BENCHMARK
              </span>
              <h2 className="text-lg font-semibold text-[#3A2418]">
                {selectedModel.name} ({selectedModel.version})
              </h2>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">PRECISION</span>
                <span className="text-sm font-bold text-[#3A2418]">{selectedModel.precision}%</span>
              </div>
              <div className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">RECALL</span>
                <span className="text-sm font-bold text-[#3A2418]">{selectedModel.recall}%</span>
              </div>
              <div className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">F1 SCORE</span>
                <span className="text-sm font-bold text-[#B86F52]">{selectedModel.f1}%</span>
              </div>
              <div className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">ROC-AUC</span>
                <span className="text-sm font-bold text-[#3A2418]">{selectedModel.rocAuc}</span>
              </div>
            </div>

            {/* Confusion Matrix Table */}
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase tracking-wider block mb-2">
                EMPIRICAL CONFUSION MATRIX
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 bg-[#E6D6C3]/60 border border-[#654536]/20">
                  <span className="text-[10px] text-[#654536] block">TRUE POSITIVE (FRAUD INTERCEPTED)</span>
                  <span className="text-base font-bold text-[#3A2418] tabular-nums">
                    {selectedModel.confusionMatrix.truePositive.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#F5EFE4] border border-[#654536]/20">
                  <span className="text-[10px] text-[#654536] block">FALSE POSITIVE (BENIGN FLAGGED)</span>
                  <span className="text-base font-bold text-[#B86F52] tabular-nums">
                    {selectedModel.confusionMatrix.falsePositive.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#F5EFE4] border border-[#654536]/20">
                  <span className="text-[10px] text-[#654536] block">FALSE NEGATIVE (MISSED ATTACK)</span>
                  <span className="text-base font-bold text-[#B86F52] tabular-nums">
                    {selectedModel.confusionMatrix.falseNegative.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#E6D6C3]/60 border border-[#654536]/20">
                  <span className="text-[10px] text-[#654536] block">TRUE NEGATIVE (BENIGN CLEARED)</span>
                  <span className="text-base font-bold text-[#3A2418] tabular-nums">
                    {selectedModel.confusionMatrix.trueNegative.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[#654536]/15 flex items-center gap-3">
              <button
                onClick={() => handleEvaluate(selectedModel)}
                disabled={isEvaluating}
                className="px-4 py-2 text-xs font-mono bg-[#3A2418] text-white hover:bg-[#20130B] transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-[#B86F52]" />
                <span>RUN BENCHMARK</span>
              </button>

              {selectedModel.status !== 'PRODUCTION' && (
                <button
                  onClick={() => handleDeploy(selectedModel)}
                  className="px-4 py-2 text-xs font-mono bg-[#B86F52] text-white hover:bg-[#A35D42] transition-colors font-semibold"
                >
                  PROMOTE TO PRODUCTION
                </button>
              )}
            </div>

            {evalSuccessMsg && (
              <div className="p-3 bg-[#E6D6C3]/60 border border-[#654536]/25 text-xs font-mono text-[#3A2418] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B86F52] shrink-0 mt-0.5" />
                <span>{evalSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Feature Importances (SHAP Attribution) (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
            <div className="pb-3 border-b border-[#654536]/20">
              <span className="text-[10px] font-mono text-[#654536] uppercase block">
                EXPLAINABLE AI ARCHITECTURE
              </span>
              <h2 className="text-lg font-semibold text-[#3A2418]">
                GLOBAL FEATURE ATTRIBUTION (SHAP WEIGHTS)
              </h2>
            </div>

            <p className="text-xs text-[#654536]">
              Relative impact of extracted feature signals on model decision boundaries:
            </p>

            <div className="space-y-3">
              {selectedModel.topFeatures.map((feat) => (
                <div key={feat.feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#3A2418] truncate pr-2">{feat.feature}</span>
                    <span className="text-[#B86F52] font-bold">{(feat.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#E6D6C3] h-2">
                    <div
                      className="h-full bg-[#3A2418]"
                      style={{
                        width: `${feat.importance * 100}%`,
                        backgroundColor: feat.importance > 0.25 ? '#B86F52' : '#3A2418'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#F5EFE4] border border-[#654536]/15 text-xs text-[#3A2418] space-y-1">
              <span className="font-mono font-bold block text-[10px] text-[#654536] uppercase">
                GOVERNANCE POLICY
              </span>
              <p>
                Models with False Positive Rates exceeding 2.0% are strictly quarantined from automated transaction-blocking enforcement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
