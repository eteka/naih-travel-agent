'use client';

interface Segment {
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  carrier: string;
  flightNumber: string;
  durationMinutes: number;
}

interface FlightOption {
  id: string;
  airline: string;
  price: number;
  currency: string;
  segments: Segment[];
  stops: number;
  carbonKg?: number;
  deepLink?: string;
}

export default function ResultCard({ flight }: { flight: FlightOption }) {
  const lastSegment = flight.segments[flight.segments.length - 1];
  return (
    <article className="p-4 bg-white rounded shadow">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="text-lg font-semibold">{flight.airline}</h3>
          <p className="text-sm">
            {flight.segments[0].origin} → {lastSegment.destination}
          </p>
          <p className="text-sm">
            {flight.stops} stop{flight.stops !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <p className="text-lg font-bold">
            {flight.currency} {flight.price.toFixed(2)}
          </p>
          {flight.carbonKg && (
            <p className="text-sm text-gray-600">
              CO₂: {flight.carbonKg.toFixed(1)} kg
            </p>
          )}
        </div>
      </div>
      {flight.deepLink && (
        <a
          href={flight.deepLink}
          target="_blank"
          rel="noopener"
          className="inline-block mt-2 text-green font-medium underline"
        >
          View Offer
        </a>
      )}
    </article>
  );
}