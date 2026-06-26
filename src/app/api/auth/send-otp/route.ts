import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ success: false, message: 'Identifier required' }, { status: 400 });
    }

    const isEmail = identifier.includes('@');
    if (!isEmail) {
      // If it's a phone number, just forward to backend without email logic
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1';
      const backendRes = await fetch(`${backendUrl}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    // It's an email. Call backend to generate OTP and save to DB
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1';
    const backendRes = await fetch(`${backendUrl}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    
    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: backendRes.status });

  } catch (error: any) {
    console.error('[NEXT OTP PROXY] Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
