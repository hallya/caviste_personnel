import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SocialLinks from '../SocialLinks';
import { SOCIAL_LINKS } from '../constants';

describe('SocialLinks', () => {
  it('renders Instagram and Facebook links', () => {
    render(<SocialLinks />);
    
    const instagramLink = screen.getByLabelText('Suivez-nous sur Instagram');
    const facebookLink = screen.getByLabelText('Suivez-nous sur Facebook');
    
    expect(instagramLink).toBeInTheDocument();
    expect(facebookLink).toBeInTheDocument();
  });

  it('has correct href attributes', () => {
    render(<SocialLinks />);
    
    const instagramLink = screen.getByLabelText('Suivez-nous sur Instagram');
    const facebookLink = screen.getByLabelText('Suivez-nous sur Facebook');
    
    expect(instagramLink).toHaveAttribute('href', SOCIAL_LINKS.INSTAGRAM);
    expect(facebookLink).toHaveAttribute('href', SOCIAL_LINKS.FACEBOOK);
  });

  it('opens links in new tab', () => {
    render(<SocialLinks />);
    
    const instagramLink = screen.getByLabelText('Suivez-nous sur Instagram');
    const facebookLink = screen.getByLabelText('Suivez-nous sur Facebook');
    
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has correct positioning classes', () => {
    render(<SocialLinks />);
    
    const container = screen.getByLabelText('Suivez-nous sur Instagram').closest('div');
    expect(container).toHaveClass('fixed', 'left-6', 'flex', 'flex-col', 'space-y-4', 'z-200', 'bottom-4', 'md:top-4', 'md:bottom-auto', 'm-0', 'p-0'); // fixed left-6 flex flex-col space-y-4 z-200 bottom-4 md:top-4 md:bottom-auto m-0 p-0
  });
}); 