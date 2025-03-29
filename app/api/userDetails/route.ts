import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";
import { cookies } from 'next/headers';

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const API_SECRET = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_API_KEY;

async function getClientId(): Promise<string | null> {
  const cookieStore = cookies();
  const gaCookie = (await cookieStore).get('_ga')?.value;

  // Extract the client_id from the _ga cookie
  const clientId = gaCookie ? gaCookie.split('.').slice(2).join('.') : null;
  return clientId;
}

// POST request handler
export async function POST(req: NextRequest) {
  if (!MEASUREMENT_ID || !API_SECRET) {
    return NextResponse.json({ message: 'GA ID or API Secret missing' }, { status: 500 });
  }

  const { category, action, label, page, fileName, fileSize } = await req.json();

  const payload = {
    client_id: await getClientId(),
    events: [{
      name: action,  
      params: {
        page_location: page || undefined,
        debug_mode: 1,
        category: category,
        label: label || '',
        ...(fileName && fileSize && {
          file_info: `${fileName}_FILE_SIZE:_${fileSize}`
        })
      }
    }]
  };



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

    return NextResponse.json({ message: 'Event Sent Successfully' });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ message: 'Error Sending Event' }, { status: 500 });
  }
}
