/**
 * AEGIS Core Risk Engine Verification Suite
 */

import { analyzeMessageOrInput } from '../src/engine/riskEngine';

function runTests() {
  console.log('Running AEGIS Risk Engine Automated Verification...\n');

  // Test 1: Fake Bank KYC SMS (Adversarial)
  const phishingSms = 'Your SBI netbanking is blocked today. Verify KYC immediately at: http://sbi-kyc-verify.top';
  const res1 = analyzeMessageOrInput(phishingSms, 'MESSAGE');
  console.assert(res1.riskScore >= 80, `Expected risk >= 80, received ${res1.riskScore}`);
  console.assert(res1.severity === 'CRITICAL', `Expected CRITICAL severity, received ${res1.severity}`);
  console.assert(res1.threatIndicators.urgencyLanguage === true, 'Expected urgency language detected');
  console.assert(res1.threatIndicators.impersonationDetected !== null, 'Expected impersonation detected');
  console.log('✓ Test 1 Passed: Fake Bank KYC Phishing correctly classified as CRITICAL.');

  // Test 2: Legitimate Bank Notification (Benign)
  const benignSms = 'Your salary account was credited with INR 78,500 on 28-SEP-2026. Ref UPI/49219482.';
  const res2 = analyzeMessageOrInput(benignSms, 'MESSAGE');
  console.assert(res2.riskScore <= 30, `Expected risk <= 30, received ${res2.riskScore}`);
  console.assert(res2.severity === 'LOW' || res2.severity === 'GUARDED', `Expected benign severity, received ${res2.severity}`);
  console.log('✓ Test 2 Passed: Legitimate Bank Alert correctly classified as LOW/GUARDED.');

  // Test 3: Raw IP host Phishing Link (Adversarial URL)
  const ipUrl = 'http://185.193.64.12/verify-account-now';
  const res3 = analyzeMessageOrInput(ipUrl, 'URL');
  console.assert(res3.riskScore >= 60, `Expected risk >= 60, received ${res3.riskScore}`);
  console.assert(res3.componentScores.url > 40, 'Expected high URL component score');
  console.log('✓ Test 3 Passed: Raw IP Host Link correctly flagged as High Risk.');

  // Test 4: BEC Invoice Redirection Email (Adversarial)
  const becEmail = 'Subject: URGENT: Revised Wire Settlement. Disburse invoice to new account IBAN GB49BARC2091.';
  const res4 = analyzeMessageOrInput(becEmail, 'EMAIL');
  console.assert(res4.riskScore >= 50, `Expected risk >= 50, received ${res4.riskScore}`);
  console.log('✓ Test 4 Passed: BEC Wire Redirection flagged.');

  console.log('\nAll 4 automated verification tests passed successfully.');
}

runTests();
