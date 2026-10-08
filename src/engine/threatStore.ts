/**
 * AEGIS Threat Intelligence & Fraud Network Graph Store
 */

import { ThreatEntity, NetworkNode, NetworkEdge, AlertRecord, TransactionRecord } from '../types';

export const THREAT_INTELLIGENCE_ENTITIES: ThreatEntity[] = [
  {
    id: 'THREAT-ENT-4921',
    type: 'CAMPAIGN',
    value: 'Operation Phantom-KYC (Banking Redirection Cluster)',
    reputationScore: 96,
    firstSeen: '2026-08-14',
    lastSeen: '2026-10-07',
    associatedCampaign: 'CAMPAIGN-PHANTOM-KYC',
    tags: ['SMS_SPOOFING', 'BANK_IMPERSONATION', 'OTP_THEFT', 'FAST_FLUX_DNS'],
    reportsCount: 1482,
    financialImpactEstimateUsd: 680000
  },
  {
    id: 'THREAT-ENT-4920',
    type: 'DOMAIN',
    value: 'sbi-kyc-verify.top',
    reputationScore: 98,
    firstSeen: '2026-09-22',
    lastSeen: '2026-10-07',
    associatedCampaign: 'CAMPAIGN-PHANTOM-KYC',
    tags: ['MALICIOUS_DOMAIN', 'DISPOSABLE_TLD', 'CREDENTIAL_HARVEST'],
    reportsCount: 429,
    financialImpactEstimateUsd: 142000
  },
  {
    id: 'THREAT-ENT-4919',
    type: 'PHONE',
    value: '+91-9812401923',
    reputationScore: 91,
    firstSeen: '2026-09-01',
    lastSeen: '2026-10-06',
    associatedCampaign: 'CAMPAIGN-UTILITY-BILL-SHUTDOWN',
    tags: ['VOICE_PHISHING', 'WHATSAPP_FRAUD', 'SIM_BOX_ROTATION'],
    reportsCount: 312,
    financialImpactEstimateUsd: 89000
  },
  {
    id: 'THREAT-ENT-4918',
    type: 'MERCHANT',
    value: 'MERCH-QIKPAY-88192 (FastCash Global Pvt)',
    reputationScore: 89,
    firstSeen: '2026-07-10',
    lastSeen: '2026-10-05',
    associatedCampaign: 'CAMPAIGN-PREDATORY-LOAN-APP',
    tags: ['MULE_MERCHANT', 'EXORBITANT_CHARGEBACK', 'UNAUTHORIZED_DEBIT'],
    reportsCount: 654,
    financialImpactEstimateUsd: 410000
  },
  {
    id: 'THREAT-ENT-4917',
    type: 'WALLET',
    value: '0x71C...39E1 (Tether USD Mule Address)',
    reputationScore: 97,
    firstSeen: '2026-06-19',
    lastSeen: '2026-10-07',
    associatedCampaign: 'CAMPAIGN-TELEGRAM-CRYPTO-TASK',
    tags: ['CRYPTO_WASHER', 'PONZI_LIQUIDATION', 'CROSS_BORDER_EXFILTRATION'],
    reportsCount: 890,
    financialImpactEstimateUsd: 1250000
  },
  {
    id: 'THREAT-ENT-4916',
    type: 'EMAIL',
    value: 'billing-update@corp-vendor-payment.xyz',
    reputationScore: 94,
    firstSeen: '2026-09-15',
    lastSeen: '2026-10-07',
    associatedCampaign: 'CAMPAIGN-BEC-INVOICE-FRAUD',
    tags: ['BEC', 'TYPOSQUATTING', 'EXECUTIVE_IMPERSONATION'],
    reportsCount: 94,
    financialImpactEstimateUsd: 380000
  }
];

export const INITIAL_NETWORK_NODES: NetworkNode[] = [
  { id: 'node-campaign-1', label: 'Campaign: Phantom KYC', type: 'CAMPAIGN', riskScore: 96, x: 400, y: 160 },
  { id: 'node-domain-1', label: 'sbi-kyc-verify.top', type: 'DOMAIN', riskScore: 98, x: 260, y: 100 },
  { id: 'node-url-1', label: 'sbi-kyc-verify.top/portal/auth', type: 'URL', riskScore: 95, x: 120, y: 80 },
  { id: 'node-phone-1', label: '+91-98765-12345 (SMS Gateway)', type: 'PHONE', riskScore: 88, x: 340, y: 270 },
  { id: 'node-ip-1', label: '185.193.64.12 (Bulletproof VPS)', type: 'IP', riskScore: 92, x: 200, y: 200 },
  { id: 'node-merchant-1', label: 'Mule Merchant #88192', type: 'MERCHANT', riskScore: 89, x: 560, y: 140 },
  { id: 'node-txn-1', label: 'Txn #TX-90214 ($1,250)', type: 'TRANSACTION', riskScore: 94, x: 670, y: 90 },
  { id: 'node-user-1', label: 'Compromised Acct #7712', type: 'USER', riskScore: 78, x: 740, y: 170 },
  { id: 'node-bank-1', label: 'Apex Private Banking', type: 'BANK', riskScore: 12, x: 580, y: 260 },
  { id: 'node-wallet-1', label: '0x71C...39E1 (USDT Mule)', type: 'WALLET', riskScore: 97, x: 720, y: 280 },
  { id: 'node-device-1', label: 'Device: Android Fingerprint #F9A', type: 'DEVICE', riskScore: 84, x: 470, y: 330 }
];

export const INITIAL_NETWORK_EDGES: NetworkEdge[] = [
  { id: 'edge-1', source: 'node-campaign-1', target: 'node-domain-1', relation: 'associated_with', weight: 4 },
  { id: 'edge-2', source: 'node-domain-1', target: 'node-url-1', relation: 'linked_to', weight: 3 },
  { id: 'edge-3', source: 'node-domain-1', target: 'node-ip-1', relation: 'routed_via', weight: 3 },
  { id: 'edge-4', source: 'node-campaign-1', target: 'node-phone-1', relation: 'sent', weight: 2 },
  { id: 'edge-5', source: 'node-phone-1', target: 'node-url-1', relation: 'sent', weight: 3 },
  { id: 'edge-6', source: 'node-campaign-1', target: 'node-merchant-1', relation: 'linked_to', weight: 4 },
  { id: 'edge-7', source: 'node-merchant-1', target: 'node-txn-1', relation: 'paid', weight: 3 },
  { id: 'edge-8', source: 'node-txn-1', target: 'node-user-1', relation: 'reported_by', weight: 2 },
  { id: 'edge-9', source: 'node-merchant-1', target: 'node-bank-1', relation: 'linked_to', weight: 1 },
  { id: 'edge-10', source: 'node-merchant-1', target: 'node-wallet-1', relation: 'linked_to', weight: 4 },
  { id: 'edge-11', source: 'node-phone-1', target: 'node-device-1', relation: 'associated_with', weight: 2 },
  { id: 'edge-12', source: 'node-device-1', target: 'node-campaign-1', relation: 'linked_to', weight: 3 }
];

export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'ALT-9921',
    threatId: 'THREAT-ENT-4921',
    timestamp: '2026-10-07 18:32 UTC',
    title: 'Surge in Targeted Banking KYC Phishing Attacks',
    severity: 'CRITICAL',
    category: 'KYC_HARVESTING',
    entityAffected: 'Retail Banking Customers (SBI / HDFC Routing)',
    summary: 'Mass SMS barrage detected utilizing newly registered domain sbi-kyc-verify.top pointing to offshore reverse proxy.',
    status: 'ACTIVE',
    cooldownActive: true,
    assignedAnalyst: 'Lead Analyst V. Ross'
  },
  {
    id: 'ALT-9920',
    threatId: 'THREAT-ENT-4916',
    timestamp: '2026-10-07 16:14 UTC',
    title: 'Executive BEC Invoice Wire Redirection Attempt',
    severity: 'HIGH',
    category: 'INVOICE_FRAUD',
    entityAffected: 'Corporate Treasury / Accounts Payable',
    summary: 'Typosquatted domain billing-update@corp-vendor-payment.xyz attempted to substitute wire remittance routing details.',
    status: 'INVESTIGATING',
    cooldownActive: false,
    assignedAnalyst: 'Analyst K. Chen'
  },
  {
    id: 'ALT-9919',
    threatId: 'THREAT-ENT-4918',
    timestamp: '2026-10-07 14:02 UTC',
    title: 'High-Velocity UPI Layering Mule Node Flagged',
    severity: 'HIGH',
    category: 'SUSPICIOUS_TRANSACTION',
    entityAffected: 'Merchant Gateway Tier 2',
    summary: 'Aggregator merchant account #88192 exceeded standard variance with 42 incoming transfers followed by immediate crypto swap.',
    status: 'ACKNOWLEDGED',
    cooldownActive: true,
    assignedAnalyst: 'Fraud Ops Bot-01'
  },
  {
    id: 'ALT-9918',
    threatId: 'THREAT-ENT-4919',
    timestamp: '2026-10-07 10:45 UTC',
    title: 'Utility Disconnection Impersonation Call & SMS Blast',
    severity: 'MEDIUM',
    category: 'PHISHING_CAMPAIGN',
    entityAffected: 'Residential & Small Business Customers',
    summary: 'Coercive messages threatening power cutoff at 9:30 PM circulating via spoofed virtual numbers.',
    status: 'ACTIVE',
    cooldownActive: false
  },
  {
    id: 'ALT-9917',
    threatId: 'THREAT-ENT-4917',
    timestamp: '2026-10-06 22:10 UTC',
    title: 'Unusual Off-Hours Transaction Velocity Deviation',
    severity: 'LOW',
    category: 'ACCOUNT_ANOMALY',
    entityAffected: 'Corporate Debit Card Acct ****9014',
    summary: 'Card processed in novel geo-location with low total value; cleared after 2-factor authentication.',
    status: 'RESOLVED',
    cooldownActive: false
  }
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-90214',
    timestamp: '2026-10-07 18:24:10',
    senderAccount: 'AC-****4912 (S. Sharma)',
    senderName: 'S. Sharma',
    recipientAccount: 'MERCH-QIKPAY-88192',
    recipientName: 'FastCash Global Pvt',
    merchantId: 'M-88192',
    amount: 49999,
    currency: 'INR',
    channel: 'UPI',
    description: 'Urgent KYC Security Deposit Refundable Fee',
    anomalyScore: 94,
    riskScore: 94,
    severity: 'CRITICAL',
    status: 'BLOCKED',
    flags: ['Known Mule Merchant', 'Velocity Spike > 500%', 'Mismatched Beneficiary Geo']
  },
  {
    id: 'TXN-90215',
    timestamp: '2026-10-07 18:19:42',
    senderAccount: 'AC-****8821 (TechVentures Ltd)',
    senderName: 'TechVentures Treasury',
    recipientAccount: 'IBAN-GB49BARC2091',
    recipientName: 'Vendor Remittance Escrow',
    amount: 142000,
    currency: 'USD',
    channel: 'WIRE',
    description: 'Invoice #INV-2026-881 Altered Wire Settlement',
    anomalyScore: 86,
    riskScore: 88,
    severity: 'HIGH',
    status: 'QUARANTINED',
    flags: ['BEC Typosquat Sender', 'Beneficiary Account Changed Within 24h', 'Amount Above Average Threshold']
  },
  {
    id: 'TXN-90216',
    timestamp: '2026-10-07 18:05:12',
    senderAccount: 'AC-****1094 (M. Verma)',
    senderName: 'M. Verma',
    recipientAccount: 'UPI-TELEGRAM-TASK@ybl',
    recipientName: 'Crypto Profit Pool Admin',
    amount: 15000,
    currency: 'INR',
    channel: 'UPI',
    description: 'Part-Time YouTube Task Escrow Deposit Level 2',
    anomalyScore: 82,
    riskScore: 84,
    severity: 'HIGH',
    status: 'QUARANTINED',
    flags: ['Ponzi Pyramid Pattern', 'Unregistered P2P Handle', 'Escrow Solicitation']
  },
  {
    id: 'TXN-90217',
    timestamp: '2026-10-07 17:58:30',
    senderAccount: 'AC-****3310 (P. Jenkins)',
    senderName: 'P. Jenkins',
    recipientAccount: 'MERCH-DELIVERY-POST',
    recipientName: 'India Post Clearance Gateway',
    amount: 249,
    currency: 'INR',
    channel: 'CARD',
    description: 'Customs Package Detention Fee',
    anomalyScore: 78,
    riskScore: 81,
    severity: 'CRITICAL',
    status: 'BLOCKED',
    flags: ['Spoofed Customs Gateway', 'Card-Not-Present Credential Harvest', 'Suspicious URL Referral']
  },
  {
    id: 'TXN-90218',
    timestamp: '2026-10-07 17:42:15',
    senderAccount: 'AC-****9044 (Enterprise Corp)',
    senderName: 'Payroll Disbursal',
    recipientAccount: 'AC-****2219 (A. Kumar)',
    recipientName: 'A. Kumar',
    amount: 84500,
    currency: 'INR',
    channel: 'NEFT',
    description: 'Monthly Salary Disbursement October 2026',
    anomalyScore: 4,
    riskScore: 6,
    severity: 'LOW',
    status: 'CLEARED',
    flags: ['Verified Direct Deposit', 'Recurring Beneficiary', 'KYC Invariant Met']
  },
  {
    id: 'TXN-90219',
    timestamp: '2026-10-07 17:30:05',
    senderAccount: 'AC-****6711 (D. Patel)',
    senderName: 'D. Patel',
    recipientAccount: 'MERCH-GROCERY-01',
    recipientName: 'Fresh Mart Supermarket',
    amount: 1420,
    currency: 'INR',
    channel: 'UPI',
    description: 'In-Store POS Payment',
    anomalyScore: 2,
    riskScore: 4,
    severity: 'LOW',
    status: 'CLEARED',
    flags: ['Standard Merchant POS', 'Verified In-Person Hardware Terminal']
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-8801',
    timestamp: '2026-10-07 18:35:12 UTC',
    actor: 'analyst.ross@aegis-security.internal',
    role: 'ANALYST',
    action: 'QUARANTINE_MERCHANT_NODE',
    resource: 'MERCH-QIKPAY-88192',
    status: 'SUCCESS' as const,
    ipAddress: '10.240.12.8',
    signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'AUD-8802',
    timestamp: '2026-10-07 18:24:11 UTC',
    actor: 'aegis.autonomous.rules-engine',
    role: 'SYSTEM',
    action: 'BLOCK_TRANSACTION_EXECUTION',
    resource: 'TXN-90214',
    status: 'SUCCESS' as const,
    ipAddress: '127.0.0.1',
    signatureHash: 'ca978112ca1bbdcaf06274e579b817ecf8f76429932048ac4f7ccf5160164bfc'
  },
  {
    id: 'AUD-8803',
    timestamp: '2026-10-07 17:50:00 UTC',
    actor: 'admin.chen@aegis-security.internal',
    role: 'ADMIN',
    action: 'PROMOTE_MODEL_TO_PRODUCTION',
    resource: 'MOD-ENSEMBLE-01 (v3.4.1)',
    status: 'SUCCESS' as const,
    ipAddress: '10.240.12.19',
    signatureHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  {
    id: 'AUD-8804',
    timestamp: '2026-10-07 16:30:19 UTC',
    actor: 'api.client.fintech_partner_39',
    role: 'ENTERPRISE',
    action: 'EXECUTE_BATCH_SCAN',
    resource: '/api/v1/scan/transaction',
    status: 'SUCCESS' as const,
    ipAddress: '198.51.100.44',
    signatureHash: 'eccbc87e4b5ce2fe28308fd9f2a7baf3611f13d59e206477aceb825071849a94'
  }
];
