import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

function getFlights() {
  const file = path.join(process.cwd(), 'mocks', 'fixtures', 'flights.json');
  return JSON.parse(readFileSync(file, 'utf8'));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';

  const flights = getFlights();
  let results = flights;
  if (origin) results = results.filter((f) => f.origin?.toLowerCase().includes(origin.toLowerCase()));
  if (destination) results = results.filter((f) => f.destination?.toLowerCase().includes(destination.toLowerCase()));

  return NextResponse.json({ flights: results });
}
