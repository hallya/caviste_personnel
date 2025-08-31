import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import IndividualNotification from "../IndividualNotification";
import type { NotificationData } from "../../types";

// Mock simplifié mais fonctionnel
jest.mock("@pkg/design-system", () => ({
  CloseIcon: () => <span data-testid="close-icon">×</span>,
}));

jest.mock("../NotificationContent", () => {
  return function MockNotificationContent({ notification }: { notification: NotificationData }) {
    return (
      <div data-testid="notification-content">
        <div data-testid="notification-title">{notification.title}</div>
        <div data-testid="notification-message">{notification.message}</div>
        <div data-testid="notification-type">{notification.type}</div>
      </div>
    );
  };
});

describe("IndividualNotification", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockOnClose = jest.fn();

  beforeEach(() => {
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const createMockProps = (
    overrides: Partial<{
      id: string;
      type: NotificationData["type"];
      title: string;
      message: string;
      autoClose?: boolean;
      autoCloseDelay?: number;
    }> = {}
  ) => ({
    id: "test-notification-id",
    type: "success" as const,
    title: "Test Notification",
    message: "This is a test notification message",
    onClose: mockOnClose,
    ...overrides,
  });

  describe("Rendering", () => {
    it("should render notification with correct content", () => {
      const props = createMockProps({
        title: "Success Title",
        message: "Success message content",
        type: "success",
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByTestId("notification-content")).toBeInTheDocument();
      expect(screen.getByTestId("notification-title")).toHaveTextContent("Success Title");
      expect(screen.getByTestId("notification-message")).toHaveTextContent("Success message content");
      expect(screen.getByTestId("notification-type")).toHaveTextContent("success");
    });

    it("should render close button", () => {
      const props = createMockProps();
      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole("button", {
        name: /fermer la notification/i,
      });
      expect(closeButton).toBeInTheDocument();
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("should render with different notification types", () => {
      const types = ["success", "error", "loading"] as const;

      types.forEach((type) => {
        const { unmount } = render(
          <IndividualNotification
            {...createMockProps({ type, title: `${type} notification` })}
          />
        );

        expect(screen.getByTestId("notification-type")).toHaveTextContent(type);
        expect(screen.getByTestId("notification-title")).toHaveTextContent(
          `${type} notification`
        );

        unmount();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA attributes", () => {
      const props = createMockProps({
        title: "Important Alert",
        message: "This requires attention",
      });

      render(<IndividualNotification {...props} />);

      const notificationElement = screen.getByRole("alert");
      expect(notificationElement).toHaveAttribute("aria-live", "polite");
      expect(notificationElement).toHaveAttribute(
        "aria-label",
        "Important Alert: This requires attention"
      );
    });

    it("should have accessible close button label", () => {
      const props = createMockProps({
        title: "Test Alert",
      });

      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole("button", {
        name: "Fermer la notification: Test Alert",
      });
      expect(closeButton).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const props = createMockProps();
      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole("button");

      await user.tab();
      expect(closeButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should support space key activation", async () => {
      const props = createMockProps();
      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole("button");
      closeButton.focus();

      await user.keyboard(" ");
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should have proper semantic structure", () => {
      const props = createMockProps({
        title: "Semantic Test",
        message: "Testing semantic structure",
      });

      render(<IndividualNotification {...props} />);

      const notification = screen.getByRole("alert");
      expect(notification).toBeInTheDocument();

      const closeButton = screen.getByRole("button");
      expect(closeButton).toHaveAttribute("aria-label");

      const content = screen.getByTestId("notification-content");
      expect(content).toBeInTheDocument();
    });

    it("should announce content to screen readers", () => {
      const props = createMockProps({
        title: "Screen Reader Test",
        message: "This should be announced",
      });

      render(<IndividualNotification {...props} />);

      const notification = screen.getByRole("alert");
      expect(notification).toHaveAttribute(
        "aria-label",
        "Screen Reader Test: This should be announced"
      );
      expect(notification).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("User Interactions", () => {
    it("should call onClose when close button is clicked", async () => {
      const props = createMockProps();
      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole("button");
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple rapid clicks gracefully", async () => {
      const props = createMockProps();
      render(<IndividualNotification {...props} />);

      const closeButton = screen.getByRole("button");

      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });
  });

  describe("Auto-close Behavior", () => {
    it("should auto-close after default delay", () => {
      const props = createMockProps({ autoClose: true });
      render(<IndividualNotification {...props} />);

      jest.advanceTimersByTime(5000);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should auto-close after custom delay", () => {
      const props = createMockProps({ 
        autoClose: true, 
        autoCloseDelay: 2000 
      });
      render(<IndividualNotification {...props} />);

      jest.advanceTimersByTime(1999);
      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not auto-close when autoClose is false", () => {
      const props = createMockProps({ autoClose: false });
      render(<IndividualNotification {...props} />);

      jest.advanceTimersByTime(10000);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should clear timer when component unmounts", () => {
      const props = createMockProps({ autoClose: true });
      const { unmount } = render(<IndividualNotification {...props} />);

      unmount();
      jest.advanceTimersByTime(5000);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long titles and messages", () => {
      const longTitle = "A".repeat(100);
      const longMessage = "B".repeat(500);
      const props = createMockProps({
        title: longTitle,
        message: longMessage,
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByTestId("notification-title")).toHaveTextContent(longTitle);
      expect(screen.getByTestId("notification-message")).toHaveTextContent(longMessage);
    });

    it("should handle special characters in title and message", () => {
      const props = createMockProps({
        title: "Special & Characters <script>",
        message: "Message with \"quotes\" and 'apostrophes'",
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByTestId("notification-title")).toHaveTextContent(
        "Special & Characters <script>"
      );
      expect(screen.getByTestId("notification-message")).toHaveTextContent(
        "Message with \"quotes\" and 'apostrophes'"
      );
    });

    it("should handle empty or minimal content", () => {
      const props = createMockProps({
        title: "",
        message: "",
      });

      render(<IndividualNotification {...props} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});