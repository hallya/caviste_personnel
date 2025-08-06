import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CartNotification from '../CartNotification';

const mockOnClose = jest.fn();

const defaultProps = {
  type: 'success' as const,
  title: 'Produit ajouté',
  message: 'Château Margaux ajouté au panier',
  onClose: mockOnClose,
  autoClose: false,
};

describe('CartNotification', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notification with correct content', () => {
    render(<CartNotification {...defaultProps} />);

    expect(screen.getByText('Produit ajouté')).toBeInTheDocument();
    expect(screen.getByText('Château Margaux ajouté au panier')).toBeInTheDocument();
  });

  it('applies correct styling for success type', () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('border-[#7a2d2d]');
  });

  it('applies correct styling for error type', () => {
    render(<CartNotification {...defaultProps} type="error" />);

    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('border-[#7a2d2d]');
  });

  it('shows checkout button when checkoutUrl is provided and type is success', () => {
    render(<CartNotification {...defaultProps} checkoutUrl="https://checkout.shopify.com" />);

    expect(screen.getByText('Voir le panier et commander')).toBeInTheDocument();
    expect(screen.getByText('Continuer mes achats')).toBeInTheDocument();
  });

  it('does not show checkout buttons when type is error', () => {
    render(
      <CartNotification
        {...defaultProps}
        type="error"
        checkoutUrl="https://checkout.shopify.com"
      />
    );

    expect(screen.queryByText('Voir le panier et commander')).not.toBeInTheDocument();
    expect(screen.queryByText('Continuer mes achats')).not.toBeInTheDocument();
  });

  it('does not show checkout buttons when checkoutUrl is not provided', () => {
    render(<CartNotification {...defaultProps} />);

    expect(screen.queryByText('Voir le panier et commander')).not.toBeInTheDocument();
    expect(screen.queryByText('Continuer mes achats')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    render(<CartNotification {...defaultProps} />);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when "Continuer mes achats" button is clicked', async () => {
    render(<CartNotification {...defaultProps} checkoutUrl="https://checkout.shopify.com" />);

    const continueButton = screen.getByText('Continuer mes achats');
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('opens checkout URL in new tab when checkout button is clicked', async () => {
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true,
    });

    render(<CartNotification {...defaultProps} checkoutUrl="https://checkout.shopify.com" />);

    const checkoutButton = screen.getByText('Voir le panier et commander');
    await user.click(checkoutButton);

    expect(mockOpen).toHaveBeenCalledWith('https://checkout.shopify.com', '_blank');
  });

  it('auto-closes notification when autoClose is true', async () => {
    jest.useFakeTimers();

    render(<CartNotification {...defaultProps} autoClose={true} autoCloseDelay={1000} />);

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });

    jest.useRealTimers();
  });

  it('does not auto-close when autoClose is false', async () => {
    jest.useFakeTimers();

    render(<CartNotification {...defaultProps} autoClose={false} autoCloseDelay={1000} />);

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    }, { timeout: 2000 });

    jest.useRealTimers();
  });

  it('has correct accessibility attributes', () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole('alert');
    expect(notification).toBeInTheDocument();
  });

  it('renders with correct positioning classes', () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('fixed', 'top-4', 'right-4');
  });

  it('shows success icon for success type', () => {
    render(<CartNotification {...defaultProps} />);

    const successIcon = screen.getByTestId('success-icon');
    expect(successIcon).toBeInTheDocument();
  });

  it('shows error icon for error type', () => {
    render(<CartNotification {...defaultProps} type="error" />);

    const errorIcon = screen.getByTestId('error-icon');
    expect(errorIcon).toBeInTheDocument();
  });

  it('applies correct animation classes', () => {
    render(<CartNotification {...defaultProps} />);

    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('transform', 'transition-all', 'duration-300');
  });

  it('renders title with bold styling', () => {
    render(<CartNotification {...defaultProps} />);

    const title = screen.getByText('Produit ajouté');
    expect(title).toHaveClass('font-bold');
  });
}); 