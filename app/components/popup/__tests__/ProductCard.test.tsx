import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';
import { NotificationProvider } from '../../../contexts/NotificationContext';
import { CartProvider } from '../../../contexts/CartContext';
import { SimplifiedProduct } from '../../../types/shopify';

const mockAddToCart = jest.fn();

const mockUseCart: {
  cart: {
    id: string;
    totalQuantity: number;
    totalAmount: string;
    checkoutUrl: string;
    lines: Array<{
      id: string;
      quantity: number;
      title: string;
      price: string;
      image?: string;
      availableForSale: boolean;
      quantityAvailable: number;
      variantId?: string;
    }>;
  };
} = {
  cart: {
    id: 'cart-1',
    totalQuantity: 0,
    totalAmount: '0.00 EUR',
    checkoutUrl: 'https://checkout.shopify.com/cart',
    lines: []
  }
};

jest.mock('../../cart/hooks/useCart', () => ({
  useCart: () => ({
    ...mockUseCart,
    refetch: jest.fn().mockResolvedValue(undefined),
    addToCart: mockAddToCart
  })
}));

const mockShowNotification = jest.fn();

jest.mock('../../../contexts/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification
  }),
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const renderProductCard = (product: SimplifiedProduct) => {
  return render(
    <NotificationProvider>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </NotificationProvider>
  );
};

describe('ProductCard', () => {
  const baseProduct: SimplifiedProduct = {
    id: '1',
    title: 'Test Wine',
    image: 'https://example.com/wine.jpg',
    price: '25.50',
    currency: 'EUR',
    variantId: 'variant-1',
    availableForSale: true,
    quantityAvailable: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.cart.lines = [];
  });

  describe('Button State Management', () => {
    it('should enable button when product is available and not in cart', () => {
      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
      expect(button).toHaveTextContent('Ajouter (5 dispo)');
    });

    it('should disable button when product is not available', () => {
      const unavailableProduct = {
        ...baseProduct,
        availableForSale: false,
        variantId: undefined
      };
      
      renderProductCard(unavailableProduct);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Maximum atteint');
    });

    it('should show correct available quantity when product is in cart', () => {
      mockUseCart.cart.lines = [
        {
          id: 'line-1',
          quantity: 2,
          title: 'Test Wine',
          price: '25.50 EUR',
          image: 'https://example.com/wine.jpg',
          availableForSale: true,
          quantityAvailable: 5,
          variantId: 'variant-1'
        }
      ];

      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
      expect(button).toHaveTextContent('Ajouter (3 dispo)');
    });

    it('should disable button when maximum quantity is reached', () => {
      mockUseCart.cart.lines = [
        {
          id: 'line-1',
          quantity: 5,
          title: 'Test Wine',
          price: '25.50 EUR',
          image: 'https://example.com/wine.jpg',
          availableForSale: true,
          quantityAvailable: 5,
          variantId: 'variant-1'
        }
      ];

      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Maximum atteint');
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should add product to cart when button is clicked', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockResolvedValue({ 
        cartId: 'cart-1',
        checkoutUrl: 'https://checkout.shopify.com/cart',
        totalQuantity: 1 
      });

      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockAddToCart).toHaveBeenCalledWith('variant-1', 1);
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Produit ajouté',
        message: 'Test Wine ajouté au panier (1 article)',
        autoClose: false
      });
    });

    it('should disable button when maximum quantity is reached (no click possible)', () => {
      mockUseCart.cart.lines = [
        {
          id: 'line-1',
          quantity: 5,
          title: 'Test Wine',
          price: '25.50 EUR',
          image: 'https://example.com/wine.jpg',
          availableForSale: true,
          quantityAvailable: 5,
          variantId: 'variant-1'
        }
      ];

      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Maximum atteint');
      
      expect(mockAddToCart).not.toHaveBeenCalled();
    });

    it('should handle add to cart errors', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockRejectedValue(new Error('Network error'));

      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(mockShowNotification).toHaveBeenCalledWith({
          type: 'error',
          title: 'Erreur d\'ajout',
          message: 'Network error',
          autoClose: false
        });
      });
    });
  });

  describe('API Call Optimization', () => {
    it('should not make duplicate API calls when adding product to cart', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockResolvedValue({ 
        cartId: 'cart-1',
        checkoutUrl: 'https://checkout.shopify.com/cart',
        totalQuantity: 1 
      });

      renderProductCard(baseProduct);
      
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith('variant-1', 1);
      
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Produit ajouté',
        message: 'Test Wine ajouté au panier (1 article)',
        autoClose: false
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle product without variantId', () => {
      const productWithoutVariant = {
        ...baseProduct,
        variantId: undefined
      };

      renderProductCard(productWithoutVariant);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Maximum atteint');
    });

    it('should handle product with zero quantity available', () => {
      const productWithZeroStock = {
        ...baseProduct,
        quantityAvailable: 0
      };

      renderProductCard(productWithZeroStock);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Maximum atteint');
    });

    it('should handle product with undefined quantity available', () => {
      const productWithUndefinedStock = {
        ...baseProduct,
        quantityAvailable: undefined
      };

      renderProductCard(productWithUndefinedStock);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Maximum atteint');
    });
  });
}); 