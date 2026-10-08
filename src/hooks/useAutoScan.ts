/**
 * AEGIS Auto-Scan React Hook (`useAutoScan`)
 *
 * Routes automated background and real-time input scans through
 * POST /api/v1/scan/analyze (Express server), enabling full ML + LLM hybrid scanning.
 * Implements client-side debounce, SHA de-duplication, and offline fallback to local risk engine.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ScanResult, ScanInputType } from '../types/index.ts';
import { analyzeMessageOrInput } from '../engine/riskEngine.ts';

interface UseAutoScanOptions {
  debounceMs?: number;
  type?: ScanInputType;
  forceDeep?: boolean;
  onResult?: (result: ScanResult) => void;
}

export function useAutoScan(options: UseAutoScanOptions = {}) {
  const { debounceMs = 450, type = 'MESSAGE', forceDeep = false, onResult } = options;

  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScannedHashRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeScan = useCallback(
    async (rawText: string, overrideForceDeep = forceDeep) => {
      const trimmed = rawText.trim();
      if (!trimmed || trimmed.length < 5) {
        setActiveResult(null);
        setIsScanning(false);
        return;
      }

      // De-duplicate: do not re-scan identical text
      if (lastScannedHashRef.current === trimmed) {
        return;
      }

      // Abort previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsScanning(true);
      setError(null);

      try {
        const response = await fetch('/api/v1/scan/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: trimmed,
            type,
            forceDeep: overrideForceDeep
          }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = (await response.json()) as ScanResult;
        lastScannedHashRef.current = trimmed;
        setActiveResult(data);
        if (onResult) onResult(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;

        console.warn('[AEGIS AutoScan] Server request failed, falling back to offline engine:', err.message);
        // Resilient client-side fallback
        const offlineResult = analyzeMessageOrInput(trimmed, type);
        lastScannedHashRef.current = trimmed;
        setActiveResult(offlineResult);
        if (onResult) onResult(offlineResult);
      } finally {
        setIsScanning(false);
      }
    },
    [type, forceDeep, onResult]
  );

  const triggerDebouncedScan = useCallback(
    (text: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        executeScan(text);
      }, debounceMs);
    },
    [executeScan, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return {
    result: activeResult,
    isScanning,
    error,
    scanInput: executeScan,
    triggerDebouncedScan
  };
}
