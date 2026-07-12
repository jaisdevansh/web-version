import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json({ success: false, message: 'Razorpay keys not configured' }, { status: 500 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    const isVerified = razorpay_signature === expectedSign;

    if (isVerified) {
      // NOTE: Since we are verifying in Next.js instead of the Node.js backend,
      // the complex database logic (updating Booking, Event, Host Wallet, etc.) 
      // will NOT run here automatically unless you connect to MongoDB and do it.
      // For now, this just verifies the signature and returns success.
      
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully via Next.js",
        data: bookingData 
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature sent!" }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[Next.js Verify Payment Error]', error);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
