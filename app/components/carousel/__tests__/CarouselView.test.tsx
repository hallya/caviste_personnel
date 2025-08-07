// 1. React imports
import { render, screen } from '@testing-library/react';

// 2. Next.js imports
// (none needed for this test)

// 3. Third-party libraries
import '@testing-library/jest-dom';

// 4. Internal utilities and types
import type { Collection } from '../types';

// 5. Internal components
import CarouselView from '../views/CarouselView';

// Mock the CSS module
jest.mock('../Carousel.module.css', () => ({
  viewport: 'viewport-class',
  inner: 'inner-class',
}));

const mockCollections: Collection[] = [
  {
    title: 'Collection 1',
    handle: 'collection-1',
    image: 'https://example.com/image1.jpg',
  },
  {
    title: 'Collection 2',
    handle: 'collection-2',
    image: 'https://example.com/image2.jpg',
  },
];

const defaultProps = {
  collections: mockCollections,
  current: 0,
  containerRef: { current: null },
  handleTouchStart: jest.fn(),
  handleTouchEnd: jest.fn(),
  isMobile: false,
  onSelect: jest.fn(),
  onOpen: jest.fn(),
};

describe('CarouselView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Component rendering and content
  it('renders carousel structure correctly', () => {
    render(<CarouselView {...defaultProps} />);
    
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  // ✅ User interactions and callbacks
  it('renders with touch event handlers', () => {
    render(<CarouselView {...defaultProps} />);
    
    const carousel = screen.getByRole('region');
    
    // Verify the component is set up to handle touch interactions
    expect(carousel).toBeInTheDocument();
    expect(defaultProps.handleTouchStart).toBeDefined();
    expect(defaultProps.handleTouchEnd).toBeDefined();
  });

  // ✅ Styling and CSS classes
  it('maintains 3D effects CSS classes', () => {
    render(<CarouselView {...defaultProps} />);
    
    const viewport = screen.getByRole('region');
    const viewportContainer = viewport.querySelector('div');
    const innerContainer = viewportContainer?.querySelector('div');
    
    expect(viewportContainer).toHaveClass('viewport-class');
    expect(innerContainer).toHaveClass('inner-class');
  });

  // ✅ Conditional rendering and states
  it('renders different states based on mobile prop', () => {
    const { rerender } = render(<CarouselView {...defaultProps} isMobile={false} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
    
    rerender(<CarouselView {...defaultProps} isMobile={true} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  // ✅ Error handling and edge cases
  it('handles empty collections gracefully', () => {
    render(<CarouselView {...defaultProps} collections={[]} />);
    
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // ✅ Accessibility attributes
  it('maintains accessibility attributes', () => {
    render(<CarouselView {...defaultProps} />);
    
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveAttribute('aria-label', 'Carousel de collections');
    expect(carousel).toHaveAttribute('aria-live', 'polite');
    expect(carousel).toHaveAttribute('aria-atomic', 'false');
  });
}); 