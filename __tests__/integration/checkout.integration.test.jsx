/**
 * Integration test: Checkout page — wallet, promo, createBooking, redirect.
 * Uses MSW to mock GET /api/wallet, POST /api/promo/validate, POST /api/booking.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import CheckoutPage from '@/app/(booking)/checkout/page';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { ROUTES } from '@/lib/constants/routes';




jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Avoid alert() in tests
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('Checkout page (integration)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    mockPush.mockClear();
    mockAlert.mockClear();
    useCheckoutStore.setState({
      booking: {
        type: 'flight',
        flight: {
          id: 'f1',
          airline: 'IndiGo',
          origin: 'DEL',
          destination: 'BOM',
          price: 3500,
        },
      },
    });
  });

  it('shows Checkout heading and booking summary when booking is set', async () => {
    render(<CheckoutPage />);
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
    expect(screen.getByText('Booking Summary')).toBeInTheDocument();
    expect(screen.getByText(/IndiGo.*DEL.*BOM/)).toBeInTheDocument();
  });

  it('loads wallet balance from API and shows use-wallet option', async () => {
    render(<CheckoutPage />);
    await waitFor(() => {
      expect(screen.getByText(/wallet credits.*available/i)).toBeInTheDocument();
    });
  });

  it('submit creates booking and redirects to confirmation', async () => {
    render(<CheckoutPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Pay.*Confirm/i })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText('4242 4242 4242 4242'), '4242424242424242');
    await userEvent.type(screen.getByPlaceholderText('MM/YY'), '12/28');
    await userEvent.type(screen.getByPlaceholderText('123'), '123');

    const submitBtn = screen.getByRole('button', { name: /Pay.*Confirm/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(ROUTES.BOOKING_CONFIRMATION('b1'));
    });
  });
});
