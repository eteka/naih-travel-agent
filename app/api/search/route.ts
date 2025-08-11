import { NextResponse } from 'next/server';
import { searchFlights } from '../../../../lib/flight';

export async function POST(req: Request) {
  const body = await req.json();
  const flights = await searchFlights(body);
  return NextResponse.json({ flights });
}
