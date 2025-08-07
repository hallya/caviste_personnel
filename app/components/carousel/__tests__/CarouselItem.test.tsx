// 1. React imports
import { render, screen } from '@testing-library/react';

// 2. Next.js imports
// (none needed for this test)

// 3. Third-party libraries
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// 4. Internal utilities and types
import type { Collection } from '../types';

// 5. Internal components
import { CarouselItem } from '../CarouselItem';

// Mock the CSS module
jest.mock('../Carousel.module.css', () => ({
  item: 'item-class',
  selected: 'selected-class',
}));

const mockCollection: Collection = {
  title: 'Test Collection',
  handle: 'test-collection',
  image: 'https://example.com/image.jpg',
};

const defaultProps = {
  collection: mockCollection,
  index: 0,
  current: 0,
  onSelect: jest.fn(),
  onOpen: jest.fn(),
  isMobile: false,
  totalItems: 3,
};

describe('CarouselItem', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Component rendering and content
  it('renders collection item with correct content', () => {
    render(<CarouselItem {...defaultProps} />);
    
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    expect(screen.getByAltText('Image de Test Collection')).toBeInTheDocument();
  });

  // ✅ User interactions and callbacks
  it('handles user interactions correctly', async () => {
    render(<CarouselItem {...defaultProps} current={0} />);
    
    const item = screen.getByRole('listitem');
    await user.click(item);
    
    expect(defaultProps.onOpen).toHaveBeenCalledWith(mockCollection);
  });

  // ✅ Styling and CSS classes
  it('maintains CSS classes and accessibility', () => {
    render(<CarouselItem {...defaultProps} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('item-class');
    expect(item).toHaveAttribute('aria-label', 'Collection 1 sur 3: Test Collection');
  });

  // ✅ Conditional rendering and states
  it('applies selected state correctly', () => {
    render(<CarouselItem {...defaultProps} current={0} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('selected-class');
    expect(item).toHaveAttribute('aria-current', 'true');
  });

  // ✅ Error handling and edge cases
  it('handles missing image gracefully', () => {
    const collectionWithoutImage = { ...mockCollection, image: null };
    render(<CarouselItem {...defaultProps} collection={collectionWithoutImage} />);
    
    const placeholder = screen.getByTitle('Test Collection');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('bg-gray-100');
  });

  // ✅ Accessibility attributes
  it('maintains accessibility attributes', () => {
    render(<CarouselItem {...defaultProps} />);
    
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-label', 'Collection 1 sur 3: Test Collection');
    expect(item).toHaveAttribute('tabIndex', '0');
  });
}); 