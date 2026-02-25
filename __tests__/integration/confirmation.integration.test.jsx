/**
 * Integration test: Booking confirmation page.
 * Uses MSW to mock GET /api/booking/:id and GET /api/confirmations/log.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'next/navigation';
import BookingConfirmationPage from '@/app/(booking)/booking/confirmation/[id]/page';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/lib/utils/pdf', () => ({
  generateItineraryPDF: jest.fn().mockResolvedValue(true),
  generateInvoicePDF: jest.fn().mockResolvedValue(true),
}));

describe('Confirmation page (integration)', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: 'b1' });
  });

  it('after load, shows booking confirmed and reference', async () => {
    render(<BookingConfirmationPage />);
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    });
    expect(screen.getByText(/b1/)).toBeInTheDocument();
  });

  it('after load, shows confirmation pipeline when confirmations log is returned', async () => {
    render(<BookingConfirmationPage />);
    await waitFor(() => {
      expect(screen.getByText('Confirmation pipeline')).toBeInTheDocument();
    });
    expect(screen.getByText(/Recent confirmations processed/)).toBeInTheDocument();
    expect(screen.getByText(/BK123/)).toBeInTheDocument();
    expect(screen.getByText(/BK456/)).toBeInTheDocument();
  });

  it('shows View My Bookings and Book Another links', async () => {
    render(<BookingConfirmationPage />);
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /View My Bookings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Book Another/i })).toBeInTheDocument();
  });

  it('shows Download Itinerary and Download Invoice buttons', async () => {
    render(<BookingConfirmationPage />);
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Download Itinerary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Invoice/i })).toBeInTheDocument();
  });
});
