// 1. React imports
import { render, screen } from '@testing-library/react';

// 2. Next.js imports
// (none needed for this test)

// 3. Third-party libraries
import '@testing-library/jest-dom';

// 4. Internal utilities and types
import type { SimplifiedProduct } from '../../../types/shopify';

// 5. Internal components
import HomeView from '../views/HomeView';

// Mock child components
jest.mock('../../popup/Popup', () => {
  return function MockPopup() {
    return <div data-testid="popup">Popup</div>;
  };
});

jest.mock('../../introText/IntroText', () => {
  return function MockIntroText() {
    return <div data-testid="intro-text">Intro Text</div>;
  };
});

jest.mock('../../carousel/Carousel', () => {
  return function MockCarousel() {
    return <div data-testid="carousel">Carousel</div>;
  };
});

jest.mock('../../PageHeader', () => {
  return function MockPageHeader() {
    return <div data-testid="page-header">Page Header</div>;
  };
});

const mockProducts: SimplifiedProduct[] = [
  {
    id: '1',
    title: 'Product 1',
    image: 'https://example.com/image1.jpg',
    price: '25.00',
    currency: 'EUR',
  },
];

const defaultProps = {
  popupOpen: false,
  popupTitle: '',
  popupProducts: mockProducts,
  popupLoading: false,
  hasNextPage: false,
  onItemClick: jest.fn(),
  onLoadMore: jest.fn(),
  onClosePopup: jest.fn(),
};

describe('HomeView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Component rendering and content
  it('renders all main components correctly', () => {
    render(<HomeView {...defaultProps} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('intro-text')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  // ✅ User interactions and callbacks
  it('conditionally renders popup based on state', () => {
    const { rerender } = render(<HomeView {...defaultProps} popupOpen={false} />);
    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    
    rerender(<HomeView {...defaultProps} popupOpen={true} />);
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });

  // ✅ Styling and CSS classes
  it('maintains basic layout structure', () => {
    render(<HomeView {...defaultProps} />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('bg-primary-50', 'min-h-screen');
  });

  // ✅ Conditional rendering and states
  it('handles different popup states correctly', () => {
    const { rerender } = render(<HomeView {...defaultProps} popupOpen={false} />);
    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    
    rerender(<HomeView {...defaultProps} popupOpen={true} popupLoading={true} />);
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });

  // ✅ Error handling and edge cases
  it('handles empty products gracefully', () => {
    render(<HomeView {...defaultProps} popupProducts={[]} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('intro-text')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  // ✅ Accessibility attributes
  it('maintains semantic HTML structure', () => {
    render(<HomeView {...defaultProps} />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('bg-primary-50', 'min-h-screen', 'overflow-hidden', 'touch-pan-y', 'space-y-10');
  });
}); 