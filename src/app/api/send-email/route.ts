import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, subject, message, html, secret } = body;

    console.log(`[NEXT SMTP] ====== NEW EMAIL REQUEST ======`);
    console.log(`[NEXT SMTP] To: ${email}, Subject: ${subject}`);
    console.log(`[NEXT SMTP] Secret provided in request: ${secret ? 'YES' : 'NO'}`);

    // Verify secret to ensure only backend can call this
    const expectedSecret = process.env.EMAIL_API_SECRET;
    console.log(`[NEXT SMTP] Expected Secret set in .env: ${expectedSecret ? 'YES' : 'NO'}`);
    
    if (!expectedSecret) {
      console.error('[NEXT SMTP] ❌ ERROR: EMAIL_API_SECRET is missing from environment variables!');
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }
    if (secret !== expectedSecret) {
      console.error('[NEXT SMTP] ❌ ERROR: Secret mismatch! Unauthorized access attempt.');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (!email || !subject || !message) {
      console.error('[NEXT SMTP] ❌ ERROR: Missing email fields in payload.');
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    console.log('[NEXT SMTP] Secret verified. Connecting to SMTP...');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Entry Club'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('[NEXT SMTP] Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
