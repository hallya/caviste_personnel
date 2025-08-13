import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { SimplifiedProduct } from '../../../types/shopify';
import HomeView from '../views/HomeView';
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

jest.mock('../../pageHeader', () => {
  return function MockPageHeader() {
    return <div data-testid="page-header">Page Header</div>;
  };
});

const mockProducts: SimplifiedProduct[] = [
  {
    id: '1',
    title: 'Wine 1',
    image: 'https://example.com/wine1.jpg',
    price: '25.50',
    currency: 'EUR',
    variantId: 'var1',
    availableForSale: true,
    quantityAvailable: 10,
    tags: ['test-tag'],
  },
];

const defaultProps = {
  collections: [],
  collectionsLoading: false,
  collectionsError: null,
  popupOpen: false,
  popupTitle: '',
  popupHandle: '',
  popupCollectionTags: [],
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

  it('renders all main components correctly', () => {
    render(<HomeView {...defaultProps} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('intro-text')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('conditionally renders popup based on state', () => {
    const { rerender } = render(<HomeView {...defaultProps} popupOpen={false} />);
    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    
    rerender(<HomeView {...defaultProps} popupOpen={true} />);
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });

  it('maintains basic layout structure', () => {
    render(<HomeView {...defaultProps} />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('bg-primary-50', 'min-h-screen');
  });

  it('handles different popup states correctly', () => {
    const { rerender } = render(<HomeView {...defaultProps} popupOpen={false} />);
    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    
    rerender(<HomeView {...defaultProps} popupOpen={true} popupLoading={true} />);
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });

  it('handles empty products gracefully', () => {
    render(<HomeView {...defaultProps} popupProducts={[]} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('intro-text')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('maintains semantic HTML structure', () => {
    render(<HomeView {...defaultProps} />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('bg-primary-50', 'min-h-screen', 'overflow-hidden', 'touch-pan-y', 'space-y-10');
  });
}); 