'use client';

import { useState, useEffect, useCallback } from 'react';

const inputBase = 'w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500';
const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const EMPTY_FORM = { type: 'flight', origin: '', destination: '', location: '', max_price: '' };

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${base}/api/alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.max_price || Number(form.max_price) <= 0) {
      setError('Please enter a valid target price.');
      return;
    }
    if (form.type === 'flight' && !form.destination) {
      setError('Destination is required for flight alerts.');
      return;
    }
    if (form.type === 'hotel' && !form.location) {
      setError('Location is required for hotel alerts.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: form.type,
        max_price: Number(form.max_price),
        ...(form.type === 'flight' ? { origin: form.origin, destination: form.destination } : {}),
        ...(form.type === 'hotel' ? { location: form.location } : {}),
      };
      const res = await fetch(`${base}/api/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create alert');
      setForm(EMPTY_FORM);
      await fetchAlerts();
    } catch {
      setError('Could not save alert. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeAlert = async (id) => {
    try {
      await fetch(`${base}/api/alerts/${id}`, { method: 'DELETE' });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silent
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Price Alerts</h1>
        <p className="text-gray-500 mt-1">Get notified when flight or hotel prices drop below your target.</p>
      </div>

      {/* Create alert form */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Create alert</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert type</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputBase}>
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>

          {form.type === 'flight' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin (optional)</label>
                <input
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. DEL"
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. BOM or Mumbai"
                  className={inputBase}
                />
              </div>
            </>
          )}

          {form.type === 'hotel' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Goa"
                className={inputBase}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target price (₹) *</label>
            <input
              name="max_price"
              value={form.max_price}
              onChange={handleChange}
              type="number"
              min="1"
              placeholder="e.g. 5000"
              className={inputBase}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Set alert'}
          </button>
        </form>
      </div>

      {/* Alert list */}
      <h2 className="font-semibold text-gray-900 mb-4">Your alerts</h2>
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading…</p>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 shadow">
          <p className="text-4xl mb-3">🔔</p>
          <p>No alerts yet. Create one above and we&apos;ll notify you when prices drop.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-start bg-white rounded-xl p-4 shadow border border-gray-100"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${a.type === 'flight' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {a.type === 'flight' ? '✈ Flight' : '🏨 Hotel'}
                  </span>
                  {a.active && <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">Active</span>}
                  {a.triggered_at && <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">Triggered</span>}
                </div>
                {a.type === 'flight' && (
                  <p className="text-sm text-gray-700">
                    {a.origin ? `${a.origin} → ` : ''}{a.destination}
                  </p>
                )}
                {a.type === 'hotel' && (
                  <p className="text-sm text-gray-700">{a.location}</p>
                )}
                <p className="text-indigo-600 font-semibold text-sm">Alert when ≤ ₹{a.max_price.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <button
                onClick={() => removeAlert(a.id)}
                className="text-sm text-red-500 hover:text-red-700 hover:underline ml-4 shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
