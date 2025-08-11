'use client';

import { useEffect } from 'react';
import { useWebVitals } from '../../hooks/useWebVitals';
import { consent } from '../../utils/consent';

interface WebVitalsTrackerProps {
  debug?: boolean;
  endpoint?: string;
}

export function WebVitalsTracker({ 
  debug = process.env.NODE_ENV === 'development',
  endpoint 
}: WebVitalsTrackerProps) {
  const { flush } = useWebVitals({ debug, endpoint });

  useEffect(() => {
    if (debug) {
      const status = consent.getStatus();
      console.log('🍪 Analytics consent status:', status);
      
      if (status === 'granted') {
        console.log('✅ Web Vitals tracking active');
      } else {
        console.log('⏸️ Web Vitals tracking paused (awaiting consent)');
      }
    }

    const unsubscribe = consent.onChange((status) => {
      if (debug) {
        console.log('🍪 Consent changed:', status);
      }
      
      if (status === 'granted') {
        if (debug) {
          console.log('✅ Web Vitals tracking resumed');
        }
      } else if (status === 'denied') {
        flush();
        if (debug) {
          console.log('⏸️ Web Vitals tracking stopped');
        }
      }
    });

    return unsubscribe;
  }, [debug, flush]);

  return null;
}

export function ConsentManager() {
  const handleGrant = () => consent.grant();
  const handleDeny = () => consent.deny();

  if (consent.getStatus() === 'pending') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-sm">
            We use cookies to improve your experience and analyze site performance.
          </p>
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleDeny}
              className="px-3 py-1 text-sm border border-white/20 rounded hover:bg-white/10"
            >
              Decline
            </button>
            <button
              onClick={handleGrant}
              className="px-3 py-1 text-sm bg-white text-gray-900 rounded hover:bg-gray-100"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}