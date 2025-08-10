import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormationsView from '../FormationsView';
import '@testing-library/jest-dom';

jest.mock('../../../components/PageHeader', () => {
  return function MockPageHeader() {
    return <header>Page Header</header>;
  };
});

describe('FormationsView', () => {
  const user = userEvent.setup();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    formData: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: mockOnSubmit,
    onChange: jest.fn(),
    isSubmitting: false,
    submitStatus: 'idle' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays formation content and form', () => {
    render(<FormationsView {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Formations en Œnologie', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nos Formations', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Demande d\'Information', level: 2 })).toBeInTheDocument();
    
    expect(screen.getByText('Initiation à la Dégustation')).toBeInTheDocument();
    expect(screen.getByText('Découverte des Terroirs')).toBeInTheDocument();
    expect(screen.getByText('Accords Mets et Vins')).toBeInTheDocument();
  });

  it('renders accessible form with proper labels', () => {
    render(<FormationsView {...defaultProps} />);

    expect(screen.getByRole('textbox', { name: 'Nom complet *' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email *' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Message (optionnel)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Envoyer ma demande' })).toBeInTheDocument();
  });

  it('calls onChange when user types in form fields', async () => {
    const mockOnChange = jest.fn();
    render(<FormationsView {...defaultProps} onChange={mockOnChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Nom complet *' }), 'Jean');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('has a form with submit handler', () => {
    render(<FormationsView {...defaultProps} />);
    
    const form = screen.getByRole('button', { name: 'Envoyer ma demande' }).closest('form');
    expect(form).toBeInTheDocument();
  });

  it('displays form data values correctly', () => {
    const formDataWithValues = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    };
    
    render(<FormationsView {...defaultProps} formData={formDataWithValues} />);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
  });

  it('disables submit button during submission', () => {
    render(<FormationsView {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Envoi en cours...' });
    expect(submitButton).toBeDisabled();
  });

  it('shows success feedback after successful submission', () => {
    render(<FormationsView {...defaultProps} submitStatus="success" />);

    expect(screen.getByText(/Votre demande a été envoyée avec succès/)).toBeInTheDocument();
  });

  it('shows error feedback when submission fails', () => {
    render(<FormationsView {...defaultProps} submitStatus="error" />);

    expect(screen.getByText(/Une erreur s'est produite/)).toBeInTheDocument();
  });
});