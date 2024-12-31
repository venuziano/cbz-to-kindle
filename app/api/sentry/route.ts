import { NextRequest, NextResponse } from 'next/server';

const SENTRY_URL = process.env.NEXT_PUBLIC_SENTRY_URL!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = new Headers(req.headers);
  headers.set('Host', new URL(SENTRY_URL).host);
  console.log('SENTRY_URL', SENTRY_URL)
  const response = await fetch(SENTRY_URL, {
    method: 'POST',
    body,
    headers,
  });

  return new NextResponse(response.body, {
    headers: response.headers,
    status: response.status,
  });
}