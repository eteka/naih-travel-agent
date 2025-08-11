import { NextResponse } from 'next/server';
import { rankFlights, composeItinerary } from '../../../lib/itinerary';
import type { FlightOption } from '../../../lib/flight';

export async function POST(req: Request) {
  const body = await req.json();
  const flights: FlightOption[] = body.flights || [];
  const details = body.details || {};
  const preference = body.preference || 'price';
  let summary = '';
  let ranked = flights;
  try {
    ranked = await rankFlights(flights, preference);
    summary = await composeItinerary(ranked, preference, details);
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json({ ranked, summary });
}
