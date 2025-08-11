/**
 * Provides helper functions for carbon emissions calculations and embedding the official carbon calculator.
 */

/**
 * Returns an embeddable iframe for the given carbon calculator URL.
 * @param calcUrl The URL of the calculator to embed.
 */
export function embedHtmlForCalc(calcUrl: string): string {
  return `<iframe src="${calcUrl}" width="100%" height="900" loading="lazy" style="border:0;border-radius:8px"></iframe>`;
}

/**
 * Roughly estimate CO₂ emissions (kg) for a flight given a distance in kilometres.
 * The factor is approximate and used for demonstration purposes only.
 * @param distanceKm Total distance of flight in kilometres.
 */
export function estimateEF(distanceKm: number): number {
  const EF_PER_KM = 0.135; // kg CO₂ per km (approximate)
  return parseFloat((distanceKm * EF_PER_KM).toFixed(2));
}
