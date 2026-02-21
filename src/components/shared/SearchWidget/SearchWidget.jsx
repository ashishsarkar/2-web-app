'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/lib/constants/routes';
import { flightSearchSchema } from '@/lib/validations/flights';
import { hotelSearchSchema } from '@/lib/validations/hotels';

const inputBase = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400';
const inputError = 'border-red-500 focus:ring-red-500 focus:border-red-500';

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState('flights');
  const router = useRouter();

  const flightForm = useForm({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: { origin: '', destination: '', departureDate: '' },
  });

  const hotelForm = useForm({
    resolver: zodResolver(hotelSearchSchema),
    defaultValues: { location: '', checkIn: '', checkOut: '' },
  });

  const onFlightSubmit = (data) => {
    const params = new URLSearchParams({ origin: data.origin, destination: data.destination });
    if (data.departureDate) params.set('departureDate', data.departureDate);
    router.push(`${ROUTES.FLIGHT_SEARCH}?${params}`);
  };

  const onHotelSubmit = (data) => {
    const params = new URLSearchParams({ location: data.location });
    if (data.checkIn) params.set('checkIn', data.checkIn);
    if (data.checkOut) params.set('checkOut', data.checkOut);
    router.push(`${ROUTES.HOTEL_SEARCH}?${params}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('flights')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'flights' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✈ Flights
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'hotels' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏨 Hotels
        </button>
      </div>

      {activeTab === 'flights' ? (
        <form onSubmit={flightForm.handleSubmit(onFlightSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              {...flightForm.register('origin')}
              type="text"
              placeholder="e.g. DEL"
              className={`${inputBase} ${flightForm.formState.errors.origin ? inputError : 'border-gray-300'}`}
            />
            {flightForm.formState.errors.origin && (
              <p className="mt-1 text-sm text-red-600">{flightForm.formState.errors.origin.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              {...flightForm.register('destination')}
              type="text"
              placeholder="e.g. BOM"
              className={`${inputBase} ${flightForm.formState.errors.destination ? inputError : 'border-gray-300'}`}
            />
            {flightForm.formState.errors.destination && (
              <p className="mt-1 text-sm text-red-600">{flightForm.formState.errors.destination.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              {...flightForm.register('departureDate')}
              type="date"
              className={`${inputBase} [color-scheme:light] ${flightForm.formState.errors.departureDate ? inputError : 'border-gray-300'}`}
            />
            {flightForm.formState.errors.departureDate && (
              <p className="mt-1 text-sm text-red-600">{flightForm.formState.errors.departureDate.message}</p>
            )}
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
              Search
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={hotelForm.handleSubmit(onHotelSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              {...hotelForm.register('location')}
              type="text"
              placeholder="e.g. Mumbai"
              className={`${inputBase} ${hotelForm.formState.errors.location ? inputError : 'border-gray-300'}`}
            />
            {hotelForm.formState.errors.location && (
              <p className="mt-1 text-sm text-red-600">{hotelForm.formState.errors.location.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              {...hotelForm.register('checkIn')}
              type="date"
              className={`${inputBase} [color-scheme:light] ${hotelForm.formState.errors.checkIn ? inputError : 'border-gray-300'}`}
            />
            {hotelForm.formState.errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{hotelForm.formState.errors.checkIn.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              {...hotelForm.register('checkOut')}
              type="date"
              className={`${inputBase} [color-scheme:light] ${hotelForm.formState.errors.checkOut ? inputError : 'border-gray-300'}`}
            />
            {hotelForm.formState.errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{hotelForm.formState.errors.checkOut.message}</p>
            )}
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
              Search
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
