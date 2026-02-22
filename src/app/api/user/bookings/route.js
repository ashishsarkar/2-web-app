import { NextResponse } from 'next/server';
import { mockBookingsStore } from '@/lib/api/mockStore';

export async function GET() {
  const bookings = Array.from(mockBookingsStore.values()).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  return NextResponse.json({ bookings });
}
