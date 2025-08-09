import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IndividualNotification from '../IndividualNotification';
import type { NotificationData } from '../types';


jest.mock('../NotificationContent', () => {
  return function MockNotificationContent({ notification }: { notification: NotificationData }) {
    return (
      <div data-testid="notification-content">
        <span data-testid="notification-type">{notification.type}</span>
        <span data-testid="notification-title">{notification.title}</span>
        <span data-testid="notification-message">{notification.message}</span>
      </div>
    );
  };
});

// Mock the CloseIcon component
jest.mock('../../design-system/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">✕</div>,
}));

describe('IndividualNotification', () => {
  const mockOnClose = jest.fn();
  
  const createMockNotification = (overrides: Partial<NotificationData> = {}): NotificationData => ({
    id: 'test-notification-id',
    type: 'success',
    title: 'Test Notification',
    message: 'This is a test notification message',
    timestamp: Date.now(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render notification with correct content', () => {
      const notification = createMockNotification({
        title: 'Success Title',
        message: 'Success message content',
        type: 'success',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByTestId('notification-content')).toBeInTheDocument();
      expect(screen.getByTestId('notification-title')).toHaveTextContent('Success Title');
      expect(screen.getByTestId('notification-message')).toHaveTextContent('Success message content');
      expect(screen.getByTestId('notification-type')).toHaveTextContent('success');
    });

    it('should render close button', () => {
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /fermer la notification/i });
      expect(closeButton).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should render with different notification types', () => {
      const types: Array<'success' | 'error' | 'loading'> = ['success', 'error', 'loading'];

      types.forEach((type) => {
        const { unmount } = render(
          <IndividualNotification
            notification={createMockNotification({ type, title: `${type} notification` })}
            onClose={mockOnClose}
          />
        );

        expect(screen.getByTestId('notification-type')).toHaveTextContent(type);
        expect(screen.getByTestId('notification-title')).toHaveTextContent(`${type} notification`);

        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const notification = createMockNotification({
        title: 'Important Alert',
        message: 'This requires attention',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const notificationElement = screen.getByRole('alert');
      expect(notificationElement).toHaveAttribute('aria-live', 'polite');
      expect(notificationElement).toHaveAttribute(
        'aria-label',
        'Important Alert: This requires attention'
      );
    });

    it('should have accessible close button label', () => {
      const notification = createMockNotification({
        title: 'Test Alert',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button', {
        name: 'Fermer la notification: Test Alert',
      });
      expect(closeButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button');
      
      // Tab to the close button
      await user.tab();
      expect(closeButton).toHaveFocus();

      // Press Enter to close
      await user.keyboard('{Enter}');
      expect(mockOnClose).toHaveBeenCalledWith(notification.id);
    });

    it('should support space key activation', async () => {
      const user = userEvent.setup();
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button');
      closeButton.focus();

      await user.keyboard(' ');
      expect(mockOnClose).toHaveBeenCalledWith(notification.id);
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const notification = createMockNotification({
        id: 'unique-notification-id',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledWith('unique-notification-id');
    });

    it('should handle multiple rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button');
      
      // Rapid clicks
      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
      expect(mockOnClose).toHaveBeenCalledWith(notification.id);
    });

    it('should show hover effects on close button', async () => {
      const user = userEvent.setup();
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button');
      
      await user.hover(closeButton);
      expect(closeButton).toHaveClass('hover:text-neutral-600');

      await user.unhover(closeButton);
      expect(closeButton).toHaveClass('text-neutral-400');
    });
  });

  describe('Visual Styling', () => {
    it('should apply correct CSS classes', () => {
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const notificationElement = screen.getByRole('alert');
      expect(notificationElement).toHaveClass(
        'bg-white',
        'rounded-lg',
        'shadow-lg',
        'border-l-4',
        'border-primary-600',
        'p-4',
        'transform',
        'transition-all',
        'duration-200',
        'ease-out'
      );
    });

    it('should have proper layout classes', () => {
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const contentWrapper = screen.getByRole('alert').querySelector('.flex.items-start.justify-between');
      expect(contentWrapper).toBeInTheDocument();

      const contentArea = contentWrapper?.querySelector('.flex.items-center.flex-1.min-w-0');
      expect(contentArea).toBeInTheDocument();
    });

    it('should apply transition classes for animations', () => {
      const notification = createMockNotification();

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('transition-colors');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles and messages', () => {
      const longTitle = 'A'.repeat(100);
      const longMessage = 'B'.repeat(500);
      
      const notification = createMockNotification({
        title: longTitle,
        message: longMessage,
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByTestId('notification-title')).toHaveTextContent(longTitle);
      expect(screen.getByTestId('notification-message')).toHaveTextContent(longMessage);
      
      // Check that content area has proper overflow handling
      const contentArea = screen.getByRole('alert').querySelector('.min-w-0');
      expect(contentArea).toBeInTheDocument();
    });

    it('should handle special characters in title and message', () => {
      const notification = createMockNotification({
        title: 'Special & Characters <script>',
        message: 'Message with "quotes" and \'apostrophes\'',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByTestId('notification-title')).toHaveTextContent('Special & Characters <script>');
      expect(screen.getByTestId('notification-message')).toHaveTextContent('Message with "quotes" and \'apostrophes\'');
    });

    it('should handle empty or minimal content', () => {
      const notification = createMockNotification({
        title: '',
        message: '',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Integration with NotificationContent', () => {
    it('should pass notification data to NotificationContent', () => {
      const notification = createMockNotification({
        type: 'error',
        title: 'Error Title',
        message: 'Error Message',
        id: 'error-id',
      });

      render(
        <IndividualNotification
          notification={notification}
          onClose={mockOnClose}
        />
      );

      const notificationContent = screen.getByTestId('notification-content');
      expect(notificationContent).toBeInTheDocument();
      
      // Verify all notification data is passed through
      expect(screen.getByTestId('notification-type')).toHaveTextContent('error');
      expect(screen.getByTestId('notification-title')).toHaveTextContent('Error Title');
      expect(screen.getByTestId('notification-message')).toHaveTextContent('Error Message');
    });
  });
});