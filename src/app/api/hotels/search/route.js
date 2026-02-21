import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || '';

  const file = path.join(process.cwd(), 'mocks', 'fixtures', 'hotels.json');
  const hotels = JSON.parse(readFileSync(file, 'utf8'));
  let results = hotels;
  if (location) results = results.filter((h) => h.location?.toLowerCase().includes(location.toLowerCase()));

  return NextResponse.json({ hotels: results });
}
