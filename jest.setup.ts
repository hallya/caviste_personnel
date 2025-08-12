import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
}));

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => null,
}));
