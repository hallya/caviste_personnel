import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IndividualNotification from '../IndividualNotification';
import type { NotificationData } from '../types';
import { NOTIFICATION_TYPES } from '../types';

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

jest.mock('../../design-system/icons', () => ({
  CloseIcon: () => <div data-testid="close-icon">✕</div>,
}));

describe('IndividualNotification', () => {
  const mockOnClose = jest.fn();
  
  const createMockProps = (overrides: Partial<{
    id: string;
    type: NotificationData['type'];
    title: string;
    message: string;
  }> = {}) => ({
    id: 'test-notification-id',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Test Notification',
    message: 'This is a test notification message',
    onClose: mockOnClose,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render notification with correct content', () => {
      const props = createMockProps({
        title: 'Success Title',
        message: 'Success message content',
        type: NOTIFICATION_TYPES.SUCCESS,
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByTestId('notification-content')).toBeInTheDocument();
      expect(screen.getByTestId('notification-title')).toHaveTextContent('Success Title');
      expect(screen.getByTestId('notification-message')).toHaveTextContent('Success message content');
      expect(screen.getByTestId('notification-type')).toHaveTextContent('success');
    });

    it('should render close button', () => {
      const props = createMockProps();

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button', { name: /fermer la notification/i });
      expect(closeButton).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should render with different notification types', () => {
      const types = [NOTIFICATION_TYPES.SUCCESS, NOTIFICATION_TYPES.ERROR, NOTIFICATION_TYPES.LOADING];

      types.forEach((type) => {
        const { unmount } = render(
          <IndividualNotification {...createMockProps({ type, title: `${type} notification` })} />
        );

        expect(screen.getByTestId('notification-type')).toHaveTextContent(type);
        expect(screen.getByTestId('notification-title')).toHaveTextContent(`${type} notification`);

        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const props = createMockProps({
        title: 'Important Alert',
        message: 'This requires attention',
      });

      render(<IndividualNotification {...props} />);

      const notificationElement = screen.getByRole('alert');
      expect(notificationElement).toHaveAttribute('aria-live', 'polite');
      expect(notificationElement).toHaveAttribute(
        'aria-label',
        'Important Alert: This requires attention'
      );
    });

    it('should have accessible close button label', () => {
      const props = createMockProps({
        title: 'Test Alert',
      });

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button', {
        name: 'Fermer la notification: Test Alert',
      });
      expect(closeButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const props = createMockProps();

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button');
      
      await user.tab();
      expect(closeButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should support space key activation', async () => {
      const user = userEvent.setup();
      const props = createMockProps();

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button');
      closeButton.focus();

      await user.keyboard(' ');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const props = createMockProps({
        id: 'unique-notification-id',
      });

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle multiple rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      const props = createMockProps();

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button');
      
      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should show hover effects on close button', async () => {
      const user = userEvent.setup();
      const props = createMockProps();

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole('button');
      
      await user.hover(closeButton);
      expect(closeButton).toHaveClass('hover:text-neutral-600');

      await user.unhover(closeButton);
      expect(closeButton).toHaveClass('text-neutral-400');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles and messages', () => {
      const longTitle = 'A'.repeat(100);
      const longMessage = 'B'.repeat(500);
      
      const props = createMockProps({
        title: longTitle,
        message: longMessage,
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByTestId('notification-title')).toHaveTextContent(longTitle);
      expect(screen.getByTestId('notification-message')).toHaveTextContent(longMessage);
      
      const contentArea = screen.getByTestId('notification-content');
      expect(contentArea).toBeInTheDocument();
    });

    it('should handle special characters in title and message', () => {
      const props = createMockProps({
        title: 'Special & Characters <script>',
        message: 'Message with "quotes" and \'apostrophes\'',
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByTestId('notification-title')).toHaveTextContent('Special & Characters <script>');
      expect(screen.getByTestId('notification-message')).toHaveTextContent('Message with "quotes" and \'apostrophes\'');
    });

    it('should handle empty or minimal content', () => {
      const props = createMockProps({
        title: '',
        message: '',
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Integration with NotificationContent', () => {
    it('should pass notification data to NotificationContent', () => {
      const props = createMockProps({
        type: NOTIFICATION_TYPES.ERROR,
        title: 'Error Title',
        message: 'Error Message',
        id: 'error-id',
      });

      render(<IndividualNotification {...props} />);

      const notificationContent = screen.getByTestId('notification-content');
      expect(notificationContent).toBeInTheDocument();
      
      // Verify all notification data is passed through
      expect(screen.getByTestId('notification-type')).toHaveTextContent('error');
      expect(screen.getByTestId('notification-title')).toHaveTextContent('Error Title');
      expect(screen.getByTestId('notification-message')).toHaveTextContent('Error Message');
    });
  });
});
