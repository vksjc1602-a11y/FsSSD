/**
 * AEGIS Developer & Enterprise API Platform
 * Interactive REST Console, OpenAPI schemas, and SDK code generation.
 */

import React, { useState } from 'react';
import { analyzeMessageOrInput } from '../../engine/riskEngine';
import { Terminal, Copy, Check, Play, Code, BookOpen } from 'lucide-react';

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/scan/message',
    description: 'Analyze SMS, chat, or communication transcripts for linguistic manipulation and brand impersonation.',
    sampleBody: {
      message: 'Your bank account will be blocked today. Complete KYC immediately at: http://sbi-kyc-verify.top',
      sender_id: 'VM-SBIIN',
      user_consent_granted: true
    }
  },
  {
    method: 'POST',
    path: '/api/v1/scan/url',
    description: 'Inspect domain age, lexical entropy, punycode spoofing, and IP host invariants.',
    sampleBody: {
      url: 'https://security-login-sbi-portal.xyz/auth',
      follow_redirects: true
    }
  },
  {
    method: 'POST',
    path: '/api/v1/scan/transaction',
    description: 'Evaluate payment instructions, UPI handles, and settlement velocity against mule networks.',
    sampleBody: {
      transaction_id: 'TXN-90214',
      amount: 49999,
      currency: 'INR',
      channel: 'UPI',
      recipient_id: 'MERCH-QIKPAY-88192',
      narrative: 'Urgent KYC Security Deposit Refundable Fee'
    }
  },
  {
    method: 'GET',
    path: '/api/v1/threats',
    description: 'Query live Indicators of Compromise (IoCs), malicious domains, and active fraud campaign clusters.',
    sampleBody: null
  }
];

export default function ApiPlatformView() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [requestPayload, setRequestPayload] = useState(JSON.stringify(API_ENDPOINTS[0].sampleBody, null, 2));
  const [responsePayload, setResponsePayload] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeLang, setActiveLang] = useState<'CURL' | 'PYTHON' | 'TS'>('CURL');

  const handleSelectEndpoint = (ep: typeof API_ENDPOINTS[0]) => {
    setSelectedEndpoint(ep);
    setRequestPayload(ep.sampleBody ? JSON.stringify(ep.sampleBody, null, 2) : '');
    setResponsePayload(null);
  };

  const handleExecuteRequest = () => {
    setIsExecuting(true);
    setResponsePayload(null);

    setTimeout(() => {
      let result;
      if (selectedEndpoint.path.includes('message')) {
        let msg = 'Sample message';
        try {
          msg = JSON.parse(requestPayload).message || msg;
        } catch {
          // fallback
        }
        result = analyzeMessageOrInput(msg, 'MESSAGE');
      } else if (selectedEndpoint.path.includes('url')) {
        let url = 'https://sbi-kyc-verify.top';
        try {
          url = JSON.parse(requestPayload).url || url;
        } catch {
          // fallback
        }
        result = analyzeMessageOrInput(url, 'URL');
      } else if (selectedEndpoint.path.includes('transaction')) {
        let narrative = 'Urgent fee';
        try {
          narrative = JSON.parse(requestPayload).narrative || narrative;
        } catch {
          // fallback
        }
        result = analyzeMessageOrInput(narrative, 'TRANSACTION');
      } else {
        result = {
          status: 'success',
          threat_count: 18,
          active_campaigns: ['CAMPAIGN-PHANTOM-KYC', 'CAMPAIGN-BEC-INVOICE'],
          telemetry_version: 'v3.4.1'
        };
      }

      setResponsePayload(JSON.stringify(result, null, 2));
      setIsExecuting(false);
    }, 280);
  };

  const generateSnippet = () => {
    const url = `https://api.aegis-security.io${selectedEndpoint.path}`;
    if (activeLang === 'CURL') {
      return `curl -X ${selectedEndpoint.method} "${url}" \\
  -H "Authorization: Bearer aegis_live_key_9941a8" \\
  -H "Content-Type: application/json"${selectedEndpoint.sampleBody ? ` \\\n  -d '${requestPayload.replace(/\n\s*/g, ' ')}'` : ''}`;
    }
    if (activeLang === 'PYTHON') {
      return `import requests

url = "${url}"
headers = {
    "Authorization": "Bearer aegis_live_key_9941a8",
    "Content-Type": "application/json"
}
payload = ${requestPayload || '{}'}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, json=payload, headers=headers)
print(response.json())`;
    }
    return `const response = await fetch("${url}", {
  method: "${selectedEndpoint.method}",
  headers: {
    "Authorization": "Bearer aegis_live_key_9941a8",
    "Content-Type": "application/json"
  },
  ${selectedEndpoint.sampleBody ? `body: JSON.stringify(${requestPayload})` : ''}
});
const data = await response.json();
console.log(data);`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#654536]/25 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#654536] uppercase tracking-wider mb-1">
          <span>REST API INTERFACE & SDK</span>
          <span>·</span>
          <span>ENTERPRISE GATEWAY INTEGRATION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#3A2418]">
          AEGIS API PLATFORM
        </h1>
        <p className="text-sm text-[#654536] mt-1 max-w-2xl">
          Integrate programmatic scam verification into checkout flows, SMS gateways, and core banking settlement pipelines.
        </p>
      </div>

      {/* Endpoints Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {API_ENDPOINTS.map((ep) => {
          const isSelected = selectedEndpoint.path === ep.path;
          return (
            <button
              key={ep.path}
              onClick={() => handleSelectEndpoint(ep)}
              className={`p-3 text-left border transition-colors ${
                isSelected
                  ? 'bg-[#3A2418] text-white border-[#3A2418]'
                  : 'bg-[#FFFFFF] text-[#3A2418] border-[#654536]/25 hover:bg-[#F5EFE4]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.2"
                  style={{
                    backgroundColor: isSelected ? '#B86F52' : '#E6D6C3',
                    color: isSelected ? '#FFFFFF' : '#3A2418'
                  }}
                >
                  {ep.method}
                </span>
                <span className="text-[10px] font-mono opacity-70">
                  v1
                </span>
              </div>
              <div className="text-xs font-mono font-bold truncate">
                {ep.path}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Workbench: Request / Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Request Panel (6 cols) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#654536]/15">
            <div>
              <span className="text-[10px] font-mono text-[#654536] uppercase block">
                ENDPOINT
              </span>
              <span className="text-xs font-mono font-bold text-[#3A2418]">
                {selectedEndpoint.method} {selectedEndpoint.path}
              </span>
            </div>
            <button
              onClick={handleExecuteRequest}
              disabled={isExecuting}
              className="px-4 py-1.5 text-xs font-mono bg-[#B86F52] text-white hover:bg-[#A35D42] disabled:opacity-50 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Play className="w-3.5 h-3.5" />
              <span>TEST CALL</span>
            </button>
          </div>

          <p className="text-xs text-[#654536]">
            {selectedEndpoint.description}
          </p>

          {/* Request Payload Editor */}
          {selectedEndpoint.sampleBody && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#654536] uppercase tracking-wider block">
                REQUEST BODY (JSON)
              </span>
              <textarea
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                rows={8}
                className="w-full p-3 bg-[#F5EFE4] border border-[#654536]/30 text-xs font-mono text-[#3A2418] focus:border-[#B86F52] focus:outline-none"
              />
            </div>
          )}

          {/* Code Snippets */}
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-[#654536]/15 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#654536] uppercase">CODE SNIPPET:</span>
                {(['CURL', 'PYTHON', 'TS'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`text-[10px] font-mono px-1.5 py-0.5 ${
                      activeLang === lang ? 'bg-[#3A2418] text-white' : 'text-[#654536]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(generateSnippet())}
                className="text-[10px] font-mono text-[#654536] hover:text-[#3A2418] flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3 h-3 text-[#B86F52]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#F5EFE4] border border-[#654536]/20 text-[11px] font-mono text-[#3A2418] overflow-x-auto max-h-40">
              {generateSnippet()}
            </pre>
          </div>
        </div>

        {/* Response Panel (6 cols) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#654536]/30 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#654536]/15">
            <span className="text-xs font-mono font-bold text-[#3A2418] uppercase">
              LIVE API RESPONSE
            </span>
            <span className="text-[10px] font-mono text-[#654536]">
              STATUS: {responsePayload ? '200 OK' : 'AWAITING DISPATCH'}
            </span>
          </div>

          {responsePayload ? (
            <div className="space-y-2">
              <pre className="p-3 bg-[#F5EFE4] border border-[#654536]/25 text-[11px] font-mono text-[#3A2418] overflow-x-auto max-h-[460px]">
                {responsePayload}
              </pre>
              <div className="text-[10px] font-mono text-[#654536]">
                Headers: <code className="text-[#3A2418]">x-aegis-request-id: req_94821</code> · <code className="text-[#3A2418]">x-model-latency: 24ms</code>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#F5EFE4]/50 border border-[#654536]/15 space-y-2">
              <Terminal className="w-6 h-6 text-[#654536] mx-auto opacity-60" />
              <p className="text-xs font-mono text-[#654536]">
                Click "TEST CALL" to dispatch an authenticated probe to the AEGIS risk engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
