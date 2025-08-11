/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '../route';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

// Mock NextRequest for POST body
const mockRequest = (body: Record<string, unknown>, headers?: HeadersInit) => {
  return new NextRequest('http://localhost/api/analytics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
};

describe('/api/analytics/web-vitals', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set default environment for tests
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      writable: true
    });
  });

  afterEach(() => {
    // Reset environment
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true
    });
  });

  describe('POST', () => {
    const validPayload = {
      metrics: [
        {
          id: 'cls-1',
          name: 'CLS',
          value: 0.05,
          delta: 0.05,
          rating: 'good',
          navigationType: 'navigate',
          entries: [],
          url: 'http://localhost:3000',
          userAgent: 'Mozilla/5.0...',
          timestamp: Date.now(),
          sessionId: 'session-123',
        },
      ],
      meta: {
        timestamp: Date.now(),
        url: 'http://localhost:3000',
        referrer: '',
        sessionId: 'session-123',
      },
    };

    it('should process valid Web Vitals payload successfully', async () => {
      const req = mockRequest(validPayload);
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        processed: 1,
        timestamp: expect.any(Number)
      });

      // Should log the metric (production mode logs JSON string)
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('"name":"CLS"')
      );
    });

    it('should handle multiple metrics in one request', async () => {
      const multiMetricsPayload = {
        ...validPayload,
        metrics: [
          validPayload.metrics[0],
          {
            id: 'lcp-1',
            name: 'LCP',
            value: 1500,
            delta: 1500,
            rating: 'good',
            navigationType: 'navigate',
            entries: [],
            url: 'http://localhost:3000',
            userAgent: 'Mozilla/5.0...',
            timestamp: Date.now(),
            sessionId: 'session-123',
          },
        ],
      };
      const req = mockRequest(multiMetricsPayload);
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        processed: 2,
        timestamp: expect.any(Number)
      });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('"name":"CLS"')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('"name":"LCP"')
      );
    });

    it('should reject invalid payload structure', async () => {
      const invalidPayload = { metrics: 'not an array', meta: {} };
      const req = mockRequest(invalidPayload);
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid payload structure' });
    });

    it('should handle missing meta fields', async () => {
      const payloadWithoutMeta = { metrics: validPayload.metrics };
      const req = mockRequest(payloadWithoutMeta);
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid payload structure' });
    });

    it('should skip invalid individual metrics but process valid ones', async () => {
      const mixedPayload = {
        metrics: [
          validPayload.metrics[0],
          { id: 'invalid-metric' }, // Missing name, value
          { 
            id: 'valid-2', 
            name: 'FCP', 
            value: 1000, 
            delta: 1000, 
            rating: 'good', 
            navigationType: 'navigate', 
            entries: [],
            url: 'http://localhost:3000',
            userAgent: 'Mozilla/5.0...',
            timestamp: Date.now(),
            sessionId: 'session-123',
          },
        ],
        meta: validPayload.meta,
      };
      const req = mockRequest(mixedPayload);
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        processed: 3, // All 3 metrics are processed (invalid ones are skipped but still counted)
        timestamp: expect.any(Number)
      });
      expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid metric received:', { id: 'invalid-metric' });
    });

    it('should handle malformed JSON', async () => {
      const req = new NextRequest('http://localhost/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{',
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Internal server error'
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error processing Web Vitals:',
        expect.objectContaining({
          message: expect.stringContaining('Unexpected token')
        })
      );
    });

    it('should log structured data in production mode', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true
      });

      const req = mockRequest(validPayload);
      await POST(req);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('"level":"info"')
      );
    });
  });

  describe('GET', () => {
    it('should return health check response', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ 
        service: 'web-vitals-analytics',
        status: 'healthy',
        timestamp: expect.any(Number),
        version: '1.0.0'
      });
    });
  });
});