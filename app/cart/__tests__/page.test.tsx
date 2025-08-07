import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CartPage from '../page';
import type { Cart } from '../../components/cart/types';
import { CartProvider } from '../../contexts/CartContext';

jest.mock('../../components/cart/hooks/useCart');

import { useCart } from '../../components/cart/hooks/useCart';

const mockUseCart = jest.mocked(useCart);

const mockCart: Cart = {
  id: "gid://shopify/Cart/123",
  totalQuantity: 2,
  totalAmount: "300.00 EUR",
  checkoutUrl: "https://checkout.shopify.com/123",
  lines: [
    {
      id: "gid://shopify/CartLine/1",
      title: "Château Margaux 2018",
      price: "150.00 EUR",
      unitPrice: 150.00,
      currency: "EUR",
      lineTotal: "300.00 EUR",
      quantity: 2,
      image: "https://example.com/wine.jpg",
      availableForSale: true,
      quantityAvailable: 10,
      variantId: "gid://shopify/ProductVariant/456",
    },
  ],
};

const mockUpdateQuantity = jest.fn();
const mockRemoveItem = jest.fn();
const mockUpdateCart = jest.fn();
const mockRefetch = jest.fn();
const mockAddToCart = jest.fn();

const createMockUseCartReturn = (overrides: Partial<ReturnType<typeof useCart>> = {}) => ({
  cart: mockCart,
  loading: false,
  error: null,
  updateCart: mockUpdateCart,
  refetch: mockRefetch,
  updateQuantity: mockUpdateQuantity,
  removeItem: mockRemoveItem,
  addToCart: mockAddToCart,
  actionLoading: false,
  actionError: null,
  ...overrides,
});

const renderCartPage = () => render(
  <CartProvider>
    <CartPage />
  </CartProvider>
);

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.mockReturnValue(createMockUseCartReturn());
  });

  describe('Rendering States', () => {
    it('renders loading state', () => {
      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: null,
        loading: true,
      }));

      renderCartPage();

      expect(screen.getByText('Votre panier')).toBeInTheDocument();
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });

    it('renders empty cart state', () => {
      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: null,
      }));

      renderCartPage();

      expect(screen.getByText('Votre panier')).toBeInTheDocument();
      expect(screen.getByText('Votre panier est vide')).toBeInTheDocument();
      expect(screen.getByText('Continuer mes achats')).toBeInTheDocument();
    });

    it('renders error state', () => {
      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: null,
        error: 'Erreur de connexion',
      }));

      renderCartPage();

      expect(screen.getByText('Votre panier')).toBeInTheDocument();
      expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
      expect(screen.getByText('Continuer mes achats')).toBeInTheDocument();
    });

    it('renders cart with items', () => {
      renderCartPage();

      expect(screen.getByText('Votre panier')).toBeInTheDocument();
      expect(screen.getByText('Château Margaux 2018')).toBeInTheDocument();
      expect(screen.getByText('150.00 EUR l\'unité')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getAllByText('300.00 EUR')).toHaveLength(2);
    });
  });

  describe('User Interactions', () => {
    it('opens checkout URL when checkout button is clicked', async () => {
      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true,
      });

      const user = userEvent.setup();
      renderCartPage();

      const checkoutButton = screen.getByText('Procéder au paiement');
      await user.click(checkoutButton);

      expect(mockOpen).toHaveBeenCalledWith(
        'https://checkout.shopify.com/123',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('handles quantity change', async () => {
      mockUpdateQuantity.mockResolvedValue(mockCart);

      const user = userEvent.setup();
      renderCartPage();

      const increaseButton = screen.getByLabelText('Augmenter la quantité');
      await user.click(increaseButton);

      expect(mockUpdateQuantity).toHaveBeenCalledWith(
        'gid://shopify/CartLine/1',
        3
      );
      expect(mockUpdateCart).toHaveBeenCalledWith(mockCart);
    });

    it('handles item removal', async () => {
      mockRemoveItem.mockResolvedValue(mockCart);

      const user = userEvent.setup();
      renderCartPage();

      const removeButton = screen.getByLabelText('Supprimer l\'article');
      await user.click(removeButton);

      expect(mockRemoveItem).toHaveBeenCalledWith(
        'gid://shopify/CartLine/1'
      );
      expect(mockUpdateCart).toHaveBeenCalledWith(mockCart);
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading state during actions', () => {
      mockUseCart.mockReturnValue(createMockUseCartReturn({
        actionLoading: true,
      }));

      renderCartPage();

      const increaseButton = screen.getByLabelText('Augmenter la quantité');
      const removeButton = screen.getByLabelText('Supprimer l\'article');

      expect(increaseButton).toBeDisabled();
      expect(removeButton).toBeDisabled();
    });

    it('shows action error in empty state', () => {
      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: null,
        actionError: 'Erreur lors de la mise à jour',
      }));

      renderCartPage();

      expect(screen.getByText('Erreur lors de la mise à jour')).toBeInTheDocument();
    });
  });

  describe('Stock Management', () => {
    it('displays stock warnings for low stock items', () => {
      const lowStockCart: Cart = {
        ...mockCart,
        lines: [
          {
            ...mockCart.lines[0],
            quantityAvailable: 1,
          },
        ],
      };

      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: lowStockCart,
      }));

      renderCartPage();

      expect(screen.getByText('Plus que 1 en stock')).toBeInTheDocument();
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

      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: outOfStockCart,
      }));

      renderCartPage();

      expect(screen.getByText('Rupture de stock')).toBeInTheDocument();
    });
  });

  describe('Cart Calculations', () => {
    it('calculates total correctly', () => {
      const multiItemCart: Cart = {
        ...mockCart,
        lines: [
          {
            id: 'gid://shopify/CartLine/1',
            title: 'Château Margaux 2018',
            price: '150.00 EUR',
            unitPrice: 150.00,
            currency: 'EUR',
            lineTotal: '300.00 EUR',
            quantity: 2,
            image: 'https://example.com/wine.jpg',
            availableForSale: true,
            quantityAvailable: 10,
            variantId: 'gid://shopify/ProductVariant/456',
          },
          {
            id: 'gid://shopify/CartLine/2',
            title: 'Château Lafite 2019',
            price: '200.00 EUR',
            unitPrice: 200.00,
            currency: 'EUR',
            lineTotal: '200.00 EUR',
            quantity: 1,
            image: 'https://example.com/wine2.jpg',
            availableForSale: true,
            quantityAvailable: 5,
            variantId: 'gid://shopify/ProductVariant/789',
          },
        ],
        totalAmount: '500.00 EUR',
      };

      mockUseCart.mockReturnValue(createMockUseCartReturn({
        cart: multiItemCart,
      }));

      renderCartPage();

      expect(screen.getByText('Château Margaux 2018')).toBeInTheDocument();
      expect(screen.getByText('Château Lafite 2019')).toBeInTheDocument();
      expect(screen.getByText('500.00 EUR')).toBeInTheDocument();
    });
  });
}); 