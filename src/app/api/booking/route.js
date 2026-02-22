import { NextResponse } from 'next/server';
import { mockBookingsStore } from '@/lib/api/mockStore';

export async function POST(request) {
  const body = await request.json();
  const id = 'BK' + Date.now();
  const booking = { id, status: 'confirmed', ...body, createdAt: new Date().toISOString() };
  mockBookingsStore.set(id, booking);
  return NextResponse.json(booking);
}
