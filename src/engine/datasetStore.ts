/**
 * AEGIS Dataset Ingestion & Normalization Layer
 * Implements Multi-Dataset Schema Mapping & Kaggle Ingestion Pipeline
 */

import { DatasetItem } from '../types';

export const INITIAL_DATASETS: DatasetItem[] = [
  {
    id: 'DS-KAGGLE-SMS-01',
    name: 'Kaggle SMS Scam & Financial Phishing Corpus',
    source: 'KAGGLE',
    targetSchema: 'MESSAGE_EVENT',
    recordsCount: 5574,
    columns: ['v1_target', 'v2_sms_body', 'sender_prefix', 'telecom_operator'],
    classes: ['ham (legitimate)', 'spam (commercial)', 'phishing_fraud (critical)'],
    missingValuesPct: 0.2,
    duplicatePct: 3.4,
    classImbalanceRatio: '87:13',
    dataQualityScore: 94.6,
    lastUpdated: '2026-09-28',
    status: 'NORMALIZED',
    sampleData: [
      { v1_target: 'phishing_fraud', v2_sms_body: 'Your SBI netbanking is blocked. Update KYC instantly: http://sbi-kyc-verify.top', sender_prefix: 'VM-SBIIN', telecom_operator: 'AIRTEL' },
      { v1_target: 'phishing_fraud', v2_sms_body: 'Customs package held at port. Pay clearance fee INR 249 to prevent return: http://parcel-clear.xyz', sender_prefix: 'CP-INPOST', telecom_operator: 'JIO' },
      { v1_target: 'ham', v2_sms_body: 'Your salary account credited with INR 78,500 on 28-SEP-2026. Ref UPI/49219482.', sender_prefix: 'AX-HDFCBK', telecom_operator: 'VODAFONE' },
      { v1_target: 'spam', v2_sms_body: 'Flash sale at City Retail. Up to 50% discount on clothing this weekend only.', sender_prefix: 'BZ-RETAIL', telecom_operator: 'BSNL' },
      { v1_target: 'phishing_fraud', v2_sms_body: 'Dear customer, electric supply will be disconnected at 9:30 PM due to unpaid bill. Call officer 9812401923', sender_prefix: 'VM-POWERC', telecom_operator: 'JIO' }
    ],
    columnMappings: {
      'v2_sms_body': 'raw_content',
      'v1_target': 'classification_label',
      'sender_prefix': 'sender_identifier',
      'telecom_operator': 'routing_metadata'
    }
  },
  {
    id: 'DS-KAGGLE-URL-02',
    name: 'Global Financial Phishing Domains & URLs (Kaggle / PhishTank)',
    source: 'KAGGLE',
    targetSchema: 'URL_EVENT',
    recordsCount: 11430,
    columns: ['url_string', 'domain_age_days', 'has_https', 'tld', 'entropy_score', 'is_phish'],
    classes: ['clean_legit', 'credential_harvest', 'malware_delivery'],
    missingValuesPct: 1.1,
    duplicatePct: 1.8,
    classImbalanceRatio: '62:38',
    dataQualityScore: 92.1,
    lastUpdated: '2026-10-02',
    status: 'NORMALIZED',
    sampleData: [
      { url_string: 'https://security-login-sbi-portal.xyz/auth', domain_age_days: 3, has_https: true, tld: '.xyz', entropy_score: 4.82, is_phish: 1 },
      { url_string: 'http://185.193.64.12/verify-account', domain_age_days: 0, has_https: false, tld: 'ip_raw', entropy_score: 3.12, is_phish: 1 },
      { url_string: 'https://www.hdfcbank.com/personal/ways-to-bank', domain_age_days: 9420, has_https: true, tld: '.com', entropy_score: 3.41, is_phish: 0 },
      { url_string: 'https://paypal-resolution-dispute.click/login', domain_age_days: 1, has_https: true, tld: '.click', entropy_score: 4.95, is_phish: 1 },
      { url_string: 'https://support.apple.com/en-us/HT201232', domain_age_days: 10450, has_https: true, tld: '.com', entropy_score: 3.55, is_phish: 0 }
    ],
    columnMappings: {
      'url_string': 'target_url',
      'is_phish': 'ground_truth_label',
      'entropy_score': 'lexical_entropy',
      'domain_age_days': 'domain_maturity'
    }
  },
  {
    id: 'DS-TXN-SYNTH-03',
    name: 'Banking Transaction Stream & Anomaly Benchmarks',
    source: 'SYNTHETIC',
    targetSchema: 'TRANSACTION_EVENT',
    recordsCount: 28400,
    columns: ['txn_id', 'amount_inr', 'channel_type', 'recipient_mcc', 'velocity_1h', 'is_fraudulent'],
    classes: ['standard_txn', 'unauthorized_pull', 'account_takeover', 'mule_layering'],
    missingValuesPct: 0.0,
    duplicatePct: 0.1,
    classImbalanceRatio: '98:2',
    dataQualityScore: 98.4,
    lastUpdated: '2026-10-06',
    status: 'ACTIVE',
    sampleData: [
      { txn_id: 'TXN-90214', amount_inr: 49999, channel_type: 'UPI', recipient_mcc: '6012', velocity_1h: 6, is_fraudulent: 1 },
      { txn_id: 'TXN-90215', amount_inr: 250, channel_type: 'UPI', recipient_mcc: '5411', velocity_1h: 1, is_fraudulent: 0 },
      { txn_id: 'TXN-90216', amount_inr: 95000, channel_type: 'IMPS', recipient_mcc: '6540', velocity_1h: 4, is_fraudulent: 1 },
      { txn_id: 'TXN-90217', amount_inr: 3200, channel_type: 'CARD', recipient_mcc: '5812', velocity_1h: 1, is_fraudulent: 0 }
    ],
    columnMappings: {
      'txn_id': 'transaction_id',
      'amount_inr': 'monetary_value',
      'channel_type': 'payment_channel',
      'is_fraudulent': 'risk_verdict'
    }
  },
  {
    id: 'DS-BEC-INVOICE-04',
    name: 'Business Email Compromise (BEC) & Vendor Fraud Corpus',
    source: 'ENTERPRISE_FEED',
    targetSchema: 'MESSAGE_EVENT',
    recordsCount: 8200,
    columns: ['email_subject', 'body_text', 'sender_spoofed', 'altered_bank_iban', 'label'],
    classes: ['authentic_procurement', 'invoice_redirection', 'executive_impersonation'],
    missingValuesPct: 0.4,
    duplicatePct: 1.2,
    classImbalanceRatio: '91:9',
    dataQualityScore: 95.0,
    lastUpdated: '2026-10-01',
    status: 'NORMALIZED',
    sampleData: [
      { email_subject: 'URGENT: Revised Remittance Wire Instructions for Q3 Invoice', body_text: 'Please note our banking partner has changed due to annual audit. Disburse to IBAN GB49BARC20...', sender_spoofed: true, altered_bank_iban: true, label: 'invoice_redirection' },
      { email_subject: 'Invoice #INV-2026-881 Approval Confirmation', body_text: 'Thank you for your business. Please find attached the monthly statement.', sender_spoofed: false, altered_bank_iban: false, label: 'authentic_procurement' }
    ],
    columnMappings: {
      'body_text': 'raw_content',
      'email_subject': 'message_subject',
      'label': 'classification_label'
    }
  },
  {
    id: 'DS-USER-FEEDBACK-05',
    name: 'AEGIS Production Feedback & Analyst Disputed Records',
    source: 'USER_REPORTS',
    targetSchema: 'THREAT_EVENT',
    recordsCount: 420,
    columns: ['report_id', 'reported_entity', 'analyst_decision', 'original_score', 'adjusted_score', 'audited_by'],
    classes: ['verified_fraud', 'false_positive_remediation', 'novel_technique'],
    missingValuesPct: 0.0,
    duplicatePct: 0.0,
    classImbalanceRatio: '70:30',
    dataQualityScore: 99.2,
    lastUpdated: '2026-10-07',
    status: 'ACTIVE',
    sampleData: [
      { report_id: 'REP-1049', reported_entity: 'http://e-challan-transport-pay.xyz', analyst_decision: 'CONFIRMED_FRAUD', original_score: 92, adjusted_score: 96, audited_by: 'Analyst-04' },
      { report_id: 'REP-1050', reported_entity: 'Bulk SMS from municipal tax board', analyst_decision: 'FALSE_POSITIVE', original_score: 55, adjusted_score: 18, audited_by: 'SeniorAnalyst-01' }
    ],
    columnMappings: {
      'reported_entity': 'indicator_value',
      'analyst_decision': 'ground_truth_label'
    }
  }
];

export interface NormalizationReport {
  datasetId: string;
  sourceRows: number;
  validRows: number;
  droppedDuplicates: number;
  imputedMissing: number;
  targetSchema: string;
  mappedFieldsCount: number;
  qualityDelta: number;
  executionTimeMs: number;
}

export function executeDatasetNormalization(dataset: DatasetItem): NormalizationReport {
  const droppedDuplicates = Math.round(dataset.recordsCount * (dataset.duplicatePct / 100));
  const imputedMissing = Math.round(dataset.recordsCount * (dataset.missingValuesPct / 100));
  const validRows = dataset.recordsCount - droppedDuplicates;

  return {
    datasetId: dataset.id,
    sourceRows: dataset.recordsCount,
    validRows,
    droppedDuplicates,
    imputedMissing,
    targetSchema: dataset.targetSchema,
    mappedFieldsCount: Object.keys(dataset.columnMappings).length,
    qualityDelta: +2.8,
    executionTimeMs: Math.floor(45 + Math.random() * 80)
  };
}
