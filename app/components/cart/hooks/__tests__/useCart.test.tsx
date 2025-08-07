import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('useCart - API Call Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    localStorage.setItem('cartId', 'test-cart-id');
  });

  it('should not make duplicate API calls when addToCart is called', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        cartId: 'test-cart-id',
        totalQuantity: 1,
        checkoutUrl: 'https://checkout.com'
      })
    } as Response);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    mockFetch.mockClear();

    await act(async () => {
      await result.current.addToCart('variant-1', 1);
    });

    const cartApiCalls = mockFetch.mock.calls.filter(call => 
      call[0]?.toString().includes('/api/cart')
    );
    
    expect(cartApiCalls).toHaveLength(1);
    expect(cartApiCalls[0][0]).toContain('/api/cart/add');
  });

  it('should not make duplicate API calls when updateQuantity is called', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'cart-1',
        totalQuantity: 2,
        lines: []
      })
    } as Response);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    mockFetch.mockClear();

    await act(async () => {
      await result.current.updateQuantity('line-1', 2);
    });

    const cartApiCalls = mockFetch.mock.calls.filter(call => 
      call[0]?.toString().includes('/api/cart')
    );
    
    expect(cartApiCalls).toHaveLength(1);
    expect(cartApiCalls[0][0]).toContain('/api/cart/update');
  });

  it('should not make duplicate API calls when removeItem is called', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'cart-1',
        totalQuantity: 0,
        lines: []
      })
    } as Response);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    mockFetch.mockClear();

    await act(async () => {
      await result.current.removeItem('line-1');
    });

    const cartApiCalls = mockFetch.mock.calls.filter(call => 
      call[0]?.toString().includes('/api/cart')
    );
    
    expect(cartApiCalls).toHaveLength(1);
    expect(cartApiCalls[0][0]).toContain('/api/cart/remove');
  });
}); 