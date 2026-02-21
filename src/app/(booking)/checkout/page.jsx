'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { createBooking } from '@/lib/api/booking';
import { ROUTES } from '@/lib/constants/routes';
import { checkoutSchema } from '@/lib/validations/checkout';

const inputBase = 'w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400';
const inputError = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500';

export default function CheckoutPage() {
  const router = useRouter();
  const { booking, clearCheckout } = useCheckoutStore();

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
  const price = item?.price || 0;
  const type = booking.type || 'flight';

  const onSubmit = async (data) => {
    try {
      const res = await createBooking({ type, item, ...data });
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
        {type === 'flight' && item && (
          <p className="text-gray-600">{item.airline} • {item.origin} → {item.destination}</p>
        )}
        {type === 'hotel' && item && (
          <p className="text-gray-600">{item.name} • {item.location}</p>
        )}
        <p className="text-xl font-bold text-indigo-600 mt-2">₹{price?.toLocaleString()}</p>
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
          {isSubmitting ? 'Processing...' : 'Pay & Confirm'}
        </button>
        <p className="mt-4 text-sm text-gray-500 text-center">Mock payment — no real charge</p>
      </form>
    </div>
  );
}
