/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import CollectionsPage from '../page';
import { Collection } from '../../components/carousel/types';
import { 
  CollectionsSSRFactories, 
  SearchParamsFactories
} from '../../__tests__/factories';

jest.mock('../containers/CollectionsContainer', () => {
  return function MockCollectionsContainer({ 
    initialCollections, 
    searchParams 
  }: { 
    initialCollections: Collection[], 
    searchParams: Record<string, string | string[] | undefined> 
  }) {
    return (
      <div data-testid="collections-container">
        <div data-testid="initial-collections-count">
          {initialCollections.length}
        </div>
        <div data-testid="search-params">
          {JSON.stringify(searchParams)}
        </div>
      </div>
    );
  };
});

const mockShopifyResponse = CollectionsSSRFactories.mockShopifyResponse();

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockShopifyResponse),
  })
) as jest.Mock;

describe('CollectionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render collections container with fetched data', async () => {
    const searchParams = SearchParamsFactories.asPromise(
      SearchParamsFactories.withSearch('rouge')
    );
    
    const CollectionsPageComponent = await CollectionsPage({ searchParams });
    
    render(CollectionsPageComponent as React.ReactElement);

    expect(screen.getByTestId('collections-container')).toBeInTheDocument();
    expect(screen.getByTestId('initial-collections-count')).toHaveTextContent('2');
    expect(screen.getByTestId('search-params')).toHaveTextContent(
      JSON.stringify({ search: 'rouge' })
    );
  });

  it('should handle empty search params', async () => {
    const searchParams = SearchParamsFactories.asPromise(
      SearchParamsFactories.empty()
    );
    
    const CollectionsPageComponent = await CollectionsPage({ searchParams });
    
    render(CollectionsPageComponent as React.ReactElement);

    expect(screen.getByTestId('collections-container')).toBeInTheDocument();
    expect(screen.getByTestId('initial-collections-count')).toHaveTextContent('2');
    expect(screen.getByTestId('search-params')).toHaveTextContent('{}');
  });
});