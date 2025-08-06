import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CartPage from '../page';
import type { Cart } from '../../components/cart/types';

// Mock the hooks
jest.mock('../../components/cart/hooks/useCart');
jest.mock('../../components/cart/hooks/useCartActions');

import { useCart } from '../../components/cart/hooks/useCart';
import { useCartActions } from '../../components/cart/hooks/useCartActions';

const mockUseCart = jest.mocked(useCart);
const mockUseCartActions = jest.mocked(useCartActions);

const mockCart: Cart = {
  id: 'gid://shopify/Cart/123',
  totalQuantity: 2,
  totalAmount: '300.00 EUR',
  checkoutUrl: 'https://checkout.shopify.com/123',
  lines: [
    {
      id: 'gid://shopify/CartLine/1',
      title: 'Château Margaux 2018',
      price: '150.00 EUR',
      quantity: 2,
      image: 'https://example.com/wine.jpg',
      availableForSale: true,
      quantityAvailable: 10,
    },
  ],
};

const mockCartActions = {
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
  loading: false,
  error: null,
};

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });
    
    mockUseCartActions.mockReturnValue(mockCartActions);
  });

  it('renders loading state', () => {
    mockUseCart.mockReturnValue({
      cart: null,
      loading: true,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    render(<CartPage />);

    expect(screen.getByText('Votre panier')).toBeInTheDocument();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('renders empty cart state', () => {
    mockUseCart.mockReturnValue({
      cart: null,
      loading: false,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    render(<CartPage />);

    expect(screen.getByText('Votre panier')).toBeInTheDocument();
    expect(screen.getByText('Votre panier est vide')).toBeInTheDocument();
    expect(screen.getByText('Continuer mes achats')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseCart.mockReturnValue({
      cart: null,
      loading: false,
      error: 'Erreur de connexion',
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    render(<CartPage />);

    expect(screen.getByText('Votre panier')).toBeInTheDocument();
    expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
    expect(screen.getByText('Continuer mes achats')).toBeInTheDocument();
  });

  it('renders cart with items', () => {
    render(<CartPage />);

    expect(screen.getByText('Votre panier')).toBeInTheDocument();
    expect(screen.getByText('Château Margaux 2018')).toBeInTheDocument();
    expect(screen.getByText('150.00 EUR')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('300.00 EUR')).toBeInTheDocument();
  });

  it('opens checkout URL when checkout button is clicked', async () => {
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true,
    });

    const user = userEvent.setup();
    render(<CartPage />);

    const checkoutButton = screen.getByText('Procéder au paiement');
    await user.click(checkoutButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://checkout.shopify.com/123',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('handles quantity change', async () => {
    const mockUpdateCart = jest.fn();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      updateCart: mockUpdateCart,
      refetch: jest.fn(),
    });

    mockCartActions.updateQuantity.mockResolvedValue(mockCart);

    const user = userEvent.setup();
    render(<CartPage />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    await user.click(increaseButton);

    expect(mockCartActions.updateQuantity).toHaveBeenCalledWith(
      'gid://shopify/CartLine/1',
      3
    );
    expect(mockUpdateCart).toHaveBeenCalledWith(mockCart);
  });

  it('handles item removal', async () => {
    const mockUpdateCart = jest.fn();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      updateCart: mockUpdateCart,
      refetch: jest.fn(),
    });

    mockCartActions.removeItem.mockResolvedValue(mockCart);

    const user = userEvent.setup();
    render(<CartPage />);

    const removeButton = screen.getByLabelText('Supprimer l\'article');
    await user.click(removeButton);

    expect(mockCartActions.removeItem).toHaveBeenCalledWith(
      'gid://shopify/CartLine/1'
    );
    expect(mockUpdateCart).toHaveBeenCalledWith(mockCart);
  });

  it('shows loading state during actions', () => {
    mockUseCartActions.mockReturnValue({
      ...mockCartActions,
      loading: true,
    });

    render(<CartPage />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    const removeButton = screen.getByLabelText('Supprimer l\'article');

    expect(increaseButton).toBeDisabled();
    expect(removeButton).toBeDisabled();
  });

  it('shows action error in empty state', () => {
    mockUseCart.mockReturnValue({
      cart: null,
      loading: false,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    mockUseCartActions.mockReturnValue({
      ...mockCartActions,
      error: 'Erreur lors de la mise à jour',
    });

    render(<CartPage />);

    expect(screen.getByText('Erreur lors de la mise à jour')).toBeInTheDocument();
  });

  it('displays stock warnings for low stock items', () => {
    const lowStockCart: Cart = {
      ...mockCart,
      lines: [
        {
          ...mockCart.lines[0],
          quantityAvailable: 5,
        },
      ],
    };

    mockUseCart.mockReturnValue({
      cart: lowStockCart,
      loading: false,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    render(<CartPage />);

    expect(screen.getByText('Plus que 5 en stock')).toBeInTheDocument();
  });

  it('displays out of stock message for unavailable items', () => {
    const outOfStockCart: Cart = {
      ...mockCart,
      lines: [
        {
          ...mockCart.lines[0],
          availableForSale: false,
        },
      ],
    };

    mockUseCart.mockReturnValue({
      cart: outOfStockCart,
      loading: false,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    render(<CartPage />);

    expect(screen.getByText('Rupture de stock')).toBeInTheDocument();
  });

  it('calculates total correctly', () => {
    const multiItemCart: Cart = {
      ...mockCart,
      lines: [
        {
          id: 'gid://shopify/CartLine/1',
          title: 'Wine 1',
          price: '25.50 EUR',
          quantity: 2,
          image: 'https://example.com/wine1.jpg',
          availableForSale: true,
          quantityAvailable: 10,
        },
        {
          id: 'gid://shopify/CartLine/2',
          title: 'Wine 2',
          price: '30.00 EUR',
          quantity: 1,
          image: 'https://example.com/wine2.jpg',
          availableForSale: true,
          quantityAvailable: 5,
        },
      ],
    };

    mockUseCart.mockReturnValue({
      cart: multiItemCart,
      loading: false,
      error: null,
      updateCart: jest.fn(),
      refetch: jest.fn(),
    });

    render(<CartPage />);

    // Total should be (25.50 * 2) + (30.00 * 1) = 81.00 EUR
    expect(screen.getByText('81.00 EUR')).toBeInTheDocument();
  });
}); 