import { render, screen } from '@testing-library/react';
import FormationsPage from '../page';
import '@testing-library/jest-dom';

jest.mock('../views/FormationsView', () => {
  return function MockFormationsView() {
    return <div>Formations View</div>;
  };
});

describe('FormationsPage', () => {
  it('renders FormationsView with form logic', () => {
    render(<FormationsPage />);
    
    expect(screen.getByText('Formations View')).toBeInTheDocument();
  });
});