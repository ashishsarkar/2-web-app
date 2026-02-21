import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ id: '1', email: 'demo@booking.com', name: 'Demo User', tier: 'Silver' });
}
