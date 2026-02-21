'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getProfile } from '@/lib/api/user';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res);
        if (!user) setUser(res);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-48 bg-gray-200 rounded-xl animate-pulse" /></div>;
  }

  const p = profile || user;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {p?.name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{p?.name || 'User'}</h2>
            <p className="text-gray-600">{p?.email || 'demo@booking.com'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Loyalty Tier</span>
            <span className="font-semibold text-amber-600">{p?.tier || 'Silver'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
