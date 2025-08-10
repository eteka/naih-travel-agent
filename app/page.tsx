'use client';

import { useState } from 'react';
import ResultCard from './(components)/ResultCard';

interface SearchInput {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export default function HomePage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    setLoading(true);
    const searchBody: SearchInput = {
      origin,
      destination,
      date,
      passengers
    };
    try {
      const searchRes = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchBody)
      });
      const searchData = await searchRes.json();
      const flights = searchData.flights || [];
      const itineraryRes = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flights,
          details: searchBody,
          preference: 'price'
        })
      });
      const itineraryData = await itineraryRes.json();
      setResults(itineraryData.ranked || []);
      setSummary(itineraryData.summary || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Travel Agent (Beta)</h1>
      <p className="mb-4 italic text-sm text-red-600">
        Advisory only; verify policies and prices before purchase.
      </p>
      <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="origin">
            Origin
          </label>
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded"
            placeholder="e.g., LOS"
            maxLength={3}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="destination"
          >
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded"
            placeholder="e.g., ABV"
            maxLength={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="date">
            Departure Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="passengers"
          >
            Passengers
          </label>
          <input
            id="passengers"
            type="number"
            min={1}
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 p-3 bg-green text-white rounded hover:bg-green/90"
          >
            {loading ? 'Searching…' : 'Search Flights'}
          </button>
        </div>
      </form>
      {summary && (
        <div className="my-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Itinerary Summary</h2>
          <p>{summary}</p>
        </div>
      )}
      <div className="grid gap-4 my-4">
        {results.map((flight: any, idx: number) => (
          <ResultCard key={idx} flight={flight} />
        ))}
      </div>
    </main>
  );
}
