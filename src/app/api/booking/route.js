import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const id = 'BK' + Date.now();
  return NextResponse.json({ id, status: 'confirmed', ...body });
}
