import { render, screen } from '@testing-library/react';
import FlightItinerary from './FlightItinerary';

const mockFlight = {
  id: 'f1',
  airline: 'IndiGo',
  origin: 'DEL',
  originCity: 'Delhi',
  destination: 'BOM',
  destinationCity: 'Mumbai',
  departureTime: '2025-03-15T13:30:00Z',
  arrivalTime: '2025-03-15T16:00:00Z',
  price: 3500,
  seat: '17E',
};

describe('FlightItinerary', () => {
  it('renders without crashing', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getByText('Book Flights')).toBeInTheDocument();
  });

  it('shows booking reference', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getByText(/BK123/)).toBeInTheDocument();
  });

  it('shows passenger name', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} passengerName="John Doe" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('defaults to Guest when no passenger name', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getByText('Guest')).toBeInTheDocument();
  });

  it('shows seat when provided', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} seat="F6" />);
    expect(screen.getByText('F6')).toBeInTheDocument();
  });

  it('shows Book Flights branding (not IndiGo) in section headers', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getAllByText(/Book Flights Passenger/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Book Flights Flight\(s\)/).length).toBeGreaterThan(0);
  });

  it('shows Flight Status button', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getByRole('button', { name: /flight status/i })).toBeInTheDocument();
  });

  it('shows CONFIRMED status', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
  });

  it('shows route in format origin → destination', () => {
    render(<FlightItinerary bookingId="BK123" flight={mockFlight} />);
    expect(screen.getByText(/DEL → BOM/)).toBeInTheDocument();
  });

  it('renders with minimal flight data', () => {
    const minimalFlight = { origin: 'CCU', destination: 'BLR' };
    render(<FlightItinerary bookingId="BK456" flight={minimalFlight} />);
    expect(screen.getByText('Book Flights')).toBeInTheDocument();
    expect(screen.getByText(/CCU → BLR/)).toBeInTheDocument();
  });
});
