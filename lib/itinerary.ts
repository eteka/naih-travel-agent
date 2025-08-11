import type { FlightOption } from './flight';

function totalDuration(f: FlightOption): number {
  return f.segments.reduce((sum, seg) => sum + seg.durationMinutes, 0);
}

/**
 * Rank flights based on preference.
 * @param flights List of flight options
 * @param preference 'price' or 'time'
 */
export async function rankFlights(
  flights: FlightOption[],
  preference: string
): Promise<FlightOption[]> {
  const copy = [...flights];
  if (preference === 'time') {
    copy.sort((a, b) => totalDuration(a) - totalDuration(b));
  } else {
    copy.sort((a, b) => a.price - b.price);
  }
  return copy;
}

/**
 * Compose a textual summary of flight options.  Uses Gemini if a key is available, else deterministic summary.
 * @param flights Sorted flight options
 * @param preference Ranking preference
 * @param details Original search details
 */
export async function composeItinerary(
  flights: FlightOption[],
  preference: string,
  details: any
): Promise<string> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    // Fallback deterministic summary
    const lines = flights
      .map((f, i) => {
        const hours = (totalDuration(f) / 60).toFixed(1);
        return `${i + 1}. ${f.airline} – ${f.segments[0].origin}→${f.segments[f.segments.length - 1].destination} at NGN ${f.price.toFixed(0)} (~${hours}h, ${f.stops} stop${f.stops !== 1 ? 's' : ''}).`;
      })
      .join(' ');
    return `Here are your options for ${details.origin} to ${details.destination} on ${details.date}: ${lines}`;
  }
  try {
    const content = flights
      .map((f) => {
        const hours = (totalDuration(f) / 60).toFixed(1);
        return `${f.airline} flight ${f.id} from ${f.segments[0].origin} to ${f.segments[f.segments.length - 1].destination} on ${details.date}, price ${f.price} ${f.currency}, duration ${hours} hours, ${f.stops} stop(s), CO2 ${f.carbonKg || '?'}kg.`;
      })
      .join('\n');
    const prompt = `You are an AI travel agent. Summarize and rank these flight options based on ${preference}. Provide a concise summary for the traveller in Lagos time and Nigerian Naira (NGN). Options:\n${content}`;
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );
    const data = await resp.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Here are some flight options.'
    );
  } catch (err) {
    console.error('Gemini error', err);
    return '';
  }
}
