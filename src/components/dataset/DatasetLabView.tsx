/**
 * AEGIS Dataset Laboratory
 * Kaggle Ingestion, Multi-Dataset Schema Mapping & Normalization Pipeline.
 */

import React, { useState } from 'react';
import { INITIAL_DATASETS, executeDatasetNormalization, NormalizationReport } from '../../engine/datasetStore';
import { DatasetItem } from '../../types';
import { Database, Upload, RefreshCw, CheckCircle, ArrowRight, Layers, FileSpreadsheet, PlusCircle } from 'lucide-react';

export default function DatasetLabView() {
  const [datasets, setDatasets] = useState<DatasetItem[]>(INITIAL_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(datasets[0]);
  const [report, setReport] = useState<NormalizationReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // New dataset form
  const [newDsName, setNewDsName] = useState('');
  const [newDsSource, setNewDsSource] = useState<'KAGGLE' | 'ENTERPRISE_FEED' | 'SYNTHETIC'>('KAGGLE');
  const [newDsTarget, setNewDsTarget] = useState<'MESSAGE_EVENT' | 'TRANSACTION_EVENT' | 'URL_EVENT'>('MESSAGE_EVENT');

  const handleNormalize = (dataset: DatasetItem) => {
    setIsProcessing(true);
    setTimeout(() => {
      const rep = executeDatasetNormalization(dataset);
      setReport(rep);
      const updated = datasets.map((d) =>
        d.id === dataset.id ? { ...d, status: 'NORMALIZED' as const, dataQualityScore: Math.min(99.5, d.dataQualityScore + 1.8) } : d
      );
      setDatasets(updated);
      setSelectedDataset(updated.find((u) => u.id === dataset.id) || null);
      setIsProcessing(false);
    }, 450);
  };

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsName.trim()) return;

    const newDs: DatasetItem = {
      id: `DS-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      name: newDsName,
      source: newDsSource,
      targetSchema: newDsTarget,
      recordsCount: Math.floor(4000 + Math.random() * 8000),
      columns: ['record_id', 'content_text', 'label_status', 'created_at'],
      classes: ['legitimate', 'fraud_attempt'],
      missingValuesPct: 0.4,
      duplicatePct: 1.1,
      classImbalanceRatio: '80:20',
      dataQualityScore: 91.2,
      lastUpdated: new Date().toISOString().substring(0, 10),
      status: 'ACTIVE',
      sampleData: [
        { record_id: 'REC-01', content_text: 'Sample imported transaction or text', label_status: 'fraud_attempt' },
        { record_id: 'REC-02', content_text: 'Verified counterparty transfer', label_status: 'legitimate' }
      ],
      columnMappings: {
        'content_text': 'raw_content',
        'label_status': 'ground_truth_label'
      }
    };

    setDatasets([newDs, ...datasets]);
    setSelectedDataset(newDs);
    setShowImportModal(false);
    setNewDsName('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
            <span>DATA INGESTION & PIPELINE LABORATORY</span>
            <span>·</span>
            <span>MULTI-CORPUS NORMALIZATION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
            DATASET LABORATORY
          </h1>
          <p className="text-sm text-[#654536] mt-1 max-w-2xl">
            Ingest heterogeneous Kaggle corpora, financial transaction logs, and phishing feeds. Standardize columns into canonical AEGIS event schemas.
          </p>
        </div>

        <button
          onClick={() => setShowImportModal(true)}
          className="px-4 py-2 text-xs font-mono font-medium tracking-wider uppercase text-white bg-[#3A2418] hover:bg-[#20130B] transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-[#B86F52]" />
          <span>INGEST KAGGLE / CSV DATASET</span>
        </button>
      </div>

      {/* Visual Pipeline Banner */}
      <div className="bg-[#FFFFFF] border border-[#654536]/30 p-4">
        <span className="block text-[10px] font-mono text-[#654536] uppercase tracking-wider mb-3">
          STANDARDIZED AEGIS DATA PIPELINE
        </span>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          {[
            'KAGGLE / CSV',
            'INGESTION',
            'VALIDATION',
            'CLEANING',
            'NORMALIZATION',
            'FEATURE ENGR',
            'MODEL REGISTRY'
          ].map((stage, idx, arr) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#F5EFE4] text-[#3A2418] border border-[#654536]/20 font-medium">
                {stage}
              </span>
              {idx < arr.length - 1 && (
                <span className="text-[#B86F52] font-bold opacity-80">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#654536]/15">
            <h2 className="text-xs font-mono font-bold text-[#3A2418] uppercase tracking-wider">
              INGEST NEW KAGGLE OR ENTERPRISE DATASET
            </h2>
            <button
              onClick={() => setShowImportModal(false)}
              className="text-xs font-mono text-[#654536] hover:text-[#3A2418]"
            >
              DISMISS
            </button>
          </div>

          <form onSubmit={handleCreateDataset} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="md:col-span-2">
              <label className="block text-[#654536] mb-1">DATASET NAME OR KAGGLE REPOSITORY IDENTIFIER</label>
              <input
                type="text"
                placeholder="e.g. kaggle/deep-phishing-url-collection-2026"
                value={newDsName}
                onChange={(e) => setNewDsName(e.target.value)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#654536] mb-1">CORPUS SOURCE</label>
              <select
                value={newDsSource}
                onChange={(e) => setNewDsSource(e.target.value as any)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              >
                <option value="KAGGLE">Kaggle Dataset</option>
                <option value="ENTERPRISE_FEED">Enterprise Feed</option>
                <option value="SYNTHETIC">Synthetic Corpus</option>
              </select>
            </div>
            <div>
              <label className="block text-[#654536] mb-1">CANONICAL TARGET SCHEMA</label>
              <select
                value={newDsTarget}
                onChange={(e) => setNewDsTarget(e.target.value as any)}
                className="w-full p-2 bg-[#F5EFE4] border border-[#654536]/30 text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              >
                <option value="MESSAGE_EVENT">MESSAGE_EVENT</option>
                <option value="TRANSACTION_EVENT">TRANSACTION_EVENT</option>
                <option value="URL_EVENT">URL_EVENT</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full p-2 bg-[#B86F52] hover:bg-[#A35D42] text-white font-bold transition-colors"
              >
                REGISTER & MAP COLUMNS →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Datasets Table & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Datasets Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#654536]/30 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#E6D6C3]/60 border-b border-[#654536]/20 text-[#654536] text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">DATASET NAME</th>
                <th className="py-2.5 px-3">SOURCE</th>
                <th className="py-2.5 px-3 text-right">RECORDS</th>
                <th className="py-2.5 px-3">QUALITY</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#654536]/15 text-[#3A2418]">
              {datasets.map((ds) => {
                const isSelected = selectedDataset?.id === ds.id;
                return (
                  <tr
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#E6D6C3]/75 font-semibold' : 'hover:bg-[#F5EFE4]'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className="block text-[#3A2418] font-medium">{ds.name}</span>
                      <span className="text-[10px] text-[#654536] block">{ds.targetSchema}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 text-[10px] bg-[#E6D6C3] text-[#3A2418]">
                        {ds.source}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {ds.recordsCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold text-[#B86F52]">
                      {ds.dataQualityScore}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: ds.status === 'NORMALIZED' ? '#3A2418' : '#E6D6C3',
                          color: ds.status === 'NORMALIZED' ? '#FFFFFF' : '#3A2418'
                        }}
                      >
                        {ds.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Dataset Inspection & Pipeline Execution (5 cols) */}
        {selectedDataset && (
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
            <div className="pb-3 border-b border-[#654536]/20">
              <div className="flex items-center justify-between text-xs font-mono text-[#654536] mb-1">
                <span>SCHEMA NORMALIZER</span>
                <span>#{selectedDataset.id}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#3A2418]">
                {selectedDataset.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono px-2 py-0.5 bg-[#3A2418] text-white">
                  TARGET: {selectedDataset.targetSchema}
                </span>
                <span className="text-xs font-mono text-[#654536]">
                  UPDATED: {selectedDataset.lastUpdated}
                </span>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">DUPLICATES</span>
                <span className="font-bold text-[#3A2418]">{selectedDataset.duplicatePct}%</span>
              </div>
              <div className="p-2 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">MISSING VALUES</span>
                <span className="font-bold text-[#3A2418]">{selectedDataset.missingValuesPct}%</span>
              </div>
              <div className="p-2 bg-[#F5EFE4] border border-[#654536]/15">
                <span className="text-[10px] text-[#654536] block">IMBALANCE</span>
                <span className="font-bold text-[#3A2418]">{selectedDataset.classImbalanceRatio}</span>
              </div>
            </div>

            {/* Active Column Mappings */}
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase tracking-wider block mb-1.5">
                CANONICAL COLUMN MAPPINGS
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {Object.entries(selectedDataset.columnMappings).map(([src, tgt]) => (
                  <div key={src} className="flex items-center justify-between p-2 bg-[#F5EFE4] border border-[#654536]/15">
                    <span className="text-[#654536]">{src}</span>
                    <span className="text-[#B86F52] font-bold">→</span>
                    <span className="text-[#3A2418] font-bold">{tgt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Ingested Row Preview */}
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase tracking-wider block mb-1">
                SAMPLE RECORD PREVIEW
              </span>
              <pre className="p-2.5 bg-[#F5EFE4] border border-[#654536]/15 text-[11px] font-mono text-[#3A2418] overflow-x-auto max-h-32">
                {JSON.stringify(selectedDataset.sampleData[0], null, 2)}
              </pre>
            </div>

            {/* Execution Controls */}
            <div className="pt-2 border-t border-[#654536]/15 space-y-2">
              <button
                onClick={() => handleNormalize(selectedDataset)}
                disabled={isProcessing}
                className="w-full py-2.5 text-xs font-mono font-medium tracking-wider uppercase text-white bg-[#B86F52] hover:bg-[#A35D42] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>EXECUTE CLEANING & NORMALIZATION</span>
              </button>

              {report && (
                <div className="p-3 bg-[#E6D6C3]/60 border border-[#654536]/25 text-xs font-mono text-[#3A2418] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#3A2418]">
                    <CheckCircle className="w-4 h-4 text-[#B86F52]" />
                    <span>NORMALIZATION PIPELINE EXECUTED</span>
                  </div>
                  <div className="text-[11px] text-[#654536]">
                    Processed {report.sourceRows.toLocaleString()} rows · Dropped {report.droppedDuplicates} duplicates · Mapped {report.mappedFieldsCount} fields in {report.executionTimeMs}ms.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
