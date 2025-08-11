import { NextRequest, NextResponse } from 'next/server';

interface ReceivedMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  url: string;
  userAgent: string;
  timestamp: number;
  sessionId: string;
}

interface WebVitalsPayload {
  metrics: ReceivedMetric[];
  meta: {
    timestamp: number;
    url: string;
    referrer: string;
    sessionId: string;
  };
}

function logMetric(metric: ReceivedMetric, meta: WebVitalsPayload['meta']) {
  const logData = {
    timestamp: new Date(meta.timestamp).toISOString(),
    sessionId: meta.sessionId,
    url: meta.url,
    referrer: meta.referrer,
    metric: {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta
    },
    userAgent: metric.userAgent.substring(0, 100)
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', logData);
    return;
  }

  console.log(JSON.stringify({
    level: 'info',
    service: 'web-vitals',
    ...logData
  }));
}

function validatePayload(body: unknown): body is WebVitalsPayload {
  if (!body || typeof body !== 'object') return false;
  
  const payload = body as Partial<WebVitalsPayload>;
  
  return (
    Array.isArray(payload.metrics) &&
    payload.meta !== undefined &&
    typeof payload.meta.timestamp === 'number' &&
    typeof payload.meta.url === 'string' &&
    typeof payload.meta.sessionId === 'string'
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!validatePayload(body)) {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    const { metrics, meta } = body;

    for (const metric of metrics) {
      if (!metric.name || typeof metric.value !== 'number') {
        console.warn('Invalid metric received:', metric);
        continue;
      }

      logMetric(metric, meta);
    }

    return NextResponse.json({
      success: true,
      processed: metrics.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error processing Web Vitals:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'web-vitals-analytics',
    status: 'healthy',
    timestamp: Date.now(),
    version: '1.0.0'
  });
}