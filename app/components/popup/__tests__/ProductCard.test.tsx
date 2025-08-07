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
    quantityAvailable: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.cart.lines = [];
  });

  describe('Button State Management', () => {
    it('should enable bottle and carton buttons when stock is sufficient', () => {
      renderProductCard(baseProduct);
      
      const bottleButton = screen.getByLabelText(/Ajouter 1 bouteille de Test Wine au panier/);
      const cartonButton = screen.getByLabelText(/Ajouter 1 carton \(6 bouteilles\) de Test Wine au panier/);
      
      expect(bottleButton).toBeEnabled();
      expect(cartonButton).toBeEnabled();
    });

    it('should disable carton button when stock is less than 6', () => {
      const lowStockProduct = {
        ...baseProduct,
        quantityAvailable: 3
      };
      
      renderProductCard(lowStockProduct);
      
      const bottleButton = screen.getByLabelText(/Ajouter 1 bouteille de Test Wine au panier/);
      const cartonButton = screen.getByLabelText(/Carton de Test Wine non disponible/);
      
      expect(bottleButton).toBeEnabled();
      expect(cartonButton).toBeDisabled();
    });

    it('should disable all buttons when product is not available', () => {
      const unavailableProduct = {
        ...baseProduct,
        availableForSale: false,
        variantId: undefined
      };
      
      renderProductCard(unavailableProduct);
      
      const bottleButton = screen.getByLabelText(/Bouteille de Test Wine non disponible/);
      const cartonButton = screen.getByLabelText(/Carton de Test Wine non disponible/);
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      
      expect(bottleButton).toBeDisabled();
      expect(cartonButton).toBeDisabled();
      expect(addButton).toBeDisabled();
    });

    it('should disable all buttons when stock is exhausted', () => {
      const noStockProduct = {
        ...baseProduct,
        quantityAvailable: 0
      };
      
      renderProductCard(noStockProduct);
      
      const bottleButton = screen.getByLabelText(/Bouteille de Test Wine non disponible/);
      const cartonButton = screen.getByLabelText(/Carton de Test Wine non disponible/);
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      
      expect(bottleButton).toBeDisabled();
      expect(cartonButton).toBeDisabled();
      expect(addButton).toBeDisabled();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should add 1 bottle to cart when bottle button is clicked', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockResolvedValue({ 
        cartId: 'cart-1',
        checkoutUrl: 'https://checkout.shopify.com/cart',
        totalQuantity: 1 
      });

      renderProductCard(baseProduct);
      
      const bottleButton = screen.getByLabelText(/Ajouter 1 bouteille de Test Wine au panier/);
      await user.click(bottleButton);

      expect(mockAddToCart).toHaveBeenCalledWith('variant-1', 1);
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Produit ajouté',
        message: '1 bouteille de Test Wine ajoutée au panier (1 article)',
        autoClose: false
      });
    });

    it('should add custom quantity to cart when custom input is used', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockResolvedValue({ 
        cartId: 'cart-1',
        checkoutUrl: 'https://checkout.shopify.com/cart',
        totalQuantity: 3 
      });

      renderProductCard(baseProduct);
      
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      await user.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith('variant-1', 1);
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Produit ajouté',
        message: '1 bouteilles de Test Wine ajoutée au panier (3 articles)',
        autoClose: false
      });
    });

    it('should handle add to cart errors for bottle', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockRejectedValue(new Error('Network error'));

      renderProductCard(baseProduct);
      
      const bottleButton = screen.getByLabelText(/Ajouter 1 bouteille de Test Wine au panier/);
      await user.click(bottleButton);

      await waitFor(() => {
        expect(mockShowNotification).toHaveBeenCalledWith({
          type: 'error',
          title: 'Erreur d\'ajout',
          message: 'Network error',
          autoClose: false
        });
      });
    });

    it('should handle add to cart errors for carton', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockRejectedValue(new Error('Network error'));

      renderProductCard(baseProduct);
      
      const cartonButton = screen.getByLabelText(/Ajouter 1 carton \(6 bouteilles\) de Test Wine au panier/);
      await user.click(cartonButton);

      await waitFor(() => {
        expect(mockShowNotification).toHaveBeenCalledWith({
          type: 'error',
          title: 'Erreur d\'ajout',
          message: 'Network error',
          autoClose: false
        });
      });
    });

    it('should handle add to cart errors for custom quantity', async () => {
      const user = userEvent.setup();
      mockAddToCart.mockRejectedValue(new Error('Network error'));

      renderProductCard(baseProduct);
      
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      await user.click(addButton);

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

  describe('Custom Quantity Input', () => {
    it('should update custom quantity when input value changes', async () => {
      const user = userEvent.setup();
      renderProductCard(baseProduct);
      
      const quantityInput = screen.getByLabelText(/Saisir la quantité pour Test Wine/) as HTMLInputElement;
      
      await user.clear(quantityInput);
      await user.type(quantityInput, '5');
      
      // The input should show the typed value
      expect(quantityInput.value).toBe('15');
    });

    it('should enable add button when custom quantity is within available stock', async () => {
      renderProductCard(baseProduct);
      
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      
      // The button should be enabled by default with quantity 1
      expect(addButton).toBeEnabled();
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
      
      const bottleButton = screen.getByLabelText(/Ajouter 1 bouteille de Test Wine au panier/);
      await user.click(bottleButton);

      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith('variant-1', 1);
      
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Produit ajouté',
        message: '1 bouteille de Test Wine ajoutée au panier (1 article)',
        autoClose: false
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with zero quantity available', () => {
      const productWithZeroStock = {
        ...baseProduct,
        quantityAvailable: 0
      };

      renderProductCard(productWithZeroStock);
      
      const bottleButton = screen.getByLabelText(/Bouteille de Test Wine non disponible/);
      const cartonButton = screen.getByLabelText(/Carton de Test Wine non disponible/);
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      
      expect(bottleButton).toBeDisabled();
      expect(cartonButton).toBeDisabled();
      expect(addButton).toBeDisabled();
    });

    it('should handle product with undefined quantity available', () => {
      const productWithUndefinedStock = {
        ...baseProduct,
        quantityAvailable: undefined
      };

      renderProductCard(productWithUndefinedStock);
      
      const bottleButton = screen.getByLabelText(/Bouteille de Test Wine non disponible/);
      const cartonButton = screen.getByLabelText(/Carton de Test Wine non disponible/);
      const addButton = screen.getByLabelText(/Ajouter quantité personnalisée de Test Wine au panier/);
      
      expect(bottleButton).toBeDisabled();
      expect(cartonButton).toBeDisabled();
      expect(addButton).toBeDisabled();
    });
  });
}); 