import { NextRequest, NextResponse } from 'next/server';

const SENTRY_URL = process.env.NEXT_PUBLIC_SENTRY_URL!;

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Create a filtered headers object
  const filteredHeaders = new Headers();
  const originalHeaders = req.headers;

  // Include only necessary headers
  if (originalHeaders.has("Content-Type")) {
    filteredHeaders.set("Content-Type", originalHeaders.get("Content-Type")!);
  }

  if (originalHeaders.has("User-Agent")) {
    filteredHeaders.set("User-Agent", originalHeaders.get("User-Agent")!);
  }

   // Remove cookies if you don't need them
  if (filteredHeaders.has("Cookie")) {
    filteredHeaders.delete("Cookie");
  }

  console.log('call')
  // Proxy the request to Sentry
  const response = await fetch(SENTRY_URL, {
    method: "POST",
    body,
    headers: filteredHeaders,
  });
  console.log('response', response)

  return new NextResponse(response.body, {
    headers: response.headers,
    status: response.status,
  });
}