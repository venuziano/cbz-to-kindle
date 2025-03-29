import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create an in-memory rate limiter: max 10 requests per 2 hours per IP.
const rateLimiter = new RateLimiterMemory({
  points: 6, // maximum requests
  duration: 2 * 60 * 60, // per 2 hours (in seconds)
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    await rateLimiter.consume(ip);
  } catch (rejRes) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { email, message } = await req.json();
    
    const transporterOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    };

    const transporter = nodemailer.createTransport(transporterOptions);

    await transporter.sendMail({
      from: `"CBZ Feedback" <${process.env.SMTP_USER}>`,
      to: process.env.FEEDBACK_RECEIVER!,
      subject: `New CBZ Feedback from ${email}`,
      text: message,
    });

    return NextResponse.json({ message: 'Feedback sent successfully!' });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { message: 'Failed to send feedback.' },
      { status: 500 }
    );
  }
}
