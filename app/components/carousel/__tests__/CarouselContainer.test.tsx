import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarouselContainer from '../containers/CarouselContainer';
import type { Collection } from '../types';

jest.mock('../Carousel.module.css', () => ({
  viewport: 'viewport-class',
  inner: 'inner-class',
  item: 'item-class',
  selected: 'selected-class',
}));

global.fetch = jest.fn();

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

describe('CarouselContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {})
    );

    render(<CarouselContainer onItemClick={jest.fn()} />);
    
    expect(screen.getByText('Chargement des collections...')).toBeInTheDocument();
  });

  it('renders carousel with collections when data is loaded', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ collections: mockCollections }),
    });

    render(<CarouselContainer onItemClick={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Collection 1')).toBeInTheDocument();
      expect(screen.getByText('Collection 2')).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<CarouselContainer onItemClick={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('renders empty state when no collections', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ collections: [] }),
    });

    render(<CarouselContainer onItemClick={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Aucune collection disponible')).toBeInTheDocument();
    });
  });

  it('maintains CSS classes for 3D effects after refactoring', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ collections: mockCollections }),
    });

    render(<CarouselContainer onItemClick={jest.fn()} />);
    
    await waitFor(() => {
      const viewport = screen.getByRole('region');
      const viewportContainer = viewport.querySelector('div');
      expect(viewportContainer).toHaveClass('viewport-class');
      
      const innerContainer = viewportContainer?.querySelector('div');
      expect(innerContainer).toHaveClass('inner-class');
    });
  });

  it('calls onItemClick when collection is opened', async () => {
    const onItemClick = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ collections: mockCollections }),
    });

    render(<CarouselContainer onItemClick={onItemClick} />);
    
    await waitFor(() => {
      const items = screen.getAllByRole('listitem');
      const firstItem = items[0];
      firstItem.click();
    });
    
    expect(onItemClick).toHaveBeenCalledWith('collection-1', 'Collection 1');
  });
}); 