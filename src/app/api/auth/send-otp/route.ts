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

    // Now connect to MongoDB to fetch the generated OTP
    if (process.env.MONGO_URI) {
      const client = new MongoClient(process.env.MONGO_URI);
      try {
        await client.connect();
        const db = client.db('entry_club');
        // Fetch the most recent OTP for this email
        const otpDoc = await db.collection('otps').find(
          { identifier: identifier }
        ).sort({ createdAt: -1 }).limit(1).toArray();

        if (otpDoc.length > 0 && otpDoc[0].otp) {
          const otp = otpDoc[0].otp;
          console.log(`[NEXT OTP PROXY] Fetched OTP from DB for ${identifier}`);

          // Send email using nodemailer
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
            logger: true, // Output logs to console
            debug: true,  // Include SMTP traffic
          });

          const mailOptions = {
            from: `"${process.env.FROM_NAME || 'Entry Club'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: identifier,
            subject: 'Your Login OTP Code',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #000;">Welcome to Entry Club</h2>
                <p style="color: #444; font-size: 16px;">Here is your one-time password to log in:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <h1 style="font-size: 32px; letter-spacing: 6px; color: #2563eb; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #666; font-size: 14px;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log(`[NEXT OTP PROXY] Email sent successfully to ${identifier}`);
        } else {
          console.error('[NEXT OTP PROXY] OTP not found in database for:', identifier);
        }
      } catch (dbError: any) {
        console.error('[NEXT OTP PROXY] Database/Email Error:', dbError.message);
        console.error('--- FULL EMAIL ERROR TRACE ---');
        console.error(dbError);
        return NextResponse.json({ success: false, message: 'Failed to send OTP email: ' + dbError.message }, { status: 500 });
      } finally {
        await client.close();
      }
    } else {
      console.error('[NEXT OTP PROXY] MONGO_URI is not set. Cannot fetch OTP.');
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    return NextResponse.json(data, { status: backendRes.status });

  } catch (error: any) {
    console.error('[NEXT OTP PROXY] Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
