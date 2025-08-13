import { renderHook, act } from '@testing-library/react';
import { useFormations } from '../useFormations';
import { API_ENDPOINTS, NOTIFICATION_CONFIG } from '../../constants';
import { NOTIFICATION_TYPES } from '../../../components/notification/types';

global.fetch = jest.fn();

const mockShowNotification = jest.fn();
jest.mock('../../../contexts/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
    hideNotification: jest.fn(),
    hideNotificationGroup: jest.fn(),
  }),
}));

describe('useFormations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    mockShowNotification.mockClear();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useFormations());

    expect(result.current.formData).toEqual({
      name: '',
      email: '',
      message: '',
    });
    expect(result.current.isSubmitting).toBe(false);
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

  it('shows loading notification and handles successful form submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { result } = renderHook(() => useFormations());

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

    expect(mockShowNotification).toHaveBeenCalledWith({
      id: NOTIFICATION_CONFIG.LOADING_ID,
      type: NOTIFICATION_TYPES.LOADING,
      title: 'Envoi en cours...',
      message: 'Votre demande de formation est en cours d\'envoi',
      autoClose: false,
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      replaceId: NOTIFICATION_CONFIG.LOADING_ID,
      type: NOTIFICATION_TYPES.SUCCESS,
      title: 'Demande envoyée !',
      message: 'Votre demande a été envoyée avec succès. Je vous recontacterai rapidement.',
      autoClose: true,
      autoCloseDelay: NOTIFICATION_CONFIG.AUTO_CLOSE_DELAY,
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.formData).toEqual({
      name: '',
      email: '',
      message: '',
    });
  });

  it('shows loading notification and handles form submission errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useFormations());

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      id: NOTIFICATION_CONFIG.LOADING_ID,
      type: NOTIFICATION_TYPES.LOADING,
      title: 'Envoi en cours...',
      message: 'Votre demande de formation est en cours d\'envoi',
      autoClose: false,
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      replaceId: NOTIFICATION_CONFIG.LOADING_ID,
      type: NOTIFICATION_TYPES.ERROR,
      title: 'Erreur d\'envoi',
      message: 'Une erreur s\'est produite. Veuillez réessayer ou me contacter directement.',
      autoClose: true,
      autoCloseDelay: NOTIFICATION_CONFIG.ERROR_AUTO_CLOSE_DELAY,
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Formation registration error:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});