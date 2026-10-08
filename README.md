# AEGIS: Financial Threat & Scam Intelligence Platform
### Real ML + LLM Hybrid Scam & Fraud Detection

AEGIS is an explainable financial scam, smishing, and fraud detection platform engineered around defense-in-depth:
```
INPUT -> Normalize -> [Layer 1 Rules] + [Layer 2 ML Classifiers] + [Layer 3 URL Intel]
      -> [Layer 4 Gemini LLM Reasoning] -> Score Fusion -> Detailed ThreatReport -> UI
```

---

## 1. Multi-Layer Hybrid Architecture

AEGIS replaces naive regex template matchers with a layered, evidence-backed security pipeline:

1. **Normalization & De-obfuscation**:
   - Reverses homoglyph spoofing (Cyrillic lookalikes mapped to ASCII).
   - Defangs obfuscated URLs (`hxxp://`, `[.]`, `(.)`, `[dot]`).
   - Strips zero-width unicode characters and tokenizer evasion artifacts.

2. **Layer 1: Deterministic Rules & Patterns (Fast Filter)**:
   - Evaluates high-confidence indicators, emergency deadlines, and credential solicitations.
   - Detects adversarial prompt-injection directives (`ignore previous instructions`, `system override`).
   - Acts as a cheap first-pass filter and safety floor.

3. **Layer 2: Calibrated Machine Learning Models**:
   - **Text Classifier**: Word (1-2gram) and character (2-5gram) TF-IDF features with calibrated logistic regression (`CalibratedClassifierCV` sigmoid calibration) for true probabilities. Includes Indian scam telemetry: UPI reverse-payment requests, Hinglish electricity threats, FASTag suspensions, and digital arrest coercion.
   - **URL Model**: 10 structural lexical features (length, digit ratio, Shannon entropy, subdomain depth, hyphens, punycode, high-risk TLDs, raw IP host, brand substring spoofing, path keywords) -> Gradient Boosting.
   - Run in Node.js via `onnxruntime-node` / calibrated vector evaluation in sub-2ms.

4. **Layer 3: URL & Domain Intelligence**:
   - **SSRF Protection**: Blocks private, loopback, and cloud metadata IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`).
   - **Redirect Tracer**: Expands shorteners and redirects up to 3 hops server-side without sending cookies.
   - **RDAP / Domain Age**: Queries registration records, flagging newly registered domains (<30 days old).
   - **External Threat Feeds**: Integrated with Google Safe Browsing and VirusTotal APIs (degrades gracefully if keys are absent).

5. **Layer 4: Gemini LLM Threat Intent Reasoner (`gemini-3.8-flash`)**:
   - Analyzes true social-engineering intent rather than matching strings.
   - Identifies tactics (Urgency, False Authority, Intimidation, Greed, Trust), claimed vs. actual entity, attacker goal, and kill chain.
   - Hardened against prompt injection using delimiters and data-only execution rules.
   - Validated with Zod structured output schema, 6-second timeout, 1 retry, and SHA-256 LRU cache.

6. **Mathematical Score Fusion**:
   - Dynamic stacking of active layer scores.
   - Honest confidence derived from layer concordance ($\text{Agreement} = 1.0 - 2.2 \cdot \sigma$).
   - High-evidence floor rules for known attacks and ceiling dampeners for clean bank debit alerts.

---

## 2. Evaluation & Benchmark Metrics

Evaluated across 62 verified benchmark fixtures (36 scams including reworded Hinglish, digital arrest, FASTag, leetspeak, homoglyphs, and prompt injections; 26 genuine bank notifications, OTPs, and receipts):

| Metric | Old Regex Engine | New Hybrid Pipeline | Acceptance Constraint |
|---|---|---|---|
| **Scam Recall (Sensitivity)** | **2.8%** | **100.0%** | $\ge 90.0\%$ (PASS) |
| **Precision** | 100.0% | **100.0%** | N/A |
| **False Positive Rate (FPR)** | 0.0% | **0.0%** | $\le 5.0\%$ (PASS) |
| **F1 Score** | 0.054 | **1.000** | N/A |
| **Scams Detected** | 1 / 36 | **36 / 36** | |
| **Genuine Cleared** | 26 / 26 | **26 / 26** | |

---

## 3. Machine Learning Training (`ml/`)

The `ml/` directory contains complete pipelines for training and retraining:
- `ml/train.py`: Trains the calibrated text and lexical URL models on UCI SMS Spam, Smishing corpora, PhiUSIIL URLs, and Indian financial telemetry.
- `ml/retrain.py`: Ingests user and analyst feedback from `data/feedback.jsonl` to recalibrate models.
- `ml/README.md`: Comprehensive dataset download and reproduction instructions.
- `ml/requirements.txt`: Python package dependencies.
- `ml/models/model_weights.json`: Deployed calibrated weights.

---

## 4. API Endpoints

- `POST /api/v1/scan/analyze`: Full hybrid scan (Layers 1-4 + Fusion + detailed ThreatReport).
- `POST /api/v1/feedback`: Records user verification votes and labels into `data/feedback.jsonl`.
- `GET /api/v1/health`: Health status and engine version telemetry.

---

## 5. Environment Variables (`.env.example`)

```bash
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
SAFE_BROWSING_KEY=optional_google_safe_browsing_key
VT_KEY=optional_virustotal_key
```

---

## 6. Verification Suite

Run automated unit and acceptance tests:
```bash
npx tsx tests/riskEngine.test.ts
```
