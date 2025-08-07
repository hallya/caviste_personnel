import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CartItem from '../CartItem';
import type { CartItem as CartItemType } from '../types';

const mockItem: CartItemType = {
  id: 'gid://shopify/CartLine/123',
  title: 'Château Margaux 2018',
  price: '150.00 EUR',
  quantity: 2,
  image: 'https://example.com/wine.jpg',
  availableForSale: true,
  quantityAvailable: 10,
};

const defaultProps = {
  item: mockItem,
  onQuantityChange: jest.fn(),
  onRemove: jest.fn(),
  loading: false,
};

describe('CartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders item information correctly', () => {
    render(<CartItem {...defaultProps} />);

    expect(screen.getByText('Château Margaux 2018')).toBeInTheDocument();
    expect(screen.getByText('150.00 EUR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('displays product image when available', () => {
    render(<CartItem {...defaultProps} />);

    const image = screen.getByAltText('Château Margaux 2018');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/wine.jpg');
  });

  it('does not display image when not available', () => {
    const itemWithoutImage = { ...mockItem, image: undefined };
    render(<CartItem {...defaultProps} item={itemWithoutImage} />);

    expect(screen.queryByAltText('Château Margaux 2018')).not.toBeInTheDocument();
  });

  it('calls onQuantityChange when quantity is modified', async () => {
    const user = userEvent.setup();
    render(<CartItem {...defaultProps} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    await user.click(increaseButton);

    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith('gid://shopify/CartLine/123', 3);
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartItem {...defaultProps} />);

    const removeButton = screen.getByLabelText('Supprimer l\'article');
    await user.click(removeButton);

    expect(defaultProps.onRemove).toHaveBeenCalledWith('gid://shopify/CartLine/123');
  });

  it('disables controls when loading', () => {
    render(<CartItem {...defaultProps} loading={true} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    const removeButton = screen.getByLabelText('Supprimer l\'article');
    const quantityInput = screen.getByLabelText('Quantité');

    expect(increaseButton).toBeDisabled();
    expect(removeButton).toBeDisabled();
    expect(quantityInput).toBeDisabled();
  });

  it('shows stock warning when quantity available is less than 10', () => {
    const lowStockItem = { ...mockItem, quantityAvailable: 5 };
    render(<CartItem {...defaultProps} item={lowStockItem} />);

    expect(screen.getByText('Plus que 5 en stock')).toBeInTheDocument();
  });

  it('shows out of stock message when not available for sale', () => {
    const outOfStockItem = { ...mockItem, availableForSale: false };
    render(<CartItem {...defaultProps} item={outOfStockItem} />);

    expect(screen.getByText('Rupture de stock')).toBeInTheDocument();
  });

  it('disables quantity controls when out of stock', () => {
    const outOfStockItem = { ...mockItem, availableForSale: false };
    render(<CartItem {...defaultProps} item={outOfStockItem} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    const quantityInput = screen.getByLabelText('Quantité');

    expect(increaseButton).toBeDisabled();
    expect(quantityInput).toBeDisabled();
  });

  it('limits quantity to available stock', async () => {
    const limitedStockItem = { ...mockItem, quantityAvailable: 3 };
    const user = userEvent.setup();
    render(<CartItem {...defaultProps} item={limitedStockItem} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    
    await user.click(increaseButton);
    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith('gid://shopify/CartLine/123', 3);
    
    expect(increaseButton).toBeDisabled();
  });
}); 