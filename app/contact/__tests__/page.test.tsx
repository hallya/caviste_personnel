import { render, screen } from '@testing-library/react';
import ContactPage from '../page';
import '@testing-library/jest-dom';

jest.mock('../views/ContactView', () => {
  return function MockContactView() {
    return <div>Contact View</div>;
  };
});

describe('ContactPage', () => {
  it('renders ContactView directly', () => {
    render(<ContactPage />);
    
    expect(screen.getByText('Contact View')).toBeInTheDocument();
  });
});