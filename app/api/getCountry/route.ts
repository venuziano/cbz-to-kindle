import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const xff = req.headers.get('x-forwarded-for') || '';
    const userIP = xff.split(',')[0]?.trim() || 'Unknown';
    console.log('userIP', userIP)
    const countryResponse = await fetch(`https://ipapi.co/${userIP}/country/`);
    const country = await countryResponse.text();
    console.log('country', country)

    return NextResponse.json({ country, userIP });
  } catch (error) {
    console.error('Error in GET /api/getCountry:', error);
    return NextResponse.json({ error: 'Failed to get user country' }, { status: 500 });
  }
}