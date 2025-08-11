import { estimateEF } from './carbon';

export interface Segment {
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  carrier: string;
  flightNumber: string;
  durationMinutes: number;
}

export interface FlightOption {
  id: string;
  airline: string;
  price: number;
  currency: string;
  segments: Segment[];
  stops: number;
  carbonKg?: number;
  deepLink?: string;
}

export interface SearchInput {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

/**
 * Search for flight options using Amadeus Self-Service APIs or fallback to mock results.
 * @param input The search criteria.
 */
export async function searchFlights(input: SearchInput): Promise<FlightOption[]> {
  // When either API key is missing, run in demo mode with mock data.
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    return generateMockFlights(input);
  }
  try {
    // Retrieve OAuth token
    const tokenRes = await fetch(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.AMADEUS_API_KEY!,
          client_secret: process.env.AMADEUS_API_SECRET!,
          grant_type: 'client_credentials'
        })
      }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    // Build search URL
    const searchUrl = new URL(
      'https://test.api.amadeus.com/v2/shopping/flight-offers'
    );
    searchUrl.searchParams.append(
      'originLocationCode',
      input.origin.toUpperCase()
    );
    searchUrl.searchParams.append(
      'destinationLocationCode',
      input.destination.toUpperCase()
    );
    searchUrl.searchParams.append('departureDate', input.date);
    searchUrl.searchParams.append('adults', input.passengers.toString());
    searchUrl.searchParams.append('max', '5');
    const flightsRes = await fetch(searchUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const flightsData = await flightsRes.json();
    const options: FlightOption[] = [];
    if (Array.isArray(flightsData.data)) {
      for (const offer of flightsData.data) {
        const segments: Segment[] = [];
        const itineraries = offer.itineraries || [];
        for (const itin of itineraries) {
          for (const seg of itin.segments) {
            segments.push({
              origin: seg.departure.iataCode,
              destination: seg.arrival.iataCode,
              departure: seg.departure.at,
              arrival: seg.arrival.at,
              carrier: seg.carrierCode,
              flightNumber: seg.number,
              durationMinutes: parseDuration(seg.duration)
            });
          }
        }
        const stops = segments.length - 1;
        const price = parseFloat(offer.price.total);
        const currency = offer.price.currency || 'USD';
        const carbonKg = estimateEF(estimateDistance(segments));
        options.push({
          id: offer.id,
          airline: segments[0]?.carrier || 'Unknown',
          price,
          currency,
          segments,
          stops,
          carbonKg,
          deepLink: offer?.links?.flightOffers || ''
        });
      }
    }
    return options;
  } catch (err) {
    console.error('Amadeus error', err);
    return generateMockFlights(input);
  }
}

/**
 * Parse ISO 8601 duration (e.g. PT2H30M) into minutes.
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+)H(\d+)M?/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

/**
 * Estimate total distance (km) for a flight by summing durations multiplied by an average speed.
 */
function estimateDistance(segments: Segment[]): number {
  let totalMinutes = 0;
  for (const s of segments) totalMinutes += s.durationMinutes;
  const hours = totalMinutes / 60;
  return hours * 800; // approximate km assuming 800 km/h
}

/**
 * Generate mock flight options for demo mode.
 */
function generateMockFlights(input: SearchInput): FlightOption[] {
  const basePrice = 80000;
  return [
    {
      id: 'MOCK1',
      airline: 'Demo Air',
      price: basePrice,
      currency: 'NGN',
      segments: [
        {
          origin: input.origin,
          destination: input.destination,
          departure: `${input.date}T09:00:00`,
          arrival: `${input.date}T11:00:00`,
          carrier: 'DM',
          flightNumber: '001',
          durationMinutes: 120
        }
      ],
      stops: 0,
      carbonKg: estimateEF(800 * 2),
      deepLink: 'https://example.com/book/MOCK1'
    },
    {
      id: 'MOCK2',
      airline: 'Sky Nigeria',
      price: basePrice + 10000,
      currency: 'NGN',
      segments: [
        {
          origin: input.origin,
          destination: input.destination,
          departure: `${input.date}T14:00:00`,
          arrival: `${input.date}T18:00:00`,
          carrier: 'SN',
          flightNumber: '432',
          durationMinutes: 240
        }
      ],
      stops: 0,
      carbonKg: estimateEF(800 * 4),
      deepLink: 'https://example.com/book/MOCK2'
    },
    {
      id: 'MOCK3',
      airline: 'WestAir',
      price: basePrice - 5000,
      currency: 'NGN',
      segments: [
        {
          origin: input.origin,
          destination: 'ACC',
          departure: `${input.date}T06:00:00`,
          arrival: `${input.date}T08:00:00`,
          carrier: 'WA',
          flightNumber: '323',
          durationMinutes: 120
        },
        {
          origin: 'ACC',
          destination: input.destination,
          departure: `${input.date}T09:00:00`,
          arrival: `${input.date}T11:30:00`,
          carrier: 'WA',
          flightNumber: '324',
          durationMinutes: 150
        }
      ],
      stops: 1,
      carbonKg: estimateEF(800 * 4.5),
      deepLink: 'https://example.com/book/MOCK3'
    }
  ];
}
