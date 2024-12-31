import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ipResponse: Response = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIP: string = ipData.ip;
    console.log('userIP', userIP)
    const countryResponse: Response = await fetch(`https://ipapi.co/${userIP}/country/`);
    const country: string = await countryResponse.text();

    return NextResponse.json({ country });
  } catch (error) {
    console.error('Error fetching country:', error);
    return NextResponse.json(
      { error: 'Failed to get user country' },
      { status: 500 }
    );
  }
}