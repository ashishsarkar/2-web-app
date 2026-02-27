'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/lib/constants/routes';
import { flightSearchSchema } from '@/lib/validations/flights';
import { hotelSearchSchema } from '@/lib/validations/hotels';
import { z } from 'zod';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

const bundleSearchSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  departureDate: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

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

  const bundleForm = useForm({
    resolver: zodResolver(bundleSearchSchema),
    defaultValues: { destination: '', departureDate: '', checkIn: '', checkOut: '' },
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

  const onBundleSubmit = (data) => {
    const params = new URLSearchParams({ destination: data.destination });
    if (data.departureDate) params.set('departureDate', data.departureDate);
    if (data.checkIn) params.set('checkIn', data.checkIn);
    if (data.checkOut) params.set('checkOut', data.checkOut);
    router.push(`${ROUTES.BUNDLE_SEARCH}?${params}`);
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
        <button
          type="button"
          onClick={() => setActiveTab('bundle')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'bundle' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✈+🏨 Bundle
        </button>
      </div>

      {activeTab === 'flights' && (
        <form onSubmit={flightForm.handleSubmit(onFlightSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="flight-origin">From</label>
            <LocationAutocomplete
              id="flight-origin"
              placeholder="City or airport code…"
              filterType="city"
              value={flightForm.watch('origin')}
              onChange={(val) => flightForm.setValue('origin', val, { shouldValidate: true })}
              onSelect={(loc) => {
                const val = loc.type === 'city' ? (loc.code || loc.name) : loc.name;
                flightForm.setValue('origin', val, { shouldValidate: true });
              }}
              hasError={!!flightForm.formState.errors.origin}
            />
            {flightForm.formState.errors.origin && (
              <p className="mt-1 text-sm text-red-600">{flightForm.formState.errors.origin.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="flight-dest">To</label>
            <LocationAutocomplete
              id="flight-dest"
              placeholder="City or airport code…"
              filterType="city"
              value={flightForm.watch('destination')}
              onChange={(val) => flightForm.setValue('destination', val, { shouldValidate: true })}
              onSelect={(loc) => {
                const val = loc.type === 'city' ? (loc.code || loc.name) : loc.name;
                flightForm.setValue('destination', val, { shouldValidate: true });
              }}
              hasError={!!flightForm.formState.errors.destination}
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
      )}
      {activeTab === 'hotels' && (
        <form onSubmit={hotelForm.handleSubmit(onHotelSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hotel-location">Location</label>
            <LocationAutocomplete
              id="hotel-location"
              placeholder="City, state or country…"
              value={hotelForm.watch('location')}
              onChange={(val) => hotelForm.setValue('location', val, { shouldValidate: true })}
              onSelect={(loc) => hotelForm.setValue('location', loc.name, { shouldValidate: true })}
              hasError={!!hotelForm.formState.errors.location}
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
      {activeTab === 'bundle' && (
        <form onSubmit={bundleForm.handleSubmit(onBundleSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bundle-dest">Destination</label>
            <LocationAutocomplete
              id="bundle-dest"
              placeholder="City, airport or country…"
              value={bundleForm.watch('destination')}
              onChange={(val) => bundleForm.setValue('destination', val, { shouldValidate: true })}
              onSelect={(loc) => bundleForm.setValue('destination', loc.code || loc.name, { shouldValidate: true })}
              hasError={!!bundleForm.formState.errors.destination}
            />
            {bundleForm.formState.errors.destination && (
              <p className="mt-1 text-sm text-red-600">{bundleForm.formState.errors.destination.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flight date</label>
            <input
              {...bundleForm.register('departureDate')}
              type="date"
              className={`${inputBase} [color-scheme:light] ${bundleForm.formState.errors.departureDate ? inputError : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              {...bundleForm.register('checkIn')}
              type="date"
              className={`${inputBase} [color-scheme:light] ${bundleForm.formState.errors.checkIn ? inputError : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              {...bundleForm.register('checkOut')}
              type="date"
              className={`${inputBase} [color-scheme:light] ${bundleForm.formState.errors.checkOut ? inputError : 'border-gray-300'}`}
            />
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
