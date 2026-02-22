'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@/lib/api/axios';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { createBooking } from '@/lib/api/booking';
import { ROUTES } from '@/lib/constants/routes';
import { checkoutSchema } from '@/lib/validations/checkout';

const inputBase = 'w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400';
const inputError = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500';
const INSURANCE_PRICE = 299;

export default function CheckoutPage() {
  const router = useRouter();
  const { booking, clearCheckout } = useCheckoutStore();
  const format = useCurrencyStore((s) => s.format);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);

  useEffect(() => {
    apiClient.get('/api/wallet').then((r) => setWalletBalance(r.data.balance || 0)).catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { cardNumber: '', expiry: '', cvv: '' },
  });

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">No booking selected.</p>
        <button onClick={() => router.push(ROUTES.HOME)} className="text-indigo-600 font-medium">
          Search flights or hotels
        </button>
      </div>
    );
  }

  const item = booking.flight || booking.hotel;
  let basePrice = 0;
  if (booking.type === 'bundle' && booking.flight && booking.hotel) {
    basePrice = (booking.flight.price || 0) + (booking.hotel.price ?? booking.hotel.rooms?.[0]?.price ?? 0);
  } else if (booking.type === 'hotel' && item) {
    basePrice = item.room?.price ?? item.price ?? 0;
  } else {
    basePrice = item?.price ?? 0;
  }
  const insuranceTotal = insurance ? INSURANCE_PRICE : 0;
  const promoDiscount = promoApplied?.savings ?? 0;
  const subtotal = Math.max(0, basePrice + insuranceTotal - promoDiscount);
  const walletDeduction = useWallet ? Math.min(walletBalance, subtotal) : 0;
  const total = Math.max(0, subtotal - walletDeduction);

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoCode.trim()) return;
    try {
      const { data } = await apiClient.post('/api/promo/validate', { code: promoCode.trim(), amount: basePrice });
      setPromoApplied(data);
    } catch {
      setPromoError('Invalid promo code');
      setPromoApplied(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (walletDeduction > 0) {
        await apiClient.post('/api/wallet', { action: 'use', amount: walletDeduction });
      }
      const payload = {
        type: booking.type,
        item: booking.type === 'bundle' ? { flight: booking.flight, hotel: booking.hotel } : (booking.flight || booking.hotel),
        flight: booking.flight || null,
        hotel: booking.hotel || null,
        promo: promoApplied,
        insurance,
        total,
        useWallet: walletDeduction > 0,
        walletDeduction,
        ...data,
      };
      const res = await createBooking(payload);
      clearCheckout();
      router.push(ROUTES.BOOKING_CONFIRMATION(res.id));
    } catch {
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Booking Summary</h2>
        {booking.type === 'flight' && item && (
          <p className="text-gray-600">{item.airline} • {item.origin} → {item.destination} {item.seat ? `• Seat ${item.seat}` : ''}</p>
        )}
        {booking.type === 'hotel' && item && (
          <p className="text-gray-600">{item.name} • {item.location} {item.room ? `• ${item.room.name}` : ''}</p>
        )}
        {booking.type === 'bundle' && booking.flight && booking.hotel && (
          <div className="space-y-1">
            <p className="text-gray-600">✈ {booking.flight.airline} • {booking.flight.origin} → {booking.flight.destination}</p>
            <p className="text-gray-600">🏨 {booking.hotel.name} • {booking.hotel.location}</p>
          </div>
        )}

        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="flex justify-between text-gray-600">
            <span>Base price</span>
            <span>{format(basePrice)}</span>
          </div>
          {insurance && (
            <div className="flex justify-between text-gray-600">
              <span>Travel insurance</span>
              <span>{format(INSURANCE_PRICE)}</span>
            </div>
          )}
          {promoApplied && (
            <div className="flex justify-between text-green-600">
              <span>Promo ({promoApplied.code})</span>
              <span>-{format(promoDiscount)}</span>
            </div>
          )}
          {walletDeduction > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Wallet credits</span>
              <span>-{format(walletDeduction)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2">
            <span>Total</span>
            <span className="text-indigo-600">{format(total)}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className={`flex-1 ${inputBase}`}
          />
          <button type="button" onClick={handleApplyPromo} className="px-4 py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200">
            Apply
          </button>
        </div>
        {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}
        {promoApplied && <p className="mt-1 text-sm text-green-600">{promoApplied.message}</p>}

        <label className="mt-4 flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="rounded" />
          <span>Add travel insurance (+{format(INSURANCE_PRICE)})</span>
        </label>
        {walletBalance > 0 && (
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} className="rounded" />
            <span>Use wallet credits (₹{walletBalance.toLocaleString()} available)</span>
          </label>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment Details (Mock)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              {...register('cardNumber')}
              type="text"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className={`${inputBase} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.cardNumber ? inputError : ''}`}
            />
            {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
              <input
                {...register('expiry')}
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className={`${inputBase} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.expiry ? inputError : ''}`}
              />
              {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                {...register('cvv')}
                type="text"
                placeholder="123"
                maxLength={4}
                className={`${inputBase} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.cvv ? inputError : ''}`}
              />
              {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : `Pay ${format(total)} & Confirm`}
        </button>
        <p className="mt-4 text-sm text-gray-500 text-center">Mock payment — no real charge</p>
      </form>
    </div>
  );
}
