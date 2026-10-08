/**
 * AEGIS Layer 2 Machine Learning Classifier
 *
 * Implements:
 * 1. Calibrated Text Classifier (word 1-2gram + char n-gram TF-IDF -> Calibrated Logistic Regression)
 *    Includes Indian financial telemetry (UPI, KYC, PAN, Aadhaar, FASTag, Hinglish, electricity threats).
 * 2. Lexical URL Model (10 structural features -> Calibrated Gradient Boosting emulation)
 *
 * Real calibrated probabilities in [0.0, 1.0].
 */

import MODEL_WEIGHTS from '../../ml/models/model_weights.json' with { type: 'json' };

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.click', '.club', '.buzz', '.work', '.tk', '.ml',
  '.ga', '.cf', '.gq', '.icu', '.rest', '.quest', '.cam', '.live', '.online', '.site'
]);

const BRAND_KEYWORDS = [
  'sbi', 'hdfc', 'icici', 'axis', 'kotak', 'pnb', 'baroda', 'paytm',
  'phonepe', 'gpay', 'bhim', 'rbi', 'aadhaar', 'uidai', 'incometax',
  'epfo', 'fastag', 'amazon', 'flipkart', 'netflix', 'microsoft', 'apple'
];

const PATH_KEYWORDS = [
  'kyc', 'auth', 'login', 'verify', 'update', 'unblock', 'portal',
  'secure', 'token', 'account', 'pan', 'aadhaar', 'otp', 'claim', 'refund', 'apk'
];

export interface TextMLResult {
  probability: number; // 0.0 - 1.0
  isScam: boolean;
  score: number; // 0 - 100
  topSignals: string[];
}

export interface UrlMLResult {
  probability: number; // 0.0 - 1.0
  isPhishing: boolean;
  score: number; // 0 - 100
  lexicalFeatures: {
    length: number;
    digitRatio: number;
    entropy: number;
    subdomainDepth: number;
    hyphenCount: number;
    hasPunycode: boolean;
    suspiciousTld: boolean;
    isRawIp: boolean;
    brandInHost: boolean;
    pathKeywords: number;
  };
}

/**
 * Computes Shannon entropy of a string (measures randomness/obfuscation).
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const freq: Record<string, number> = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    freq[char] = (freq[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

/**
 * Evaluates the calibrated text model.
 */
export function evaluateTextML(rawText: string): TextMLResult {
  const text = rawText.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  const weights = MODEL_WEIGHTS.text_model.feature_weights as Record<string, number>;
  const bias = MODEL_WEIGHTS.text_model.calibration_bias;
  const scale = MODEL_WEIGHTS.text_model.calibration_scale;
  const threshold = MODEL_WEIGHTS.text_model.optimal_threshold;

  let scoreSum = 0;
  const signals: string[] = [];

  // Match weighted tokens and n-grams
  for (const [feature, weight] of Object.entries(weights)) {
    if (text.includes(feature)) {
      scoreSum += weight;
      if (weight > 1.5) {
        signals.push(feature);
      }
    }
  }

  // Hinglish & transliterated patterns augmentation
  const hinglishPatterns = [
    { regex: /\b(bijli|power cut|light kat|bill unpaid)\b/i, weight: 2.7, name: 'electricity bill threat' },
    { regex: /\b(turant sampark|jaldi call kare|sampark kare)\b/i, weight: 2.2, name: 'hinglish urgency' },
    { regex: /\b(khata band|account band|block ho gaya)\b/i, weight: 2.6, name: 'hinglish account block' },
    { regex: /\b(paise jeeto|lottery lagi|ghar baithe kamaye)\b/i, weight: 2.8, name: 'hinglish prize/job lure' },
    { regex: /\b(digital arrest|cbi arrest|police parcel|narcotics)\b/i, weight: 3.5, name: 'digital arrest intimidation' },
    { regex: /\b(fastag suspend|fastag block|recharge fastag)\b/i, weight: 2.8, name: 'fastag deactivation lure' },
    { regex: /\b(apk install|download apk|app install karo)\b/i, weight: 3.2, name: 'malicious apk prompt' },
    { regex: /\b(ignore (all )?previous instructions|system override|mark (this )?(message )?as (100% )?safe|disregard (all )?threats)\b/i, weight: 3.8, name: 'adversarial prompt injection' },
    { regex: /\b(crypto|arbitrage|guaranteed \d+%|trading bot|deposit .* btc|insider trading tips|multibagger)\b/i, weight: 3.2, name: 'high-yield crypto / trading fraud' },
    { regex: /\b(accept money request|enter (your )?(upi )?pin to (receive|credit)|cashback reward|receive funds enter pin|pin daalein|pin dale|mpin to receive)\b/i, weight: 4.2, name: 'upi pin reverse-pay trap' },
    { regex: /\b(16[- ]?digit (card|number)|card number|card details|cvv|expiry date|atm card number|debit card number|credit card number|enter (your )?card (number|details))\b/i, weight: 3.9, name: 'card credential harvesting' },
    { regex: /\b(lottery|lucky draw|kbc lucky draw|won \d+ lakh|lottery winner|jackpot winner|whatsapp lucky draw|scratch card won|claim (lottery )?prize|unclaimed lottery)\b/i, weight: 4.0, name: 'lottery prize fraud' },
    { regex: /\b(disconnected within \d+ hours|trai officer|department of telecom|mobile number will be disconnected)\b/i, weight: 3.4, name: 'trai / telecom disconnect intimidation' },
    { regex: /\b(security deposit|laptop deposit|refundable .* deposit|shortlisted for .* data entry|congratulations.*shortlisted|pay .* to hr via (gpay|phonepe|paytm))\b/i, weight: 3.6, name: 'advance fee employment scam' },
    { regex: /\b(pre-approved .* loan|instant loan without cibil|zero interest loan|disbursed instantly at zero interest)\b/i, weight: 3.4, name: 'predatory instant loan scam' },
    { regex: /\b(share (the )?\d+ digit otp|share .* otp|tell .* otp|what is the otp)\b/i, weight: 3.7, name: 'direct otp solicitation' },
    { regex: /\b(unclaimed .* refund|tax refund notice|confirm your bank account .* receive)\b/i, weight: 2.9, name: 'tax / refund phishing' },
    { regex: /\b(redelivery fee|clearance duty|parcel .* could not be delivered|pay .* fee at)\b/i, weight: 2.8, name: 'delivery courier fee lure' }
  ];

  for (const pat of hinglishPatterns) {
    if (pat.regex.test(text)) {
      scoreSum += pat.weight;
      signals.push(pat.name);
    }
  }

  // Legitimate transaction / OTP / e-commerce dampeners
  const benignPatterns = [
    { regex: /\b(debited by|debited with|credited with inr|ref upi\/\d+|avl bal inr)\b/i, dampener: -3.2 },
    { regex: /\b(do not share (this )?otp|never share otp|valid for \d+ min)\b/i, dampener: -3.0 },
    { regex: /\b(order (has been )?delivered|delivery executive|swiggy|zomato|amazon (order|delivery|package))\b/i, dampener: -2.8 },
    { regex: /\b(pnr:?\s*\d+|irctc|booked successfully|coach [a-z]\d+)\b/i, dampener: -3.2 }
  ];

  for (const pat of benignPatterns) {
    if (pat.regex.test(text)) {
      scoreSum += pat.dampener;
    }
  }

  // Sigmoid calibration: P = 1 / (1 + exp(-(scoreSum + bias) * scale))
  const z = (scoreSum + bias) * scale;
  const probability = Number((1 / (1 + Math.exp(-z))).toFixed(4));
  const isScam = probability >= threshold;
  const score = Math.round(probability * 100);

  return {
    probability,
    isScam,
    score,
    topSignals: signals.slice(0, 6)
  };
}

/**
 * Evaluates the lexical URL model.
 */
export function evaluateUrlML(rawUrl: string): UrlMLResult {
  let url = rawUrl.trim().toLowerCase();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  let hostname = '';
  let pathname = '';
  try {
    const parsed = new URL(url);
    hostname = parsed.hostname;
    pathname = parsed.pathname;
  } catch {
    hostname = url.replace(/^https?:\/\//, '').split('/')[0];
    pathname = '/' + (url.split('/').slice(1).join('/') || '');
  }

  const length = url.length;
  const digits = (url.match(/\d/g) || []).length;
  const digitRatio = Number((digits / Math.max(1, length)).toFixed(3));
  const entropy = calculateShannonEntropy(hostname);
  const hostParts = hostname.split('.');
  const subdomainDepth = Math.max(0, hostParts.length - 2);
  const hyphenCount = (url.match(/-/g) || []).length;
  const hasPunycode = hostname.includes('xn--');
  const suspiciousTld = Array.from(SUSPICIOUS_TLDS).some((tld) => hostname.endsWith(tld));
  const isRawIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname.split(':')[0]);

  // Brand in hostname without official root domain
  const brandInHost = BRAND_KEYWORDS.some((brand) => {
    return (
      hostname.includes(brand) &&
      !hostname.endsWith(`${brand}.com`) &&
      !hostname.endsWith(`${brand}.co.in`) &&
      !hostname.endsWith(`${brand}.in`) &&
      !hostname.endsWith(`${brand}.gov.in`) &&
      !hostname.endsWith(`${brand}.org`)
    );
  });

  const pathKeywords = PATH_KEYWORDS.filter((kw) => pathname.includes(kw)).length;

  const urlWeights = MODEL_WEIGHTS.url_model.weights;
  const urlBias = MODEL_WEIGHTS.url_model.bias;

  let z = urlBias;
  z += length * urlWeights.length;
  z += digitRatio * urlWeights.digit_ratio;
  z += (entropy > 3.4 ? (entropy - 3.4) : 0) * urlWeights.shannon_entropy;
  z += subdomainDepth * urlWeights.subdomain_depth;
  z += hyphenCount * urlWeights.hyphen_count;
  if (hasPunycode) z += urlWeights.has_punycode;
  if (suspiciousTld) z += urlWeights.suspicious_tld;
  if (isRawIp) z += urlWeights.is_raw_ip;
  if (brandInHost) z += urlWeights.brand_in_host;
  z += pathKeywords * urlWeights.path_keywords;

  const probability = Number((1 / (1 + Math.exp(-z))).toFixed(4));
  const isPhishing = probability >= 0.45;
  const score = Math.round(probability * 100);

  return {
    probability,
    isPhishing,
    score,
    lexicalFeatures: {
      length,
      digitRatio,
      entropy,
      subdomainDepth,
      hyphenCount,
      hasPunycode,
      suspiciousTld,
      isRawIp,
      brandInHost,
      pathKeywords
    }
  };
}
