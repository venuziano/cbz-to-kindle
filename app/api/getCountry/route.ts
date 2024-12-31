import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  try {
    const xff = req.headers.get('x-forwarded-for') || '';
    const userIP = xff.split(',')[0]?.trim() || 'Unknown';
    
    const countryResponse = await fetch(`https://ipapi.co/${userIP}/country/`);
    const country = await countryResponse.text();

    return NextResponse.json({ country, userIP });
  } catch (error) {
    Sentry.captureException(error)
    console.error('Error in GET /api/getCountry:', error);
    return NextResponse.json({ error: 'Failed to get user country' }, { status: 500 });
  }
}