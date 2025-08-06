import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarouselItem } from '../CarouselItem';
import { Collection } from '../types';

const mockCollection: Collection = {
  title: 'Test Collection',
  handle: 'test-collection',
  image: '/test-image.jpg'
};

const defaultProps = {
  collection: mockCollection,
  index: 0,
  current: 0,
  onSelect: jest.fn(),
  onOpen: jest.fn(),
  isMobile: false,
  totalItems: 5
};

describe('CarouselItem', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders collection information correctly', () => {
    render(<CarouselItem {...defaultProps} />);
    
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    expect(screen.getByLabelText(/Collection 1 sur 5: Test Collection/)).toBeInTheDocument();
  });

  it('shows selected state when current item', () => {
    render(<CarouselItem {...defaultProps} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-current', 'true');
    expect(item).toHaveAttribute('tabIndex', '0');
  });

  it('shows unselected state when not current item', () => {
    render(<CarouselItem {...defaultProps} current={1} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-current', 'false');
    expect(item).toHaveAttribute('tabIndex', '-1');
  });

  it('calls onSelect when clicking unselected item', async () => {
    render(<CarouselItem {...defaultProps} current={1} />);
    
    const item = screen.getByRole('listitem');
    await user.click(item);
    
    expect(defaultProps.onSelect).toHaveBeenCalledWith(0);
    expect(defaultProps.onOpen).not.toHaveBeenCalled();
  });

  it('calls onOpen when clicking selected item', async () => {
    render(<CarouselItem {...defaultProps} />);
    
    const item = screen.getByRole('listitem');
    await user.click(item);
    
    expect(defaultProps.onOpen).toHaveBeenCalledWith(mockCollection);
    expect(defaultProps.onSelect).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation with Enter key', async () => {
    render(<CarouselItem {...defaultProps} />);
    
    const item = screen.getByRole('listitem');
    item.focus();
    await user.keyboard('{Enter}');
    
    expect(defaultProps.onOpen).toHaveBeenCalledWith(mockCollection);
  });

  it('handles keyboard navigation with Space key', async () => {
    render(<CarouselItem {...defaultProps} />);
    
    const item = screen.getByRole('listitem');
    item.focus();
    await user.keyboard(' ');
    
    expect(defaultProps.onOpen).toHaveBeenCalledWith(mockCollection);
  });

  it('renders image when available', () => {
    render(<CarouselItem {...defaultProps} />);
    
    const image = screen.getByAltText('Image de Test Collection');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders placeholder when no image', () => {
    const collectionWithoutImage = { ...mockCollection, image: null };
    render(<CarouselItem {...defaultProps} collection={collectionWithoutImage} />);
    
    expect(screen.queryByAltText('Image de Test Collection')).not.toBeInTheDocument();
    expect(screen.getByTitle('Test Collection')).toBeInTheDocument();
  });

  it('applies mobile styles when isMobile is true', () => {
    render(<CarouselItem {...defaultProps} isMobile={true} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('w-36', 'h-56', 'p-1.5');
  });

  it('applies desktop styles when isMobile is false', () => {
    render(<CarouselItem {...defaultProps} isMobile={false} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('w-52', 'h-80', 'p-2');
  });
}); 