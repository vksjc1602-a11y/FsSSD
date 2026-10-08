/**
 * AEGIS Comprehensive Benchmark & Acceptance Suite
 * Evaluates the 62 labelled benchmark fixtures across:
 * - Old regex engine (baseline)
 * - New ML + LLM Hybrid Pipeline
 *
 * Enforces strict production criteria:
 * - Recall on scams >= 90.0% (Throws if < 0.90)
 * - False Positive Rate on genuine communications <= 5.0% (Throws if > 0.05)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeMessageOrInput } from '../src/engine/riskEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_PATH = path.join(__dirname, 'fixtures', 'labelled_messages.json');

interface FixtureItem {
  id: string;
  label: 'SCAM' | 'SAFE';
  text: string;
  category: string;
}

// Emulation of the old strict regex engine logic for Before/After comparison
function evaluateOldRegexEngine(text: string): { isScam: boolean; score: number } {
  const urgency = /\b(blocked today|account blocked|immediately|within 24 hours)\b/i.test(text);
  const bank = /\b(sbi|state bank|hdfc|icici|axis bank|rbi)\b/i.test(text);
  const kyc = /\b(kyc verification|update kyc|verify kyc|pan card)\b/i.test(text);
  const otp = /\b(otp|cvv|pin|password)\b/i.test(text);

  if (urgency && bank && (kyc || otp)) {
    return { isScam: true, score: 85 };
  }
  if (bank && kyc) {
    return { isScam: true, score: 65 };
  }
  return { isScam: false, score: 20 };
}

export function runBenchmarkSuite() {
  console.log('='.repeat(78));
  console.log('       AEGIS BENCHMARK EVALUATION: OLD REGEX vs NEW HYBRID PIPELINE');
  console.log('='.repeat(78));

  const rawJson = fs.readFileSync(FIXTURES_PATH, 'utf-8');
  const fixtures: FixtureItem[] = JSON.parse(rawJson);

  const scams = fixtures.filter((f) => f.label === 'SCAM');
  const safe = fixtures.filter((f) => f.label === 'SAFE');

  console.log(`\nLoaded ${fixtures.length} verified benchmark samples:`);
  console.log(`  - Scams / Adversarial: ${scams.length}`);
  console.log(`  - Genuine / Benign:    ${safe.length}\n`);

  // --- 1. Evaluate Old Engine ---
  let oldTp = 0, oldFp = 0, oldTn = 0, oldFn = 0;
  for (const item of fixtures) {
    const res = evaluateOldRegexEngine(item.text);
    if (item.label === 'SCAM') {
      if (res.isScam) oldTp++;
      else oldFn++;
    } else {
      if (res.isScam) oldFp++;
      else oldTn++;
    }
  }

  const oldRecall = oldTp / (oldTp + oldFn);
  const oldPrecision = oldTp + oldFp > 0 ? oldTp / (oldTp + oldFp) : 0;
  const oldFpr = oldFp / (oldFp + oldTn);
  const oldF1 = 2 * (oldPrecision * oldRecall) / (oldPrecision + oldRecall || 1);

  // --- 2. Evaluate New Hybrid Pipeline ---
  let newTp = 0, newFp = 0, newTn = 0, newFn = 0;
  const failures: { id: string; expected: string; got: number; text: string }[] = [];

  for (const item of fixtures) {
    const res = analyzeMessageOrInput(item.text);
    // SCAM classification threshold >= 50
    const isPredictedScam = res.riskScore >= 50;

    if (item.label === 'SCAM') {
      if (isPredictedScam) {
        newTp++;
      } else {
        newFn++;
        failures.push({ id: item.id, expected: 'SCAM', got: res.riskScore, text: item.text });
      }
    } else {
      if (isPredictedScam) {
        newFp++;
        failures.push({ id: item.id, expected: 'SAFE', got: res.riskScore, text: item.text });
      } else {
        newTn++;
      }
    }
  }

  const newRecall = newTp / (newTp + newFn);
  const newPrecision = newTp + newFp > 0 ? newTp / (newTp + newFp) : 0;
  const newFpr = newFp / (newFp + newTn);
  const newF1 = 2 * (newPrecision * newRecall) / (newPrecision + newRecall || 1);
  const newAccuracy = (newTp + newTn) / fixtures.length;

  // --- Print Comparison Table ---
  console.log('| Metric                     | Old Engine (Regex) | New Hybrid Pipeline | Target Constraint |');
  console.log('|----------------------------|--------------------|---------------------|-------------------|');
  console.log(`| Scam Recall (Sensitivity)  | ${(oldRecall * 100).toFixed(1).padStart(16)}%  | ${(newRecall * 100).toFixed(1).padStart(17)}%  | >= 90.0%          |`);
  console.log(`| Precision                  | ${(oldPrecision * 100).toFixed(1).padStart(16)}%  | ${(newPrecision * 100).toFixed(1).padStart(17)}%  | N/A               |`);
  console.log(`| False Positive Rate (FPR)  | ${(oldFpr * 100).toFixed(1).padStart(16)}%  | ${(newFpr * 100).toFixed(1).padStart(17)}%  | <= 5.0%           |`);
  console.log(`| F1 Score                   | ${oldF1.toFixed(3).padStart(18)}  | ${newF1.toFixed(3).padStart(19)}  | N/A               |`);
  console.log(`| True Positives / Scams     | ${`${oldTp}/${scams.length}`.padStart(18)}  | ${`${newTp}/${scams.length}`.padStart(19)}  |                   |`);
  console.log(`| False Positives / Safe     | ${`${oldFp}/${safe.length}`.padStart(18)}  | ${`${newFp}/${safe.length}`.padStart(19)}  |                   |`);
  console.log(`| Overall Accuracy           | ${`${((oldTp + oldTn) / fixtures.length * 100).toFixed(1)}%`.padStart(18)}  | ${`${(newAccuracy * 100).toFixed(1)}%`.padStart(19)}  |                   |\n`);

  // Print Failures if any
  if (failures.length > 0) {
    console.warn(`Discrepant predictions (${failures.length}):`);
    for (const f of failures) {
      console.warn(`  [${f.id}] Expected ${f.expected}, received score ${f.got}: "${f.text.slice(0, 70)}..."`);
    }
  }

  // Real assertions that throw
  if (newRecall < 0.90) {
    throw new Error(
      `[ACCEPTANCE FAILED] Scam recall of ${(newRecall * 100).toFixed(2)}% is below the required 90.0% threshold!`
    );
  }

  if (newFpr > 0.05) {
    throw new Error(
      `[ACCEPTANCE FAILED] False positive rate of ${(newFpr * 100).toFixed(2)}% exceeds the maximum 5.0% threshold!`
    );
  }

  console.log('✓ [ACCEPTANCE PASSED] Recall >= 90.0% and FPR <= 5.0% criteria rigorously met.');
  console.log('='.repeat(78) + '\n');
}

if (process.argv[1] && process.argv[1].endsWith('run_benchmarks.ts')) {
  runBenchmarkSuite();
}
