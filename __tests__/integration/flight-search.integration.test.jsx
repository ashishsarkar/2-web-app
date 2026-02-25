/**
 * Integration test: Flight search results page.
 * Uses MSW to mock GET /api/flights/search.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import FlightSearchPage from '@/app/(marketing)/flights/search/page';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('Flight search page (integration)', () => {
  beforeEach(() => {
    useSearchParams.mockReturnValue({
      get: (key) => ({ origin: 'DEL', destination: 'BOM', departureDate: '2025-03-15' }[key] || ''),
    });
  });

  it('shows Flight Search Results heading after load', async () => {
    render(<FlightSearchPage />);
    await waitFor(() => {
      expect(screen.getByText('Flight Search Results')).toBeInTheDocument();
    });
  });

  it('when API returns no flights, shows no-flights message', async () => {
    render(<FlightSearchPage />);
    await waitFor(() => {
      expect(screen.getByText(/No flights found/)).toBeInTheDocument();
    });
  });

  it('when search params present, shows Save this search button', async () => {
    render(<FlightSearchPage />);
    await waitFor(() => {
      expect(screen.getByText('Flight Search Results')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Save this search/i })).toBeInTheDocument();
  });
});
