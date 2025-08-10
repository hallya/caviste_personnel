import { render, screen } from '@testing-library/react';
import ContactView from '../ContactView';
import '@testing-library/jest-dom';

jest.mock('../../../components/PageHeader', () => {
  return function MockPageHeader() {
    return <header>Page Header</header>;
  };
});

describe('ContactView', () => {
  it('displays page content structure', () => {
    render(<ContactView />);

    expect(screen.getByRole('heading', { name: 'Contact & À propos', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'À propos d\'Edouard', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Me Contacter', level: 2 })).toBeInTheDocument();
  });

  it('displays Edouard\'s story and background', () => {
    render(<ContactView />);

    expect(screen.getByText(/Je souhaite faire découvrir à des clients/)).toBeInTheDocument();
    expect(screen.getByText(/Saint-Émilion en grand cru depuis 1750/)).toBeInTheDocument();
    expect(screen.getByText(/Château Brun, famille Brun/)).toBeInTheDocument();
    expect(screen.getByText(/créé 2 clubs œnologie/)).toBeInTheDocument();
    expect(screen.getByText(/Maison Plisson à Beaumarchais/)).toBeInTheDocument();
  });

  it('lists available services', () => {
    render(<ContactView />);

    expect(screen.getByRole('heading', { name: 'Mes Services', level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/Sélection personnalisée de vins/)).toBeInTheDocument();
    expect(screen.getByText(/Conseils et accords mets-vins/)).toBeInTheDocument();
    expect(screen.getByText(/Formations et dégustations privées/)).toBeInTheDocument();
    expect(screen.getByText(/Livraison sur mesure/)).toBeInTheDocument();
    expect(screen.getByText(/Tarifs négociés/)).toBeInTheDocument();
  });

  it('provides contact information with working links', () => {
    render(<ContactView />);

    const emailLink = screen.getByRole('link', { name: 'contact@caviste-personnel.fr' });
    const phoneLink = screen.getByRole('link', { name: '01 23 45 67 89' });

    expect(emailLink).toHaveAttribute('href', 'mailto:contact@caviste-personnel.fr');
    expect(phoneLink).toHaveAttribute('href', 'tel:+33123456789');
  });

  it('displays business hours', () => {
    render(<ContactView />);

    expect(screen.getByText('Lundi - Vendredi : 9h - 18h')).toBeInTheDocument();
    expect(screen.getByText('Samedi : 10h - 16h')).toBeInTheDocument();
    expect(screen.getByText('Dimanche : Sur rendez-vous')).toBeInTheDocument();
  });

  it('links to formations page', () => {
    render(<ContactView />);

    const formationsLink = screen.getByRole('link', { name: 'Formations en Œnologie' });
    expect(formationsLink).toHaveAttribute('href', '/formations');
  });
});