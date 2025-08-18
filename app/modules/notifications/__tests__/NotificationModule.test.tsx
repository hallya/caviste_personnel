import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  NotificationModule,
  useNotificationModule,
} from "../NotificationModule";
import { AppShell } from "../../../core/shell/AppShell";

const mockShowNotification = jest.fn();
const mockHideNotification = jest.fn();
const mockHideNotificationGroup = jest.fn();

jest.mock("../../../core/hooks/useSafeNotification", () => ({
  useSafeNotification: () => ({
    showNotification: mockShowNotification,
    hideNotification: mockHideNotification,
    hideNotificationGroup: mockHideNotificationGroup,
  }),
}));

function TestComponent() {
  const notificationModule = useNotificationModule();

  const handleShowNotification = () => {
    notificationModule.showNotification({
      type: "success",
      title: "Test Notification",
      message: "This is a test",
    });
  };

  const handleHideNotification = () => {
    notificationModule.hideNotification("test-id");
  };

  return (
    <div>
      <button onClick={handleShowNotification}>Show Notification</button>
      <button onClick={handleHideNotification}>Hide Notification</button>
    </div>
  );
}

describe("NotificationModule", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides notification module context to children", () => {
    render(
      <AppShell>
        <NotificationModule>
          <TestComponent />
        </NotificationModule>
      </AppShell>
    );

    expect(
      screen.getByRole("button", { name: "Show Notification" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Hide Notification" })
    ).toBeInTheDocument();
  });

  it("exposes showNotification functionality", async () => {
    render(
      <AppShell>
        <NotificationModule>
          <TestComponent />
        </NotificationModule>
      </AppShell>
    );

    const showButton = screen.getByRole("button", {
      name: "Show Notification",
    });

    await user.click(showButton);

    expect(mockShowNotification).toHaveBeenCalledWith({
      type: "success",
      title: "Test Notification",
      message: "This is a test",
    });
  });

  it("exposes hideNotification functionality", async () => {
    render(
      <AppShell>
        <NotificationModule>
          <TestComponent />
        </NotificationModule>
      </AppShell>
    );

    const hideButton = screen.getByRole("button", {
      name: "Hide Notification",
    });

    await user.click(hideButton);

    expect(mockHideNotification).toHaveBeenCalledWith("test-id");
  });



  it("throws error when useNotificationModule is used outside provider", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function OutsideComponent() {
      useNotificationModule();
      return <div>Outside</div>;
    }

    expect(() => render(<OutsideComponent />)).toThrow(
      "useNotificationModule must be used within NotificationModule"
    );

    consoleSpy.mockRestore();
  });

  
});
