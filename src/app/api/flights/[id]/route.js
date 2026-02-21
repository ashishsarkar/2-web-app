import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export async function GET(request, { params }) {
  const id = params.id;
  const file = path.join(process.cwd(), 'mocks', 'fixtures', 'flights.json');
  const flights = JSON.parse(readFileSync(file, 'utf8'));
  const flight = flights.find((f) => f.id === id);
  if (!flight) return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
  return NextResponse.json(flight);
}
