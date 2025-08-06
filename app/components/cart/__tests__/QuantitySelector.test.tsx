import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QuantitySelector from '../QuantitySelector';

const defaultProps = {
  quantity: 2,
  onQuantityChange: jest.fn(),
  disabled: false,
  maxQuantity: 99,
  availableForSale: true,
  quantityAvailable: 10,
};

describe('QuantitySelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct initial quantity', () => {
    render(<QuantitySelector {...defaultProps} />);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('calls onQuantityChange when increase button is clicked', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    await user.click(increaseButton);

    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith(3);
  });

  it('calls onQuantityChange when decrease button is clicked', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} quantity={3} />);

    const decreaseButton = screen.getByLabelText('Diminuer la quantité');
    await user.click(decreaseButton);

    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith(2);
  });

  it('does not decrease below 1', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} quantity={1} />);

    const decreaseButton = screen.getByLabelText('Diminuer la quantité');
    await user.click(decreaseButton);

    expect(defaultProps.onQuantityChange).not.toHaveBeenCalled();
    expect(decreaseButton).toBeDisabled();
  });

  it('does not increase above max quantity', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} quantity={99} maxQuantity={99} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    await user.click(increaseButton);

    expect(defaultProps.onQuantityChange).not.toHaveBeenCalled();
    expect(increaseButton).toBeDisabled();
  });

  it('respects available stock when lower than max quantity', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} quantity={5} quantityAvailable={5} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    await user.click(increaseButton);

    expect(defaultProps.onQuantityChange).not.toHaveBeenCalled();
    expect(increaseButton).toBeDisabled();
  });

  it('renders input with correct value', () => {
    render(<QuantitySelector {...defaultProps} quantity={5} />);

    const input = screen.getByLabelText('Quantité');
    expect(input).toHaveValue(5);
  });

  it('does not call onQuantityChange for invalid input values', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} />);

    const input = screen.getByLabelText('Quantité');
    await user.clear(input);
    await user.type(input, '0');

    expect(defaultProps.onQuantityChange).not.toHaveBeenCalled();
  });

  it('disables all controls when disabled prop is true', () => {
    render(<QuantitySelector {...defaultProps} disabled={true} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    const decreaseButton = screen.getByLabelText('Diminuer la quantité');
    const input = screen.getByLabelText('Quantité');

    expect(increaseButton).toBeDisabled();
    expect(decreaseButton).toBeDisabled();
    expect(input).toBeDisabled();
  });

  it('disables all controls when not available for sale', () => {
    render(<QuantitySelector {...defaultProps} availableForSale={false} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    const input = screen.getByLabelText('Quantité');

    expect(increaseButton).toBeDisabled();
    expect(input).toBeDisabled();
  });

  it('disables increase button when at available stock limit', () => {
    render(<QuantitySelector {...defaultProps} quantity={10} quantityAvailable={10} />);

    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    expect(increaseButton).toBeDisabled();
  });

  it('allows decrease when at available stock limit', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} quantity={10} quantityAvailable={10} />);

    const decreaseButton = screen.getByLabelText('Diminuer la quantité');
    await user.click(decreaseButton);

    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith(9);
  });

  it('handles decimal input values correctly', () => {
    render(<QuantitySelector {...defaultProps} quantity={3} />);

    const input = screen.getByLabelText('Quantité');
    expect(input).toHaveValue(3);
  });

  it('handles negative input values correctly', async () => {
    const user = userEvent.setup();
    render(<QuantitySelector {...defaultProps} />);

    const input = screen.getByLabelText('Quantité');
    await user.clear(input);
    await user.type(input, '-1');

    expect(defaultProps.onQuantityChange).not.toHaveBeenCalled();
  });
}); 