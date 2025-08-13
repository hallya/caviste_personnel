import { renderHook, act } from '@testing-library/react';
import { useFocusManagement } from '../useFocusManagement';

describe('useFocusManagement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('provides focus management functions', () => {
    const { result } = renderHook(() => useFocusManagement());

    expect(result.current.focusRef).toBeDefined();
    expect(result.current.focusElement).toBeDefined();
    expect(result.current.focusFirstFocusable).toBeDefined();
    expect(result.current.focusLastFocusable).toBeDefined();
    expect(result.current.trapFocus).toBeDefined();
  });

  it('focuses element when focusElement is called', () => {
    const { result } = renderHook(() => useFocusManagement());
    
    const div = document.createElement('div');
    div.tabIndex = 0;
    document.body.appendChild(div);
    
    result.current.focusRef.current = div;
    
    act(() => {
      result.current.focusElement();
    });
    
    expect(document.activeElement).toBe(div);
  });

  it('focuses first focusable element', () => {
    const { result } = renderHook(() => useFocusManagement());
    
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);
    
    act(() => {
      result.current.focusFirstFocusable(container);
    });
    
    expect(document.activeElement).toBe(button1);
  });

  it('focuses last focusable element', () => {
    const { result } = renderHook(() => useFocusManagement());
    
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);
    
    act(() => {
      result.current.focusLastFocusable(container);
    });
    
    expect(document.activeElement).toBe(button2);
  });

  it('traps focus within container', () => {
    const { result } = renderHook(() => useFocusManagement());
    
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);
    
    const cleanup = result.current.trapFocus(container);
    
    button1.focus();
    expect(document.activeElement).toBe(button1);
    
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    act(() => {
      document.dispatchEvent(tabEvent);
    });
    
    expect(document.activeElement).toStrictEqual(button2);
    
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    act(() => {
      document.dispatchEvent(shiftTabEvent);
    });
    
    expect(document.activeElement).toBe(button1);
    
    cleanup?.();
  });
});
