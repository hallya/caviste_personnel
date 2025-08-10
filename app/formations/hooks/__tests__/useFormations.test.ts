import { renderHook, act } from '@testing-library/react';
import { useFormations } from '../useFormations';
import { API_ENDPOINTS } from '../../constants';

global.fetch = jest.fn();

describe('useFormations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useFormations());

    expect(result.current.formData).toEqual({
      name: '',
      email: '',
      message: '',
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitStatus).toBe('idle');
  });

  it('updates form data when handleChange is called', () => {
    const { result } = renderHook(() => useFormations());

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe('John Doe');
  });

  it('handles successful form submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { result } = renderHook(() => useFormations());

    // Set some form data first
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Test User' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.FORMATIONS_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: '',
        message: '',
      }),
    });
    expect(result.current.submitStatus).toBe('success');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('handles form submission errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useFormations());

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.submitStatus).toBe('error');
    expect(result.current.isSubmitting).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Formation registration error:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});