/**
 * AEGIS Core Type Definitions
 * Financial Threat & Scam Intelligence Platform
 */

export type SeverityLevel = 'LOW' | 'GUARDED' | 'MODERATE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'INDIVIDUAL' | 'FAMILY' | 'BUSINESS' | 'ANALYST' | 'ADMIN' | 'ENTERPRISE';

export type ScanInputType = 'MESSAGE' | 'URL' | 'TRANSACTION' | 'EMAIL' | 'DOCUMENT';

export interface RiskFactor {
  name: string;
  category: 'NLP' | 'URL' | 'BEHAVIOR' | 'ANOMALY' | 'THREAT' | 'PATTERN';
  weight: number; // positive contribution to risk score
  description: string;
  evidence: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  type: ScanInputType;
  rawInput: string;
  normalizedInput: Record<string, unknown>;
  riskScore: number; // 0-100
  severity: SeverityLevel;
  confidence: number; // percentage (e.g. 96.4)
  classification: string;
  summary: string;
  factors: RiskFactor[];
  reasons: string[];
  recommendedActions: string[];
  threatIndicators: {
    urgencyLanguage: boolean;
    impersonationDetected: string | null;
    suspiciousDomain: string | null;
    credentialHarvesting: boolean;
    otpSolicitation: boolean;
    financialCoercion: boolean;
    knownScamPatternMatch: string | null;
  };
  componentScores: {
    nlp: number;
    url: number;
    behavior: number;
    anomaly: number;
    threat: number;
    pattern: number;
  };
  modelMetadata: {
    modelVersion: string;
    enginePipeline: string;
    datasetSimilarity: number;
    latencyMs: number;
  };
}

export interface ThreatEntity {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'DOMAIN' | 'URL' | 'MERCHANT' | 'WALLET' | 'ACCOUNT' | 'IP' | 'CAMPAIGN';
  value: string;
  reputationScore: number; // 0-100
  firstSeen: string;
  lastSeen: string;
  associatedCampaign: string;
  tags: string[];
  reportsCount: number;
  financialImpactEstimateUsd: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'USER' | 'PHONE' | 'EMAIL' | 'DOMAIN' | 'URL' | 'MERCHANT' | 'TRANSACTION' | 'BANK' | 'WALLET' | 'DEVICE' | 'IP' | 'CAMPAIGN';
  riskScore: number;
  details?: Record<string, unknown>;
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  relation: 'sent' | 'paid' | 'visited' | 'associated_with' | 'reported_by' | 'linked_to' | 'routed_via';
  timestamp?: string;
  weight?: number;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  senderAccount: string;
  senderName: string;
  recipientAccount: string;
  recipientName: string;
  merchantId?: string;
  amount: number;
  currency: string;
  channel: 'UPI' | 'NEFT' | 'IMPS' | 'CARD' | 'WIRE' | 'CRYPTO';
  description: string;
  anomalyScore: number; // 0-100
  riskScore: number; // 0-100
  severity: SeverityLevel;
  status: 'CLEARED' | 'FLAGGED' | 'QUARANTINED' | 'BLOCKED';
  flags: string[];
}

export interface DatasetItem {
  id: string;
  name: string;
  source: 'KAGGLE' | 'ENTERPRISE_FEED' | 'SYNTHETIC' | 'USER_REPORTS' | 'EXTERNAL_API';
  targetSchema: 'MESSAGE_EVENT' | 'TRANSACTION_EVENT' | 'URL_EVENT' | 'USER_EVENT' | 'MERCHANT_EVENT' | 'THREAT_EVENT';
  recordsCount: number;
  columns: string[];
  classes: string[];
  missingValuesPct: number;
  duplicatePct: number;
  classImbalanceRatio: string;
  dataQualityScore: number;
  lastUpdated: string;
  status: 'ACTIVE' | 'NORMALIZED' | 'TRAINING' | 'ARCHIVED';
  sampleData: Record<string, unknown>[];
  columnMappings: Record<string, string>;
}

export interface MLModelRecord {
  id: string;
  name: string;
  version: string;
  type: 'NLP_CLASSIFIER' | 'URL_HEURISTIC' | 'ANOMALY_DETECTOR' | 'TRANSACTION_FRAUD' | 'ENSEMBLE';
  primaryDataset: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  falsePositiveRate: number;
  trainedDate: string;
  status: 'PRODUCTION' | 'STAGING' | 'BENCHMARK' | 'ARCHIVED';
  topFeatures: { feature: string; importance: number }[];
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

export interface AlertRecord {
  id: string;
  threatId: string;
  timestamp: string;
  title: string;
  severity: SeverityLevel;
  category: 'SUSPICIOUS_TRANSACTION' | 'PHISHING_CAMPAIGN' | 'INVOICE_FRAUD' | 'KYC_HARVESTING' | 'ACCOUNT_ANOMALY';
  entityAffected: string;
  summary: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';
  cooldownActive: boolean;
  assignedAnalyst?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  ipAddress: string;
  signatureHash: string;
}
