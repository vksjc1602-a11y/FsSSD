/**
 * AEGIS Multi-Layer Score Fusion Engine
 *
 * Mathematically combines:
 * - Layer 1: Rule Engine Score (S_rules in [0, 1])
 * - Layer 2: ML Text Probability (P_text in [0, 1])
 * - Layer 2: ML URL Lexical Probability (P_url in [0, 1])
 * - Layer 3: URL & Domain Intel Risk (S_intel in [0, 1])
 * - Layer 4: Gemini LLM Intent Assessment (P_llm in [0, 1])
 *
 * Derives honest confidence from layer concordances/standard deviation.
 * Builds full ThreatReport object for UI and enterprise telemetry.
 */

import { ThreatReport, ThreatVerdict, ScanResult, SeverityLevel, RiskFactor } from '../types/index.ts';
import { TextMLResult, UrlMLResult } from './mlClassifier.ts';
import { Layer3UrlIntelSummary } from './urlIntel.ts';
import { LlmAnalysisResult } from './llmAnalyzer.ts';

export interface FusionInputPayload {
  rawInput: string;
  type: 'MESSAGE' | 'URL' | 'TRANSACTION' | 'EMAIL' | 'DOCUMENT';
  ruleScore: number;
  ruleFactors: RiskFactor[];
  ruleReasons: string[];
  ruleThreatIndicators: ScanResult['threatIndicators'];
  textMl: TextMLResult;
  urlMl: UrlMLResult | null;
  urlIntel: Layer3UrlIntelSummary;
  llmAnalysis: LlmAnalysisResult | null;
  llmUsed: boolean;
}

export function computeScoreFusion(payload: FusionInputPayload): {
  riskScore: number;
  severity: SeverityLevel;
  confidence: number;
  verdict: ThreatVerdict;
  threatReport: ThreatReport;
  summary: string;
  reasons: string[];
  factors: RiskFactor[];
} {
  const {
    rawInput,
    ruleScore,
    ruleFactors,
    ruleReasons,
    ruleThreatIndicators,
    textMl,
    urlMl,
    urlIntel,
    llmAnalysis,
    llmUsed
  } = payload;

  const sRules = Math.min(1.0, Math.max(0.0, ruleScore / 100));
  const pMlText = textMl.probability;
  const hasUrl = urlIntel.urlsAnalyzed.length > 0 || urlMl !== null;
  const pMlUrl = urlMl ? urlMl.probability : 0.0;
  const sIntel = Math.min(1.0, Math.max(0.0, urlIntel.aggregateUrlRisk / 100));

  let pLlm = pMlText;
  if (llmUsed && llmAnalysis) {
    switch (llmAnalysis.verdict) {
      case 'SCAM':
        pLlm = 0.95;
        break;
      case 'LIKELY_SCAM':
        pLlm = 0.80;
        break;
      case 'SUSPICIOUS':
        pLlm = 0.55;
        break;
      case 'LIKELY_SAFE':
        pLlm = 0.20;
        break;
      case 'SAFE':
        pLlm = 0.05;
        break;
    }
  }

  // --- Dynamic Weight Stacking ---
  let weightedScore = 0;
  const activeSignals: number[] = [];

  if (hasUrl) {
    if (llmUsed) {
      // 5-Layer Stack
      weightedScore =
        pMlText * 0.25 +
        pMlUrl * 0.25 +
        pLlm * 0.35 +
        sIntel * 0.10 +
        sRules * 0.05;
      activeSignals.push(pMlText, pMlUrl, pLlm, sIntel, sRules);
    } else {
      // 4-Layer Fallback without LLM
      weightedScore =
        pMlText * 0.40 +
        pMlUrl * 0.30 +
        sIntel * 0.20 +
        sRules * 0.10;
      activeSignals.push(pMlText, pMlUrl, sIntel, sRules);
    }
  } else {
    // Text-only pipeline
    if (llmUsed) {
      weightedScore =
        pMlText * 0.45 +
        pLlm * 0.45 +
        sRules * 0.10;
      activeSignals.push(pMlText, pLlm, sRules);
    } else {
      weightedScore =
        pMlText * 0.80 +
        sRules * 0.20;
      activeSignals.push(pMlText, sRules);
    }
  }

  // --- Evidence Floor & Ceiling Invariants ---
  // High-evidence floor 1: SSRF probe or dangerous private IP
  if (urlIntel.urlsAnalyzed.some((u) => u.isSsrfBlocked)) {
    weightedScore = Math.max(weightedScore, 0.92);
  }

  // High-evidence floor 2: External threat feed verified malicious
  if (urlIntel.urlsAnalyzed.some((u) => u.threatFeedHits.length > 0)) {
    weightedScore = Math.max(weightedScore, 0.90);
  }

  // High-evidence floor 3: Dedicated High-Risk Alert Detection (UPI PIN, Card Numbers, Lottery)
  const isUpiPinTrap =
    /(enter (your )?(upi )?pin|pin daalein|pin dale|mpin|pin to receive|pin to credit|enter pin to accept|accept money request.*pin|cashback.*enter.*pin)/i.test(rawInput);

  const isCardNumberHarvest =
    /(16[- ]?digit (card|number)|card number|card details|cvv|expiry date|atm card number|debit card number|credit card number|enter (your )?card (number|details)|card.*expiry)/i.test(rawInput);

  const isLotteryScam =
    /(lottery|lucky draw|kbc lucky draw|won \d+ lakh|lottery winner|jackpot winner|whatsapp lucky draw|scratch card won|claim (lottery )?prize|unclaimed lottery|unclaimed prize)/i.test(rawInput);

  let specialAlert: ThreatReport['specialAlert'] = undefined;

  if (isUpiPinTrap) {
    weightedScore = Math.max(weightedScore, 0.92);
    specialAlert = {
      type: 'UPI_PIN_TRAP',
      title: 'UPI REVERSE-PAYMENT PIN TRAP DETECTED',
      goldenRule: 'NPCI GOLDEN RULE: You NEVER need to enter your UPI PIN to receive money. Entering your UPI PIN always DEDUCTS money from your bank account.',
      warningDetails: 'The sender is sending a "Collect Request" disguised as a refund or cashback. Reject the request immediately on PhonePe/GPay/Paytm.'
    };
  } else if (isCardNumberHarvest) {
    weightedScore = Math.max(weightedScore, 0.88);
    specialAlert = {
      type: 'CARD_NUMBER_HARVEST',
      title: 'CARD CREDENTIAL HARVESTING ATTEMPT',
      goldenRule: 'CARD SECURITY DIRECTIVE: Never enter your 16-digit card number, CVV, or card expiry date on links received via SMS, chat, or email.',
      warningDetails: 'Banks and payment gateways never ask for full card numbers or CVVs over external messages or unverified links.'
    };
  } else if (isLotteryScam) {
    weightedScore = Math.max(weightedScore, 0.88);
    specialAlert = {
      type: 'LOTTERY_SCAM',
      title: 'ADVANCE-FEE LOTTERY / LUCKY DRAW SCAM',
      goldenRule: 'LOTTERY FRAUD ALERT: You cannot win a lottery or draw you never entered. Genuine lotteries never demand an advance "registration fee" or "tax deposit" to release prizes.',
      warningDetails: 'Scammers use fake celebrity/brand names (KBC, WhatsApp, Car brands) to lure victims into paying escalating advance fees.'
    };
  }

  // High-evidence floor 4: Known banking triad (urgency + bank impersonation + KYC link)
  if (ruleThreatIndicators.urgencyLanguage && ruleThreatIndicators.credentialHarvesting && hasUrl) {
    weightedScore = Math.max(weightedScore, 0.86);
  }

  // Legitimate transaction ceiling: Clear bank debit with UPI/NEFT ref & no solicitation
  const isCleanBankDebit =
    /(debited with inr|debited by inr|spent on card|credited with inr)/i.test(rawInput) &&
    !/(otp|pin|password|kyc|click here|unblock|suspended)/i.test(rawInput);
  if (isCleanBankDebit && !hasUrl) {
    weightedScore = Math.min(weightedScore, 0.12);
  }

  const finalRiskScore = Math.min(100, Math.max(3, Math.round(weightedScore * 100)));

  // --- Honest Model Agreement & Confidence Calculation ---
  // Variance across active signals
  const mean = activeSignals.reduce((acc, s) => acc + s, 0) / activeSignals.length;
  const variance = activeSignals.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / activeSignals.length;
  const stdDev = Math.sqrt(variance);

  // Agreement: 1.0 when perfectly concordant, lower as layers diverge
  const layerAgreement = Number(Math.max(0.0, Math.min(1.0, 1.0 - stdDev * 2.2)).toFixed(3));
  const honestConfidence = Number((62.0 + layerAgreement * 35.0).toFixed(1));

  // Determine Severity & Verdict
  let verdict: ThreatVerdict = 'SAFE';
  let severity: SeverityLevel = 'LOW';

  if (finalRiskScore >= 78) {
    verdict = 'SCAM';
    severity = 'CRITICAL';
  } else if (finalRiskScore >= 58) {
    verdict = 'LIKELY_SCAM';
    severity = 'HIGH';
  } else if (finalRiskScore >= 35) {
    verdict = 'SUSPICIOUS';
    severity = 'MODERATE';
  } else if (finalRiskScore >= 18) {
    verdict = 'LIKELY_SAFE';
    severity = 'GUARDED';
  } else {
    verdict = 'SAFE';
    severity = 'LOW';
  }

  // Build Tactics & Evidence
  const tactics: { name: string; evidence: string }[] = [];
  if (llmAnalysis && llmAnalysis.tactics.length > 0) {
    tactics.push(...llmAnalysis.tactics);
  } else {
    // Derive from lower layers
    if (ruleThreatIndicators.urgencyLanguage) {
      tactics.push({ name: 'Urgency Pressure', evidence: 'Explicit temporal deadline to induce hasty action' });
    }
    if (ruleThreatIndicators.credentialHarvesting) {
      tactics.push({ name: 'Credential Harvest', evidence: 'Solicitation of private OTP, KYC, or PIN' });
    }
    for (const sig of textMl.topSignals) {
      tactics.push({ name: 'Linguistic Scam Pattern', evidence: `Matched indicator: "${sig}"` });
    }
  }

  // Indicators list
  const indicators: ThreatReport['indicators'] = [];
  for (const urlItem of urlIntel.urlsAnalyzed) {
    indicators.push({
      type: 'URL',
      value: urlItem.finalUrl,
      risk: urlItem.riskScore,
      note: urlItem.notes.join(', ') || 'Extracted URL'
    });
    indicators.push({
      type: 'DOMAIN',
      value: urlItem.hostname,
      risk: urlItem.riskScore,
      note: urlItem.domainAgeDays !== null ? `Domain age: ${urlItem.domainAgeDays} days` : 'Unverified registrar record'
    });
  }

  // Impersonation
  let impersonation: ThreatReport['impersonation'] = null;
  if (llmAnalysis?.impersonation) {
    impersonation = llmAnalysis.impersonation;
  } else if (ruleThreatIndicators.impersonationDetected) {
    impersonation = {
      claimedEntity: ruleThreatIndicators.impersonationDetected,
      verified: false,
      mismatchReason: 'Communication originates from unofficial delivery channel'
    };
  }

  // Kill Chain
  const killChain = llmAnalysis?.killChain || [
    'Victim receives deceptive lure with high urgency',
    'Victim clicks unverified link or enters phone call',
    'Attacker harvests Netbanking / OTP credentials or triggers remote APK',
    'Unauthorized fund siphoning or identity extortion'
  ];

  // Immediate Actions (India-specific)
  const defaultActions =
    finalRiskScore >= 58
      ? [
          'DO NOT CLICK ANY LINKS or call numbers provided in the message.',
          'Call National Cyber Crime Helpline: 1930 immediately if any money was transferred.',
          'Report incident on the official Citizen Cyber Crime Portal: https://cybercrime.gov.in',
          'Report suspect SMS/number to DoT Chakshu portal (Sanchar Saathi): https://sancharsaathi.gov.in',
          'Block debit/credit cards or freeze netbanking access via official bank mobile app.'
        ]
      : [
          'Maintain standard security vigilance.',
          'Never disclose OTP or UPI MPIN to anyone, even if they claim to represent your bank.',
          'Verify transaction statements exclusively through your official banking portal.'
        ];

  const immediateActions = llmAnalysis?.immediateActions ? [...llmAnalysis.immediateActions] : [...defaultActions];
  if (specialAlert) {
    immediateActions.unshift(`🚨 ${specialAlert.goldenRule}`);
  }

  // Potential loss
  const potentialLoss =
    llmAnalysis?.potentialLoss ||
    (specialAlert
      ? `${specialAlert.warningDetails} Immediate financial loss and identity compromise.`
      : finalRiskScore >= 58
      ? 'Complete siphoning of bank balance, compromise of Aadhaar/PAN identity, and unauthorized debt loans taken in your name.'
      : 'Low direct financial loss risk.');

  // Safer alternative
  const saferAlternative =
    llmAnalysis?.saferAlternative ||
    (specialAlert?.type === 'UPI_PIN_TRAP'
      ? 'Ask the sender to use your phone number / UPI ID to transfer directly. You do NOT need to accept any requests or enter any PIN to receive money.'
      : specialAlert?.type === 'CARD_NUMBER_HARVEST'
      ? 'Manage or unblock your card strictly inside your verified bank mobile app or netbanking portal.'
      : specialAlert?.type === 'LOTTERY_SCAM'
      ? 'Ignore and delete. Genuine state or corporate contests disburse prizes directly to verified winners with zero upfront fees.'
      : 'Login to your bank account directly by typing the official bank URL into your browser or opening the verified mobile banking application.');

  // False positive risk
  const falsePositiveRisk =
    llmAnalysis?.falsePositiveRisk ||
    (specialAlert
      ? 'Zero. No legitimate entity ever requires your UPI PIN, full card number/CVV, or lottery tax advance via messages.'
      : finalRiskScore >= 58
      ? 'Extremely low. Official Indian financial institutions never solicit KYC links or password resets via SMS shortcodes or third-party domains.'
      : 'Standard automated operational notification.');

  const threatReport: ThreatReport = {
    verdict,
    scamType: specialAlert
      ? specialAlert.title
      : llmAnalysis?.scamType || (finalRiskScore >= 58 ? 'Financial KYC / Phishing Solicitation' : 'Legitimate Notification'),
    attackerGoal: specialAlert
      ? (specialAlert.type === 'UPI_PIN_TRAP' ? 'Unauthorized UPI account drain via reverse-charge' : specialAlert.type === 'CARD_NUMBER_HARVEST' ? 'Card cloning and unauthorized CNP transactions' : 'Advance-fee extortion')
      : llmAnalysis?.attackerGoal || (finalRiskScore >= 58 ? 'Credential theft & unauthorized fund transfer' : 'None'),
    tactics,
    impersonation,
    indicators,
    layerScores: {
      rules: Math.round(sRules * 100),
      mlText: textMl.score,
      mlUrl: urlMl ? urlMl.score : 0,
      threatIntel: Math.round(sIntel * 100),
      llm: llmUsed ? Math.round(pLlm * 100) : 0
    },
    layerAgreement,
    killChain,
    potentialLoss,
    immediateActions,
    saferAlternative,
    falsePositiveRisk,
    llmUsed,
    modelVersions: {
      layer1: 'AEGIS-Rules-v3.4',
      layer2_text: 'Calibrated-TFIDF-LR-v2.4',
      layer2_url: 'GradientBoosting-Lexical-v2.4',
      layer3: 'RDAP-SSRF-Intel-v3.4',
      layer4: llmUsed ? 'gemini-3.8-flash' : 'OFFLINE-FALLBACK'
    },
    specialAlert
  };

  // Compile combined factors and reasons
  const factors: RiskFactor[] = [...ruleFactors];
  if (textMl.isScam) {
    factors.push({
      name: 'Layer 2 ML Text Model Detection',
      category: 'NLP',
      weight: Math.round(textMl.probability * 30),
      description: 'Scikit-learn calibrated classifier flagged scam semantic patterns with high probability',
      evidence: `P(Scam) = ${textMl.probability.toFixed(3)}; Signals: ${textMl.topSignals.join(', ')}`
    });
  }

  if (urlMl && urlMl.isPhishing) {
    factors.push({
      name: 'Layer 2 ML URL Model Detection',
      category: 'URL',
      weight: Math.round(urlMl.probability * 30),
      description: 'Lexical structural analysis detected deceptive URL anomalies',
      evidence: `P(Phishing) = ${urlMl.probability.toFixed(3)}`
    });
  }

  const reasons = [...ruleReasons];
  if (llmAnalysis?.reasoning) {
    reasons.unshift(llmAnalysis.reasoning);
  } else if (textMl.topSignals.length > 0) {
    reasons.push(`ML semantic engine identified high-risk indicators: ${textMl.topSignals.join(', ')}`);
  }

  const summary = llmAnalysis?.reasoning
    ? llmAnalysis.reasoning
    : finalRiskScore >= 58
    ? `AEGIS hybrid pipeline detected a high-probability financial threat (${threatReport.scamType}).`
    : `Communication assessed as ${verdict.replace('_', ' ')}. Zero coercive fraud markers detected.`;

  return {
    riskScore: finalRiskScore,
    severity,
    confidence: honestConfidence,
    verdict,
    threatReport,
    summary,
    reasons,
    factors
  };
}
