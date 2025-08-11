import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QuantitySelector from '../QuantitySelector';

describe('QuantitySelector Accessibility', () => {
  const user = userEvent.setup();
  const mockOnQuantityChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has proper ARIA attributes', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const container = screen.getByRole('group');
    expect(container).toHaveAttribute('aria-label', 'Sélecteur de quantité');

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-label', 'Quantité');
  });

  it('has proper ARIA description when not available for sale', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-describedby');
    
    const description = screen.getByText('Article non disponible en stock');
    expect(description).toHaveClass('sr-only');
  });

  it('handles keyboard navigation with arrow keys', async () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const input = screen.getByRole('spinbutton', { name: /quantité/i });
    await user.click(input);

    await user.keyboard('{ArrowUp}');
    expect(mockOnQuantityChange).toHaveBeenCalledWith(3);
  });

  it('handles keyboard navigation with left/right keys', async () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const input = screen.getByRole('spinbutton', { name: /quantité/i });
    await user.click(input);

    await user.keyboard('{ArrowRight}');
    expect(mockOnQuantityChange).toHaveBeenCalledWith(3);
  });

  it('prevents decrease below 1', async () => {
    render(
      <QuantitySelector
        quantity={1}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const decreaseButton = screen.getByRole('button', { name: /diminuer/i });
    await user.click(decreaseButton);

    expect(mockOnQuantityChange).not.toHaveBeenCalled();
  });

  it('prevents increase when not available for sale', async () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={false}
        disabled={false}
      />
    );

    const increaseButton = screen.getByRole('button', { name: /augmenter/i });
    await user.click(increaseButton);

    expect(mockOnQuantityChange).not.toHaveBeenCalled();
  });

  it('prevents decrease when not available for sale', async () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={false}
        disabled={false}
      />
    );

    const increaseButton = screen.getByRole('button', { name: /augmenter/i });
    expect(increaseButton).toBeDisabled();
  });

  it('prevents interactions when disabled', async () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={true}
      />
    );

    const increaseButton = screen.getByRole('button', { name: /augmenter/i });
    const decreaseButton = screen.getByRole('button', { name: /diminuer/i });
    const input = screen.getByRole('spinbutton');

    expect(increaseButton).toBeDisabled();
    expect(decreaseButton).toBeDisabled();
    expect(input).toBeDisabled();
  });

  it('has focus rings on interactive elements', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const increaseButton = screen.getByRole('button', { name: /augmenter/i });
    const decreaseButton = screen.getByRole('button', { name: /diminuer/i });
    const input = screen.getByRole('spinbutton');

    expect(increaseButton).toHaveClass('focus:ring-2');
    expect(decreaseButton).toHaveClass('focus:ring-2');
    expect(input).toHaveClass('focus:ring-2');
  });

  it('syncs local quantity with prop changes', () => {
    const { rerender } = render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(2);

    rerender(
      <QuantitySelector
        quantity={5}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    expect(input).toHaveValue(5);
  });

  it('has proper form controls with constraints', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
        maxQuantity={50}
        quantityAvailable={30}
      />
    );

    const input = screen.getByRole('spinbutton', { name: /quantité/i });
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '30');
  });

  it('has proper button states and descriptions', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const increaseButton = screen.getByRole('button', { name: /augmenter/i });
    const decreaseButton = screen.getByRole('button', { name: /diminuer/i });

    expect(increaseButton).toHaveAttribute('aria-label', 'Augmenter la quantité');
    expect(decreaseButton).toHaveAttribute('aria-label', 'Diminuer la quantité');
  });

  it('has proper error state accessibility', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('spinbutton', { name: /quantité/i });
    const description = screen.getByText('Article non disponible en stock');

    expect(input).toHaveAttribute('aria-describedby', 'stock-unavailable');
    expect(description).toHaveAttribute('id', 'stock-unavailable');
    expect(description).toHaveClass('sr-only');
  });

  it('has proper group semantics', () => {
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={mockOnQuantityChange}
        availableForSale={true}
        disabled={false}
      />
    );

    const group = screen.getByRole('group', { name: /sélecteur de quantité/i });
    expect(group).toBeInTheDocument();
  });


}); 