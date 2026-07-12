import axiosInstance from '@/lib/axios';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

export interface PaymentOptions {
  amount: number; // In INR
  receipt: string;
  description: string;
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
  notes?: Record<string, string>;
}

export interface BookingData {
  eventId: string;
  ticketType: string;
  tableId?: string;
  pricePaid: number;
  seatIds?: string[];
  guests?: number;
  guestCount?: number;
  zone?: string;
  hostId?: string;
}

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (
  paymentOptions: PaymentOptions,
  bookingData: BookingData
): Promise<{ success: boolean; booking?: any; error?: string }> => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      return { success: false, error: 'Razorpay SDK failed to load. Are you offline?' };
    }

    // 1. Create order on Next.js backend
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paymentOptions.amount,
        currency: 'INR',
        receipt: paymentOptions.receipt,
      })
    });
    const orderData = await orderRes.json();

    if (!orderData.success) {
      return { success: false, error: orderData.message || 'Failed to create order' };
    }

    const order = orderData.data;
    
    // Debugging: Let's see exactly what the backend is returning
    console.log("Next.js API Order Response:", orderData);
    
    const finalKey = orderData.key_id || RAZORPAY_KEY_ID;
    if (!finalKey) {
      console.error("Razorpay key is missing! Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env");
      return { success: false, error: 'Payment gateway configuration is missing on the client. (Razorpay Key ID not found)' };
    }

    return new Promise((resolve) => {
      const options = {
        key: finalKey,
        amount: order.amount,
        currency: 'INR',
        name: 'Entry Club',
        description: paymentOptions.description,
        image: 'https://i.imgur.com/n5tjHFD.png',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend to trigger booking storage
            const verifyRes = await axiosInstance.post('/api/v1/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                ...bookingData,
                pricePaid: paymentOptions.amount,
              },
            });

            if (verifyRes.data.success) {
              resolve({ success: true, booking: verifyRes.data.data });
            } else {
              resolve({ success: false, error: verifyRes.data.message || 'Verification failed' });
            }
          } catch (err: any) {
            resolve({ success: false, error: err.response?.data?.message || 'Verification failed' });
          }
        },
        prefill: {
          name: paymentOptions.prefillName || '',
          email: paymentOptions.prefillEmail || '',
          contact: paymentOptions.prefillContact || '',
        },
        notes: paymentOptions.notes || {},
        theme: {
          color: '#7c4dff', // Deep Maroon/Primary color equivalent
        },
        modal: {
          ondismiss: function () {
            resolve({ success: false, error: 'Payment cancelled by user' });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        resolve({ success: false, error: response.error.description });
      });

      rzp.open();
    });
  } catch (error: any) {
    return { success: false, error: error.message || 'Payment initiation failed' };
  }
};
