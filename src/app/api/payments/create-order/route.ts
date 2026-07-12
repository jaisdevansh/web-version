import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt } = body;

    const amountNum = Number(amount);
    if (!amountNum || amountNum < 1 || isNaN(amountNum)) {
      return NextResponse.json({ success: false, message: 'Invalid amount. Must be at least 1 INR.' }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ success: false, message: 'Razorpay keys not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(amountNum * 100), // convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`.substring(0, 40),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      data: order,
      key_id: key_id,
    });
  } catch (error: any) {
    console.error('[Next.js Create Order Error]', error);
    return NextResponse.json({ success: false, message: error.message || 'Order creation failed' }, { status: 500 });
  }
}
