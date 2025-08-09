import { renderHook, act } from '@testing-library/react';
import { useNotificationGroup, useNotificationGroupLogic } from '../useNotificationGroup';
import { useNotification } from '../../../../contexts/NotificationContext';
import { NOTIFICATION_GROUPS } from '../../constants';
import type { NotificationData } from '../../types';

// Mock the notification context
jest.mock('../../../../contexts/NotificationContext');
const mockUseNotification = useNotification as jest.MockedFunction<typeof useNotification>;

// Mock timers for animation tests
jest.useFakeTimers();

describe('useNotificationGroup', () => {
  const mockShowNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotification.mockReturnValue({
      showNotification: mockShowNotification,
      hideNotification: jest.fn(),
      hideNotificationGroup: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('showGroupedNotification', () => {
    it('should call showNotification with correct parameters', () => {
      const { result } = renderHook(() => useNotificationGroup());

      act(() => {
        result.current.showGroupedNotification(
          'success',
          'Test Title',
          'Test Message',
          'test-group'
        );
      });

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Test Title',
        message: 'Test Message',
        groupId: 'test-group',
        autoClose: undefined,
        autoCloseDelay: undefined,
      });
    });

    it('should include options when provided', () => {
      const { result } = renderHook(() => useNotificationGroup());

      act(() => {
        result.current.showGroupedNotification(
          'error',
          'Error Title',
          'Error Message',
          'error-group',
          {
            autoClose: true,
            autoCloseDelay: 3000,
            id: 'custom-id',
            replaceId: 'replace-id',
          }
        );
      });

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error Title',
        message: 'Error Message',
        groupId: 'error-group',
        autoClose: true,
        autoCloseDelay: 3000,
        id: 'custom-id',
        replaceId: 'replace-id',
      });
    });

    it('should handle partial options', () => {
      const { result } = renderHook(() => useNotificationGroup());

      act(() => {
        result.current.showGroupedNotification(
          'loading',
          'Loading Title',
          'Loading Message',
          'loading-group',
          { autoClose: false }
        );
      });

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'loading',
        title: 'Loading Title',
        message: 'Loading Message',
        groupId: 'loading-group',
        autoClose: false,
        autoCloseDelay: undefined,
      });
    });
  });

  describe('showCartNotification', () => {
    it('should call showNotification with cart group ID', () => {
      const { result } = renderHook(() => useNotificationGroup());

      act(() => {
        result.current.showCartNotification(
          'success',
          'Cart Title',
          'Cart Message'
        );
      });

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Cart Title',
        message: 'Cart Message',
        groupId: NOTIFICATION_GROUPS.CART,
        autoClose: undefined,
        autoCloseDelay: undefined,
      });
    });

    it('should include options for cart notifications', () => {
      const { result } = renderHook(() => useNotificationGroup());

      act(() => {
        result.current.showCartNotification(
          'error',
          'Cart Error',
          'Cart Error Message',
          {
            autoClose: true,
            autoCloseDelay: 2000,
            id: 'cart-error-id',
          }
        );
      });

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Cart Error',
        message: 'Cart Error Message',
        groupId: NOTIFICATION_GROUPS.CART,
        autoClose: true,
        autoCloseDelay: 2000,
        id: 'cart-error-id',
      });
    });
  });

  describe('memoization', () => {
    it('should maintain function identity when showNotification is stable', () => {
      const { result, rerender } = renderHook(() => useNotificationGroup());
      
      const firstShowGrouped = result.current.showGroupedNotification;
      const firstShowCart = result.current.showCartNotification;

      rerender();

      expect(result.current.showGroupedNotification).toBe(firstShowGrouped);
      expect(result.current.showCartNotification).toBe(firstShowCart);
    });

    it('should update functions when showNotification changes', () => {
      const { result, rerender } = renderHook(() => useNotificationGroup());
      
      const firstShowGrouped = result.current.showGroupedNotification;

      // Change the mock to simulate context change
      const newMockShowNotification = jest.fn();
      mockUseNotification.mockReturnValue({
        showNotification: newMockShowNotification,
        hideNotification: jest.fn(),
        hideNotificationGroup: jest.fn(),
      });

      rerender();

      expect(result.current.showGroupedNotification).not.toBe(firstShowGrouped);
    });
  });
});

describe('useNotificationGroupLogic', () => {
  const mockOnCloseGroup = jest.fn();
  const mockOnCloseNotification = jest.fn();

  const createMockNotification = (id: string, type: 'success' | 'error' | 'loading' = 'success'): NotificationData => ({
    id,
    type,
    title: `Title ${id}`,
    message: `Message ${id}`,
    timestamp: Date.now(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notification stacking', () => {
    it('should limit visible notifications to maximum stack size', () => {
      const notifications = Array.from({ length: 8 }, (_, i) => 
        createMockNotification(`notification-${i}`)
      );

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      expect(result.current.visibleNotifications).toHaveLength(5); // MAX_STACKED_NOTIFICATIONS
      expect(result.current.visibleNotifications[0].id).toBe('notification-0');
      expect(result.current.visibleNotifications[4].id).toBe('notification-4');
    });

    it('should show all notifications when less than maximum', () => {
      const notifications = Array.from({ length: 3 }, (_, i) => 
        createMockNotification(`notification-${i}`)
      );

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      expect(result.current.visibleNotifications).toHaveLength(3);
    });
  });

  describe('expansion state', () => {
    it('should start in collapsed state', () => {
      const notifications = [createMockNotification('1'), createMockNotification('2')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      expect(result.current.isExpanded).toBe(false);
    });

    it('should expand when handleToggle is called with multiple notifications', () => {
      const notifications = [createMockNotification('1'), createMockNotification('2')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      act(() => {
        result.current.handleToggle();
      });

      expect(result.current.isExpanded).toBe(true);
    });

    it('should not expand with single notification', () => {
      const notifications = [createMockNotification('1')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      act(() => {
        result.current.handleToggle();
      });

      expect(result.current.isExpanded).toBe(false);
    });

    it('should not toggle when already expanded', () => {
      const notifications = [createMockNotification('1'), createMockNotification('2')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      // First expansion
      act(() => {
        result.current.handleToggle();
      });

      expect(result.current.isExpanded).toBe(true);

      // Try to toggle again while expanded
      act(() => {
        result.current.handleToggle();
      });

      expect(result.current.isExpanded).toBe(true); // Should remain expanded
    });

    it('should reset expansion state when not visible', () => {
      const notifications = [createMockNotification('1'), createMockNotification('2')];

      const { result, rerender } = renderHook(
        ({ isVisible }) =>
          useNotificationGroupLogic(
            notifications,
            mockOnCloseGroup,
            mockOnCloseNotification,
            isVisible
          ),
        { initialProps: { isVisible: true } }
      );

      // Expand first
      act(() => {
        result.current.handleToggle();
      });

      expect(result.current.isExpanded).toBe(true);

      // Make not visible
      rerender({ isVisible: false });

      expect(result.current.isExpanded).toBe(false);
    });
  });

  describe('close handlers', () => {
    it('should call onCloseGroup when handleClose is called', () => {
      const notifications = [createMockNotification('1')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      act(() => {
        result.current.handleClose();
      });

      expect(mockOnCloseGroup).toHaveBeenCalledTimes(1);
    });

    it('should call onCloseNotification when handleCloseNotification is called', () => {
      const notifications = [createMockNotification('test-id')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      act(() => {
        result.current.handleCloseNotification('test-id');
      });

      expect(mockOnCloseNotification).toHaveBeenCalledWith('test-id');
    });
  });

  describe('styling functions', () => {
    it('should provide getStackedStyle function', () => {
      const notifications = [createMockNotification('1'), createMockNotification('2')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      expect(typeof result.current.getStackedStyle).toBe('function');
      
      const firstStyle = result.current.getStackedStyle(0);
      expect(firstStyle).toHaveProperty('transform');
      expect(firstStyle).toHaveProperty('opacity');
      expect(firstStyle).toHaveProperty('zIndex');
    });

    it('should provide getExpandedStyle function', () => {
      const notifications = [createMockNotification('1'), createMockNotification('2')];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      expect(typeof result.current.getExpandedStyle).toBe('function');
      
      const firstStyle = result.current.getExpandedStyle(0);
      expect(firstStyle).toHaveProperty('transform');
      expect(firstStyle).toHaveProperty('opacity');
    });

    it('should apply different styles for different notification positions', () => {
      const notifications = [
        createMockNotification('1'),
        createMockNotification('2'),
        createMockNotification('3'),
      ];

      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          notifications,
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      const firstStyle = result.current.getStackedStyle(0);
      const secondStyle = result.current.getStackedStyle(1);
      
      expect(firstStyle.zIndex).toBeGreaterThan(secondStyle.zIndex as number);
      expect(firstStyle.opacity).toBeGreaterThan(secondStyle.opacity as number);
    });
  });

  describe('accessibility and responsiveness', () => {
    it('should handle empty notifications array', () => {
      const { result } = renderHook(() =>
        useNotificationGroupLogic(
          [],
          mockOnCloseGroup,
          mockOnCloseNotification,
          true
        )
      );

      expect(result.current.visibleNotifications).toHaveLength(0);
      expect(result.current.isExpanded).toBe(false);
    });

    it('should update when notifications change', () => {
      const initialNotifications = [createMockNotification('1')];

      const { result, rerender } = renderHook(
        ({ notifications }) =>
          useNotificationGroupLogic(
            notifications,
            mockOnCloseGroup,
            mockOnCloseNotification,
            true
          ),
        { initialProps: { notifications: initialNotifications } }
      );

      expect(result.current.visibleNotifications).toHaveLength(1);

      const updatedNotifications = [
        createMockNotification('1'),
        createMockNotification('2'),
      ];

      rerender({ notifications: updatedNotifications });

      expect(result.current.visibleNotifications).toHaveLength(2);
    });
  });
});