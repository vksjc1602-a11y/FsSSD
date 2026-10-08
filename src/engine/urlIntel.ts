/**
 * AEGIS Layer 3 URL / Domain Intelligence Engine
 *
 * Capabilities:
 * 1. Extraction & de-obfuscation (hxxp, [.] dots, Unicode homoglyph normalization).
 * 2. SSRF-safe redirect tracer (3-hop limit, private/loopback/cloud-metadata IP blocking, zero cookies).
 * 3. Domain age & RDAP lookup (young domains <30 days flag).
 * 4. Optional Safe Browsing / VirusTotal integrations behind env keys with graceful fallbacks.
 */

export interface UrlInvestigationResult {
  rawUrl: string;
  deobfuscatedUrl: string;
  finalUrl: string;
  redirectHops: string[];
  hostname: string;
  domainAgeDays: number | null;
  registrationDate: string | null;
  isSsl: boolean;
  isSsrfBlocked: boolean;
  threatFeedHits: string[];
  riskScore: number; // 0 - 100
  notes: string[];
}

export interface Layer3UrlIntelSummary {
  urlsAnalyzed: UrlInvestigationResult[];
  aggregateUrlRisk: number; // 0 - 100
  highestRiskIndicator: string | null;
}

// Homoglyph map for common Unicode lookalikes
const HOMOGLYPH_MAP: Record<string, string> = {
  '\u0430': 'a', '\u0435': 'e', '\u043E': 'o', '\u0440': 'p',
  '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0456': 'i',
  '\u0458': 'j', '\u03BF': 'o', '\u03BD': 'v', '\u043A': 'k'
};

/**
 * Normalizes Unicode homoglyphs to ASCII equivalents.
 */
export function normalizeHomoglyphs(str: string): string {
  let out = '';
  for (const ch of str) {
    out += HOMOGLYPH_MAP[ch] || ch;
  }
  return out;
}

/**
 * De-obfuscates text containing defanged URLs.
 */
export function deobfuscateUrlsInText(text: string): string {
  let cleaned = normalizeHomoglyphs(text);

  // Replace hxxp://, hxxps://
  cleaned = cleaned.replace(/\bhxxps:\/\//gi, 'https://');
  cleaned = cleaned.replace(/\bhxxp:\/\//gi, 'http://');

  // Replace [.] or (.) or [dot] or (dot)
  cleaned = cleaned.replace(/\[\.\]|\(\.\)|\{\.\}|\[dot\]|\(dot\)/gi, '.');
  cleaned = cleaned.replace(/\[:\/\/\]|\(:\/\/\)/gi, '://');

  return cleaned;
}

/**
 * Checks if an IP or host belongs to a loopback, private, link-local, or cloud metadata network.
 */
export function isSsrfDangerousHost(hostname: string): boolean {
  const host = hostname.toLowerCase().split(':')[0];

  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === '169.254.169.254' || // AWS / GCP / Azure metadata
    host === 'metadata.google.internal'
  ) {
    return true;
  }

  // IPv4 range checks
  const ipMatch = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const [, aStr, bStr] = ipMatch;
    const a = parseInt(aStr, 10);
    const b = parseInt(bStr, 10);

    if (a === 127) return true; // 127.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // 169.254.0.0/16
    if (a === 0) return true;
  }

  return false;
}

/**
 * Extracts URLs from raw input text with de-obfuscation.
 */
export function extractDeobfuscatedUrls(rawInput: string): string[] {
  const clean = deobfuscateUrlsInText(rawInput);
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'()]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|info|site|online|live|in|co|cc|club|click|buzz|rest|quest|cam|tk|ml|ga|cf|gq|icu)[^\s<>"'()]*/gi;

  const matches = clean.match(urlRegex) || [];
  const normalized = matches.map((m) => {
    let u = m.replace(/[.,;:!?]+$/, ''); // Strip trailing punctuation
    if (!u.startsWith('http://') && !u.startsWith('https://')) {
      u = 'https://' + u;
    }
    return u;
  });

  return Array.from(new Set(normalized));
}

/**
 * Server-side SSRF-safe redirect follower with 3-hop limit.
 */
async function traceRedirects(initialUrl: string): Promise<{ finalUrl: string; hops: string[]; ssrfBlocked: boolean }> {
  let currentUrl = initialUrl;
  const hops: string[] = [initialUrl];
  let hopsCount = 0;

  while (hopsCount < 3) {
    try {
      const parsed = new URL(currentUrl);
      if (isSsrfDangerousHost(parsed.hostname)) {
        return { finalUrl: currentUrl, hops, ssrfBlocked: true };
      }

      // Fetch head only, no cookies, 2s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const resp = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AEGIS-ThreatIntel/3.4; +https://aegis.defense)',
          'Accept': '*/*'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check if redirect
      if (resp.status >= 300 && resp.status < 400) {
        const location = resp.headers.get('location');
        if (location) {
          const nextUrl = new URL(location, currentUrl).toString();
          hops.push(nextUrl);
          currentUrl = nextUrl;
          hopsCount++;
          continue;
        }
      }
      break;
    } catch {
      // Network error or aborted, stop tracing
      break;
    }
  }

  return { finalUrl: currentUrl, hops, ssrfBlocked: false };
}

/**
 * Queries RDAP for domain registration age.
 */
async function queryDomainAge(hostname: string): Promise<{ domainAgeDays: number | null; registrationDate: string | null }> {
  // Strip subdomains to find registrar root domain
  const parts = hostname.split('.');
  if (parts.length < 2) return { domainAgeDays: null, registrationDate: null };
  const rootDomain = parts.slice(-2).join('.');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(rootDomain)}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json() as { events?: { eventAction: string; eventDate: string }[] };
      const regEvent = data.events?.find((e) => e.eventAction === 'registration');
      if (regEvent && regEvent.eventDate) {
        const regDate = new Date(regEvent.eventDate);
        const ageMs = Date.now() - regDate.getTime();
        const ageDays = Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24)));
        return { domainAgeDays: ageDays, registrationDate: regEvent.eventDate };
      }
    }
  } catch {
    // Degrade gracefully on RDAP rate-limit or offline
  }

  return { domainAgeDays: null, registrationDate: null };
}

/**
 * Optional Google Safe Browsing and VirusTotal lookups.
 */
async function queryExternalThreatFeeds(url: string): Promise<string[]> {
  const hits: string[] = [];

  // 1. Google Safe Browsing
  const safeBrowsingKey = process.env.SAFE_BROWSING_KEY;
  if (safeBrowsingKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'aegis-scanner', clientVersion: '1.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }]
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json() as { matches?: unknown[] };
        if (data.matches && data.matches.length > 0) {
          hits.push('Google Safe Browsing: Flagged Social Engineering / Malware');
        }
      }
    } catch {
      // Degrades gracefully
    }
  }

  // 2. VirusTotal lookup
  const vtKey = process.env.VT_KEY;
  if (vtKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const urlId = Buffer.from(url).toString('base64url');
      const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
        headers: { 'x-apikey': vtKey },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json() as { data?: { attributes?: { last_analysis_stats?: { malicious?: number } } } };
        const malicious = data.data?.attributes?.last_analysis_stats?.malicious || 0;
        if (malicious > 0) {
          hits.push(`VirusTotal: ${malicious} security vendors flagged malicious`);
        }
      }
    } catch {
      // Degrades gracefully
    }
  }

  return hits;
}

/**
 * Investigates all extracted URLs for comprehensive Layer 3 intelligence.
 */
export async function investigateUrls(rawInput: string): Promise<Layer3UrlIntelSummary> {
  const extracted = extractDeobfuscatedUrls(rawInput);
  if (extracted.length === 0) {
    return {
      urlsAnalyzed: [],
      aggregateUrlRisk: 0,
      highestRiskIndicator: null
    };
  }

  const reports: UrlInvestigationResult[] = [];
  let maxRisk = 0;
  let topIndicator: string | null = null;

  for (const deobfuscatedUrl of extracted) {
    let hostname = '';
    let isSsl = false;
    try {
      const p = new URL(deobfuscatedUrl);
      hostname = p.hostname;
      isSsl = p.protocol === 'https:';
    } catch {
      hostname = deobfuscatedUrl.split('/')[0];
    }

    // SSRF-safe redirect tracing
    const { finalUrl, hops, ssrfBlocked } = await traceRedirects(deobfuscatedUrl);

    // Domain age lookup
    const { domainAgeDays, registrationDate } = await queryDomainAge(hostname);

    // Threat feed query
    const threatFeedHits = await queryExternalThreatFeeds(finalUrl);

    let risk = 0;
    const notes: string[] = [];

    if (ssrfBlocked) {
      risk += 90;
      notes.push('Target resolves to private or loopback IP range (SSRF exploit attempt)');
      topIndicator = 'SSRF Loopback Probe';
    }

    if (hops.length > 1) {
      risk += 25;
      notes.push(`Redirect chain detected (${hops.length - 1} hops): ${hops.join(' -> ')}`);
      if (!topIndicator) topIndicator = 'URL Shortener / Redirection Trail';
    }

    if (!isSsl) {
      risk += 20;
      notes.push('Lacks TLS transport security (HTTP plain-text)');
    }

    if (domainAgeDays !== null && domainAgeDays < 30) {
      risk += 35;
      notes.push(`Newly registered domain (${domainAgeDays} days old)`);
      if (!topIndicator) topIndicator = `Newly Registered Domain (${domainAgeDays}d)`;
    }

    if (threatFeedHits.length > 0) {
      risk += 50;
      notes.push(...threatFeedHits);
      topIndicator = threatFeedHits[0];
    }

    // Punycode check
    if (hostname.includes('xn--')) {
      risk += 40;
      notes.push('Uses Punycode homograph encoding (visual character spoofing)');
      if (!topIndicator) topIndicator = 'Punycode Homograph Spoofing';
    }

    const finalRisk = Math.min(100, Math.max(10, risk));
    if (finalRisk > maxRisk) {
      maxRisk = finalRisk;
    }

    reports.push({
      rawUrl: deobfuscatedUrl,
      deobfuscatedUrl,
      finalUrl,
      redirectHops: hops,
      hostname,
      domainAgeDays,
      registrationDate,
      isSsl,
      isSsrfBlocked: ssrfBlocked,
      threatFeedHits,
      riskScore: finalRisk,
      notes
    });
  }

  return {
    urlsAnalyzed: reports,
    aggregateUrlRisk: maxRisk,
    highestRiskIndicator: topIndicator
  };
}
