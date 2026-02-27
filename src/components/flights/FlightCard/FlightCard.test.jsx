import { render, screen, fireEvent } from '@testing-library/react';
import FlightCard from './FlightCard';

// Next.js Link requires router context
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }) => <a href={href}>{children}</a> }));

// Mock Zustand stores
const mockAddFlight = jest.fn();
const mockRemoveFlight = jest.fn();
jest.mock('@/lib/store/wishlistStore', () => ({
  useWishlistStore: () => ({ addFlight: mockAddFlight, removeFlight: mockRemoveFlight, flights: [] }),
}));
jest.mock('@/lib/store/currencyStore', () => ({
  useCurrencyStore: (sel) => sel({ format: (n) => `₹${n.toLocaleString()}` }),
}));

const flight = {
  id: 'f24',
  airline: 'Vistara',
  origin: 'CCU',
  destination: 'COK',
  departureTime: '2026-03-07T07:30:00Z',
  price: 5300,
  duration: '2h 45m',
};

describe('FlightCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders null when flight is undefined', () => {
    const { container } = render(<FlightCard />);
    expect(container.firstChild).toBeNull();
  });

  it('displays airline name', () => {
    render(<FlightCard flight={flight} />);
    expect(screen.getByText(/Vistara/)).toBeInTheDocument();
  });

  it('displays origin and destination', () => {
    render(<FlightCard flight={flight} />);
    expect(screen.getByText(/CCU/)).toBeInTheDocument();
    expect(screen.getByText(/COK/)).toBeInTheDocument();
  });

  it('displays flight duration', () => {
    render(<FlightCard flight={flight} />);
    expect(screen.getByText(/2h 45m/)).toBeInTheDocument();
  });

  it('displays formatted price', () => {
    render(<FlightCard flight={flight} />);
    expect(screen.getByText(/₹5,300/)).toBeInTheDocument();
  });

  it('links to flight detail page', () => {
    render(<FlightCard flight={flight} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/flights/f24');
  });

  it('shows unsaved wishlist button initially', () => {
    render(<FlightCard flight={flight} />);
    expect(screen.getByTitle(/save to wishlist/i)).toBeInTheDocument();
  });

  it('calls addFlight when wishlist button clicked', () => {
    render(<FlightCard flight={flight} />);
    fireEvent.click(screen.getByTitle(/save to wishlist/i));
    expect(mockAddFlight).toHaveBeenCalledWith(flight);
  });

  it('shows saved heart when flight is in wishlist', () => {
    jest.spyOn(require('@/lib/store/wishlistStore'), 'useWishlistStore').mockReturnValue({
      addFlight: mockAddFlight,
      removeFlight: mockRemoveFlight,
      flights: [flight],
    });
    render(<FlightCard flight={flight} />);
    expect(screen.getByTitle(/remove from wishlist/i)).toBeInTheDocument();
  });
});
