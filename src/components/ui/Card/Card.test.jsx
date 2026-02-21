import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });
});
