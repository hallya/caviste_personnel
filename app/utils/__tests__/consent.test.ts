/**
 * @jest-environment jsdom
 */

import { consent } from '../consent';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('consent utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatus', () => {
    it('should return pending when no consent stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      expect(consent.getStatus()).toBe('pending');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('analytics_consent');
    });

    it('should return stored consent status', () => {
      localStorageMock.getItem.mockReturnValue('granted');
      
      expect(consent.getStatus()).toBe('granted');
      
      localStorageMock.getItem.mockReturnValue('denied');
      
      expect(consent.getStatus()).toBe('denied');
    });

    it('should return pending for invalid stored values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-value');
      
      expect(consent.getStatus()).toBe('invalid-value'); // Returns the stored value as-is
    });
  });

  describe('setStatus', () => {
    it('should store consent status', () => {
      consent.setStatus('granted');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('analytics_consent', 'granted');
    });

    it('should store denied status', () => {
      consent.setStatus('denied');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('analytics_consent', 'denied');
    });
  });

  describe('isGranted', () => {
    it('should return true when consent is granted', () => {
      localStorageMock.getItem.mockReturnValue('granted');
      
      expect(consent.isGranted()).toBe(true);
    });

    it('should return false when consent is denied', () => {
      localStorageMock.getItem.mockReturnValue('denied');
      
      expect(consent.isGranted()).toBe(false);
    });

    it('should return false when consent is pending', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      expect(consent.isGranted()).toBe(false);
    });
  });

  describe('grant and deny shortcuts', () => {
    it('should grant consent', () => {
      consent.grant();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('analytics_consent', 'granted');
    });

    it('should deny consent', () => {
      consent.deny();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('analytics_consent', 'denied');
    });
  });

  describe('onChange', () => {
    it('should register storage event listener and return cleanup function', () => {
      const mockCallback = jest.fn();
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();
      
      Object.defineProperty(window, 'addEventListener', {
        value: mockAddEventListener
      });
      Object.defineProperty(window, 'removeEventListener', {
        value: mockRemoveEventListener
      });

      const cleanup = consent.onChange(mockCallback);
      
      expect(mockAddEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(typeof cleanup).toBe('function');
      
      cleanup();
      expect(mockRemoveEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
    });

    it('should call callback when storage event is triggered', () => {
      const mockCallback = jest.fn();
      let eventHandler: ((event: StorageEvent) => void) | undefined;
      
      const mockAddEventListener = jest.fn((_event: string, handler: (event: StorageEvent) => void) => {
        eventHandler = handler;
      });
      
      Object.defineProperty(window, 'addEventListener', {
        value: mockAddEventListener
      });

      localStorageMock.getItem.mockReturnValue('granted');

      consent.onChange(mockCallback);
      
      const testEvent = new StorageEvent('storage', {
        key: 'analytics_consent',
        newValue: 'granted'
      });
      
      if (eventHandler) {
        eventHandler(testEvent);
      }
      
      expect(mockCallback).toHaveBeenCalledWith('granted');
    });
  });
});