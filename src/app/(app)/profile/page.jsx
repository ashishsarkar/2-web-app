'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';
import { getProfile } from '@/lib/api/user';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res);
        if (!user) setUser(res);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get('/api/wallet').then((r) => setWalletBalance(r.data.balance || 0)).catch(() => {});
  }, []);

  const handleTopUp = async () => {
    const amount = Number(topUpAmount) || 0;
    if (amount <= 0) return;
    try {
      const { data } = await axios.post('/api/wallet', { action: 'topup', amount });
      setWalletBalance(data.balance);
      setTopUpAmount('');
    } catch {
      alert('Top-up failed');
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-48 bg-gray-200 rounded-xl animate-pulse" /></div>;
  }

  const p = profile || user;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 mb-6">
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

      <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Wallet / Credits</h2>
        <p className="text-2xl font-bold text-indigo-600 mb-4">₹{walletBalance.toLocaleString()}</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button onClick={handleTopUp} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
            Top up
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Mock wallet — use at checkout when available</p>
      </div>
    </div>
  );
}
