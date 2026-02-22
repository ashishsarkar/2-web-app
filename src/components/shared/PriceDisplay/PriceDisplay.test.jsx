import { render, screen } from '@testing-library/react';
import PriceDisplay from './PriceDisplay';

describe('PriceDisplay', () => {
  it('renders amount with default INR currency', () => {
    render(<PriceDisplay amount={1500} />);
    expect(screen.getByText(/INR/)).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  it('renders amount with custom currency', () => {
    render(<PriceDisplay amount={100} currency="USD" />);
    expect(screen.getByText(/USD/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('handles null/undefined amount without crashing', () => {
    const { container } = render(<PriceDisplay amount={null} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    render(<PriceDisplay amount={125000} />);
    expect(screen.getByText(/125,000/)).toBeInTheDocument();
  });
});
