import { NextResponse } from 'next/server';
import { estimateEF } from '../../../../lib/carbon';

export async function POST(req: Request) {
  const { distanceKm } = await req.json();
  const carbonKg = estimateEF(distanceKm);
  return NextResponse.json({ carbonKg });
}
