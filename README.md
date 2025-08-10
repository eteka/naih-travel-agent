# NAIH Travel Agent (Beta)

This repository contains a Next.js 14 application that powers the **AI Travel Agent** for the Nigeria Aviation Innovation Hub (NAIH).  The app helps users plan trips, compare flight options, estimate carbon emissions and export itineraries.

## Features

- **Chat‑based planning** – Users can ask free‑form questions to receive a summary of flight options and recommendations.
- **Flight search** – Proxy to Amadeus Self‑Service APIs when `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` are provided.  Without these keys the app runs in demo mode using mock results.
- **Ranking and rationale** – Options are ranked by price or duration.  A concise summary is generated via Google’s Generative AI (Gemini) when `GOOGLE_GENAI_API_KEY` is set.  Otherwise a deterministic fallback summarises the options.
- **Carbon estimates** – Each option includes a CO₂ estimate computed with a simple emissions factor.  A helper produces an embeddable `<iframe>` for the official carbon calculator.
- **Advisory notices** – A persistent banner reminds users that results are for planning only.  No bookings or payment processing occur.
- **Responsive UI** – Built with Next.js App Router and Tailwind; supports mobile, keyboard navigation and accessible colours.
- **Optional email/PDF** – Stub API route ready for integration with SendGrid or similar providers.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in the values:

   - `GOOGLE_GENAI_API_KEY` – your Gemini key (leave blank to use fallback)
   - `AMADEUS_API_KEY` and `AMADEUS_API_SECRET` – optional credentials for live flight data (demo mode when blank)
   - `GA_MEASUREMENT_ID` – optional; Google Analytics measurement ID
   - `SENDGRID_API_KEY` – optional; API key for sending itinerary emails

3. **Run locally**

   ```bash
   npm run dev
   ```

   The app will be available at <http://localhost:3000>.

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Deployment

This app is designed to be deployed on **Vercel**.  Create a new repository on GitHub, push this code, then import the repository into Vercel.  Set the environment variables in the Vercel dashboard.  Vercel will automatically build and deploy the application; the live URL will look like `https://naih-travel-agent.vercel.app`.

If you enable GitHub Pages, a static marketing page is provided at `docs/index.html`.  Enable Pages for the `docs` folder on the main branch to host the landing page that links to the Vercel deployment.

## Troubleshooting

- **Missing API keys** – When Amadeus or Gemini keys are not provided, the app falls back to deterministic behaviour.  Ensure the keys are present in production for full functionality.
- **CORS errors** – All API routes are serverless functions under `/api`.  Calls from the client use relative paths and should not hit CORS issues.
- **Rate limits** – Amadeus Self‑Service and Google AI Studio enforce rate limits.  During testing you may hit quota; in such cases, the app will return fallback results.

## Security

- Never commit secrets to the repository.  Store keys only in environment variables (Vercel project settings or `.env.local`).
- Rotate your Google AI Studio key regularly, and ensure the key is restricted to the correct services.

## License

MIT.  See `LICENSE` for details.
