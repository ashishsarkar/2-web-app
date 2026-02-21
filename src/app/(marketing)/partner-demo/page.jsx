'use client';

import { useState } from 'react';
import { BookingWidget, HotelWidget } from '@booking/partner-sdk';

export default function PartnerDemoPage() {
  const [active, setActive] = useState('flight');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner SDK Demo</h1>
      <p className="text-gray-600 mb-8">White-label booking widgets for partners.</p>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActive('flight')}
          className={`px-4 py-2 rounded-lg font-medium ${active === 'flight' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
        >
          Flight Widget
        </button>
        <button
          onClick={() => setActive('hotel')}
          className={`px-4 py-2 rounded-lg font-medium ${active === 'hotel' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
        >
          Hotel Widget
        </button>
      </div>
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        {active === 'flight' ? (
          <div className="flex justify-center"><BookingWidget /></div>
        ) : (
          <div className="flex justify-center"><HotelWidget /></div>
        )}
      </div>
    </div>
  );
}
