import axiosInstance from '@/lib/axios';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SZ2UV8QmCtqOFR';

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

const loadRazorpayScript = () => {
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

    // 1. Create order on backend
    const orderRes = await axiosInstance.post('/api/v1/payments/create-order', {
      amount: paymentOptions.amount,
      currency: 'INR',
      receipt: paymentOptions.receipt,
    });

    if (!orderRes.data.success) {
      return { success: false, error: orderRes.data.message || 'Failed to create order' };
    }

    const order = orderRes.data.data;

    return new Promise((resolve) => {
      const options = {
        key: orderRes.data.key_id || RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Entry Club',
        description: paymentOptions.description,
        image: 'https://i.imgur.com/n5tjHFD.png',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
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
