/**
 * AEGIS Model Management & Evaluation Registry
 * Tracking production classifiers, feature importances, and evaluation metrics
 */

import { MLModelRecord } from '../types';

export const INITIAL_MODELS: MLModelRecord[] = [
  {
    id: 'MOD-ENSEMBLE-01',
    name: 'AEGIS Unified Production Ensemble',
    version: 'v3.4.1',
    type: 'ENSEMBLE',
    primaryDataset: 'Multi-Corpus (SMS + URL + Txn + BEC)',
    accuracy: 98.4,
    precision: 97.8,
    recall: 98.1,
    f1: 97.9,
    rocAuc: 0.994,
    falsePositiveRate: 1.2,
    trainedDate: '2026-10-04',
    status: 'PRODUCTION',
    topFeatures: [
      { feature: 'Triad Convergence (Urgency + Bank + Credential)', importance: 0.28 },
      { feature: 'Lexical Domain Entropy & Raw IP host', importance: 0.22 },
      { feature: 'Temporal Coercion Token Frequency', importance: 0.18 },
      { feature: 'Transaction Velocity / MCC Deviation', importance: 0.16 },
      { feature: 'Known Threat Network Entity Distance', importance: 0.16 }
    ],
    confusionMatrix: {
      truePositive: 1420,
      falsePositive: 18,
      trueNegative: 7850,
      falseNegative: 28
    }
  },
  {
    id: 'MOD-NLP-02',
    name: 'AEGIS Linguistic Urgency & Impersonation Classifier',
    version: 'v3.2.0',
    type: 'NLP_CLASSIFIER',
    primaryDataset: 'DS-KAGGLE-SMS-01 + DS-BEC-INVOICE-04',
    accuracy: 97.1,
    precision: 96.4,
    recall: 97.3,
    f1: 96.8,
    rocAuc: 0.988,
    falsePositiveRate: 1.8,
    trainedDate: '2026-09-30',
    status: 'PRODUCTION',
    topFeatures: [
      { feature: 'OTP / Credential harvesting tokens', importance: 0.32 },
      { feature: 'Bank / Tax Authority impersonation brand', importance: 0.26 },
      { feature: 'Threat imperative verbs (block, suspend, arrest)', importance: 0.24 },
      { feature: 'Linguistic punctuation entropy (!!!, URGENT)', importance: 0.18 }
    ],
    confusionMatrix: {
      truePositive: 684,
      falsePositive: 26,
      trueNegative: 4790,
      falseNegative: 19
    }
  },
  {
    id: 'MOD-URL-03',
    name: 'AEGIS URL Lexical & Domain Infrastructure Classifier',
    version: 'v2.9.4',
    type: 'URL_HEURISTIC',
    primaryDataset: 'DS-KAGGLE-URL-02',
    accuracy: 97.8,
    precision: 98.2,
    recall: 96.6,
    f1: 97.4,
    rocAuc: 0.991,
    falsePositiveRate: 0.9,
    trainedDate: '2026-10-02',
    status: 'PRODUCTION',
    topFeatures: [
      { feature: 'Suspicious TLD (.xyz, .top, .click, .icu)', importance: 0.30 },
      { feature: 'Raw IPv4 / IPv6 destination without DNS', importance: 0.27 },
      { feature: 'Domain registration age < 14 days', importance: 0.23 },
      { feature: 'Punycode / IDN homograph character substitution', importance: 0.20 }
    ],
    confusionMatrix: {
      truePositive: 1102,
      falsePositive: 10,
      trueNegative: 2190,
      falseNegative: 39
    }
  },
  {
    id: 'MOD-ANOMALY-04',
    name: 'AEGIS Isolation Forest Transaction Anomaly Detector',
    version: 'v4.1.0',
    type: 'ANOMALY_DETECTOR',
    primaryDataset: 'DS-TXN-SYNTH-03',
    accuracy: 95.9,
    precision: 94.3,
    recall: 96.0,
    f1: 95.1,
    rocAuc: 0.976,
    falsePositiveRate: 2.4,
    trainedDate: '2026-10-06',
    status: 'PRODUCTION',
    topFeatures: [
      { feature: '1-Hour Transaction Velocity Spike', importance: 0.34 },
      { feature: 'Amount deviation from user 90-day moving average', importance: 0.29 },
      { feature: 'Unregistered beneficiary account creation time', importance: 0.21 },
      { feature: 'Off-hours timestamp (02:00 - 05:00 local)', importance: 0.16 }
    ],
    confusionMatrix: {
      truePositive: 540,
      falsePositive: 33,
      trueNegative: 27400,
      falseNegative: 23
    }
  },
  {
    id: 'MOD-STAGING-05',
    name: 'Candidate LightGBM Unified Risk Engine',
    version: 'v3.5.0-rc2',
    type: 'ENSEMBLE',
    primaryDataset: 'All Normalized Corpora (Expanded)',
    accuracy: 98.7,
    precision: 98.2,
    recall: 98.6,
    f1: 98.4,
    rocAuc: 0.996,
    falsePositiveRate: 0.9,
    trainedDate: '2026-10-07',
    status: 'STAGING',
    topFeatures: [
      { feature: 'Dynamic Graph Multi-Hop Centrality', importance: 0.31 },
      { feature: 'Composite Triad Correlation Score', importance: 0.27 },
      { feature: 'Real-time Domain Registrar Whois flags', importance: 0.22 },
      { feature: 'Transformer Embeddings Cosine Distance', importance: 0.20 }
    ],
    confusionMatrix: {
      truePositive: 1445,
      falsePositive: 13,
      trueNegative: 7860,
      falseNegative: 20
    }
  }
];
