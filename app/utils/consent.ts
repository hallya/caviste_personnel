export type ConsentStatus = 'granted' | 'denied' | 'pending';

const CONSENT_KEY = 'analytics_consent';

export const consent = {
  getStatus(): ConsentStatus {
    if (typeof window === 'undefined') return 'pending';

    const stored = localStorage.getItem(CONSENT_KEY);
    return (stored as ConsentStatus) || 'pending';
  },

  setStatus(status: ConsentStatus): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(CONSENT_KEY, status);
  },

  isGranted(): boolean {
    return this.getStatus() === 'granted';
  },

  grant(): void {
    this.setStatus('granted');
  },

  deny(): void {
    this.setStatus('denied');
  },

  onChange(callback: (status: ConsentStatus) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = () => {
      callback(this.getStatus());
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }
};