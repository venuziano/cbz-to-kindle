import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const API_SECRET = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_API_KEY;

// POST request handler
export async function POST(req: NextRequest) {
  if (!MEASUREMENT_ID || !API_SECRET) {
    return NextResponse.json({ message: 'GA ID or API Secret missing' }, { status: 500 });
  }

  const { category, action, label } = await req.json();

  const payload = {
    client_id: crypto.randomUUID(),
    events: [{
      name: action,  
      params: {
        debug_mode: 1,
        category: category,
        label: label || '',
      }
    }]
  };
  console.log('payload', payload)
  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`GA Error: ${response.statusText}`);
    }
    console.log('response', response)
    return NextResponse.json({ message: 'Event Sent Successfully' });
  } catch (error) {
    console.error('GA Error:', error);
    Sentry.captureException(error);
    return NextResponse.json({ message: 'Error Sending Event' }, { status: 500 });
  }
}
