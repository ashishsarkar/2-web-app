'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROUTES } from '@/lib/constants/routes';

const alertSchema = z.object({
  type: z.enum(['flight', 'hotel']),
  origin: z.string().optional(),
  destination: z.string().min(1, 'Destination is required'),
  targetPrice: z.string().min(1, 'Target price is required'),
});

const inputBase = 'w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900';
const inputError = 'border-red-500';

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(alertSchema),
    defaultValues: { type: 'flight', origin: '', destination: '', targetPrice: '' },
  });

  const onSubmit = (data) => {
    setAlerts((prev) => [...prev, { id: Date.now(), ...data }]);
    reset();
  };

  const removeAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Price Alerts</h1>

      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Create alert</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select {...register('type')} className={inputBase}>
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin (flights only)</label>
            <input {...register('origin')} type="text" placeholder="e.g. DEL" className={inputBase} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              {...register('destination')}
              type="text"
              placeholder="e.g. BOM or Mumbai"
              className={`${inputBase} ${errors.destination ? inputError : ''}`}
            />
            {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target price (₹)</label>
            <input
              {...register('targetPrice')}
              type="number"
              placeholder="e.g. 5000"
              className={`${inputBase} ${errors.targetPrice ? inputError : ''}`}
            />
            {errors.targetPrice && <p className="mt-1 text-sm text-red-600">{errors.targetPrice.message}</p>}
          </div>
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            Set alert
          </button>
        </form>
      </div>

      {alerts.length > 0 ? (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Your alerts</h2>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center bg-white rounded-xl p-4 shadow border border-gray-100"
              >
                <div>
                  <span className="font-medium capitalize">{a.type}</span>
                  {a.origin && <span> {a.origin} → </span>}
                  <span>{a.destination}</span>
                  <span className="block text-indigo-600">Alert when ≤ ₹{a.targetPrice}</span>
                </div>
                <button onClick={() => removeAlert(a.id)} className="text-sm text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No alerts yet. Create one above.</p>
      )}
    </div>
  );
}
