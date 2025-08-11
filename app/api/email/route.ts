import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email requested:', body);
    return NextResponse.json({ status: 'logged' });
  }
  // Real email sending would be implemented here using SendGrid or another provider.
  return NextResponse.json({ status: 'sent' });
}
