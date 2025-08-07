import { renderHook, act } from '@testing-library/react';
import { useCollections } from '../useCollections';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const mockCollections = [
  {
    id: 'gid://shopify/Collection/1',
    title: 'Collection 1',
    handle: 'collection-1',
    image: 'https://example.com/image1.jpg',
  },
  {
    id: 'gid://shopify/Collection/2',
    title: 'Collection 2',
    handle: 'collection-2',
    image: 'https://example.com/image2.jpg',
  },
];

describe('useCollections - API Call Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ collections: mockCollections })
    } as Response);
  });

  it('should not make duplicate API calls on mount', async () => {
    renderHook(() => useCollections());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const collectionsApiCalls = mockFetch.mock.calls.filter(call => 
      call[0]?.toString().includes('/api/collections')
    );
    
    expect(collectionsApiCalls).toHaveLength(1);
    expect(collectionsApiCalls[0][0]).toContain('/api/collections');
  });

  it('should not make duplicate API calls when hook re-renders', async () => {
    const { rerender } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    mockFetch.mockClear();

    rerender();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const collectionsApiCalls = mockFetch.mock.calls.filter(call => 
      call[0]?.toString().includes('/api/collections')
    );
    
    expect(collectionsApiCalls).toHaveLength(0);
  });

  it('should load collections data correctly', async () => {
    const { result } = renderHook(() => useCollections());

    expect(result.current.collectionsLoading).toBe(true);
    expect(result.current.collections).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual(mockCollections);
    expect(result.current.collectionsError).toBeNull();
  });

  it('should handle API errors correctly', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual([]);
    expect(result.current.collectionsError).toBe('Network error');
  });

  it('should handle HTTP errors correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' })
    } as Response);

    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.collectionsLoading).toBe(false);
    expect(result.current.collections).toEqual([]);
    expect(result.current.collectionsError).toBe('Erreur HTTP: 500');
  });
}); 