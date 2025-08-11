/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { WebVitalsTracker } from '../WebVitalsTracker';

jest.mock('../../../hooks/useWebVitals', () => ({
  useWebVitals: jest.fn()
}));

jest.mock('../../../utils/consent', () => ({
  consent: {
    getStatus: jest.fn(),
    onChange: jest.fn(),
    grant: jest.fn()
  }
}));

import { useWebVitals } from '../../../hooks/useWebVitals';
import { consent } from '../../../utils/consent';

const mockUseWebVitals = useWebVitals as jest.MockedFunction<typeof useWebVitals>;
const mockConsent = consent as jest.Mocked<typeof consent>;

describe('WebVitalsTracker', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWebVitals.mockReturnValue({ flush: jest.fn(), pendingCount: 0, isTracking: false });
    mockConsent.getStatus.mockReturnValue('pending');
    mockConsent.onChange.mockReturnValue(() => {});
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      writable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true
    });
  });

  it('should initialize useWebVitals hook with default props', () => {
    render(<WebVitalsTracker />);
    expect(mockUseWebVitals).toHaveBeenCalledTimes(1);
    expect(mockUseWebVitals).toHaveBeenCalledWith({
      debug: false,
      endpoint: undefined
    });
  });

  it('should not automatically grant consent in any environment', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true
    });
    render(<WebVitalsTracker />);
    expect(mockConsent.grant).not.toHaveBeenCalled();
  });

  it('should set up consent change listener', () => {
    render(<WebVitalsTracker />);
    expect(mockConsent.onChange).toHaveBeenCalledTimes(1);
    expect(mockConsent.onChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call flush when consent is denied', () => {
    const mockFlush = jest.fn();
    mockUseWebVitals.mockReturnValue({ flush: mockFlush, pendingCount: 0, isTracking: false });

    render(<WebVitalsTracker />);

    const onChangeCallback = mockConsent.onChange.mock.calls[0][0];
    onChangeCallback('denied');

    expect(mockFlush).toHaveBeenCalledTimes(1);
  });
});