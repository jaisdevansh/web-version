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

    // Now, instead of relying on the backend to return the OTP (which requires TWILIO_BYPASS=true),
    // we connect directly to the MongoDB database to retrieve the generated OTP!
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://jaisdevansh2004_db_user:V3pU4sMZdEEPwPzT@party.qaycsm4.mongodb.net/?appName=party";
    const client = new MongoClient(mongoUri);
    
    let otpCode = null;
    
    try {
      await client.connect();
      const db = client.db('test'); // Mongoose defaults to 'test' if no DB name is in the URI
      const otpsCollection = db.collection('otps'); // Mongoose pluralizes 'Otp' model to 'otps'
      
      // Wait a brief moment to ensure Mongoose has finished saving
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Fetch the most recent OTP for this email
      const otpDoc = await otpsCollection.findOne(
        { identifier: identifier },
        { sort: { createdAt: -1 } }
      );
      
      if (otpDoc && otpDoc.otp) {
        otpCode = otpDoc.otp;
      }
    } catch (dbError) {
      console.error('[NEXT OTP PROXY] MongoDB Error:', dbError);
    } finally {
      await client.close();
    }

    if (!otpCode) {
      console.error('[NEXT OTP PROXY] Failed to retrieve OTP from database');
      return NextResponse.json({ 
        success: false, 
        message: 'Internal server error. Failed to retrieve OTP.' 
      }, { status: 500 });
    }

    // Now send the email via Nodemailer on the Next.js server
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'info.zenbourg@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'your_app_password_here', // Make sure this is in .env
      },
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Entry Club'}" <${process.env.FROM_EMAIL || 'noreply@entryclub.com'}>`,
      to: identifier,
      subject: 'Your Login OTP - Entry Club',
      text: `Your Entry Club one-time password is: ${otpCode}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Entry Club Verification</h2>
          <p>Your one-time password for secure login is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 24px 0;">
            ${otpCode}
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    // Return success to the frontend, browser never sees the OTP!
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully to email',
      data: { type: 'email' } 
    });

  } catch (error: any) {
    console.error('[NEXT OTP PROXY] Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
