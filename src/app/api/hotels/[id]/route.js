import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export async function GET(request, { params }) {
  const id = params.id;
  const file = path.join(process.cwd(), 'mocks', 'fixtures', 'hotels.json');
  const hotels = JSON.parse(readFileSync(file, 'utf8'));
  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
  return NextResponse.json(hotel);
}
