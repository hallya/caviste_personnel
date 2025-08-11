'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Metric } from 'web-vitals';
import { consent } from '../utils/consent';

interface WebVitalsConfig {
  endpoint?: string;
  debug?: boolean;
  batchDelay?: number;
  flushOnPageChange?: boolean;
}

interface VitalMetric extends Metric {
  url: string;
  userAgent: string;
  timestamp: number;
  sessionId: string;
}

export function useWebVitals(config: WebVitalsConfig = {}) {
  const {
    endpoint = '/api/analytics/web-vitals',
    debug = process.env.NODE_ENV === 'development',
    batchDelay = 1000,
    flushOnPageChange = true
  } = config;

  const metricsBuffer = useRef<VitalMetric[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionId = useRef<string>('');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    sessionId.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const sendMetrics = useCallback(async (metrics: VitalMetric[]) => {
    if (!consent.isGranted() || metrics.length === 0) return;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          meta: {
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer,
            sessionId: sessionId.current
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Analytics endpoint responded with ${response.status}`);
      }
    } catch (error) {
      if (debug) {
        console.warn('Failed to send Web Vitals:', error);
      }
    }
  }, [endpoint, debug]);

  const bufferMetric = useCallback((metric: Metric) => {
    if (!sessionId.current) return;

    const enrichedMetric: VitalMetric = {
      ...metric,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: sessionId.current
    };

    metricsBuffer.current.push(enrichedMetric);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const toSend = [...metricsBuffer.current];
      metricsBuffer.current = [];
      sendMetrics(toSend);
    }, batchDelay);
  }, [batchDelay, sendMetrics]);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const toSend = [...metricsBuffer.current];
    metricsBuffer.current = [];
    sendMetrics(toSend);
  }, [sendMetrics]);

  const startTracking = useCallback(async () => {
    if (isTracking) return;

    try {
      const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
      
      onCLS(bufferMetric);
      onFCP(bufferMetric);
      onLCP(bufferMetric);
      onTTFB(bufferMetric);
      onINP(bufferMetric);

      setIsTracking(true);
    } catch (error) {
      if (debug) {
        console.error('Failed to load web-vitals:', error);
      }
    }
  }, [bufferMetric, debug, isTracking]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    const handleConsentChange = (status: string) => {
      if (status === 'granted' && !isTracking) {
        startTracking();
      } else if (status === 'denied' && isTracking) {
        flush();
        stopTracking();
      }
    };

    if (consent.isGranted() && !isTracking) {
      startTracking();
    }

    const unsubscribe = consent.onChange(handleConsentChange);

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      flush();
    };
  }, [startTracking, stopTracking, flush, isTracking]);

  useEffect(() => {
    if (!flushOnPageChange) return;

    const handleBeforeUnload = () => {
      flush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flush, flushOnPageChange]);

  return {
    flush,
    pendingCount: metricsBuffer.current.length,
    isTracking
  };
}