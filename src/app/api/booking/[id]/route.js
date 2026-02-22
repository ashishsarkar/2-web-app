import { NextResponse } from 'next/server';
import { mockBookingsStore } from '@/lib/api/mockStore';

export async function GET(request, { params }) {
  const id = params.id;
  const booking = mockBookingsStore.get(id);
  if (!booking) {
    return NextResponse.json({ id, status: 'confirmed', type: 'flight', details: {} }, { status: 200 });
  }
  return NextResponse.json(booking);
}

export async function PATCH(request, { params }) {
  const id = params.id;
  const body = await request.json();
  const booking = mockBookingsStore.get(id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  const updated = { ...booking, ...body };
  if (body.status === 'cancelled') {
    updated.refundStatus = 'initiated';
    updated.refundInitiatedAt = new Date().toISOString();
  }
  mockBookingsStore.set(id, updated);
  return NextResponse.json(updated);
}
