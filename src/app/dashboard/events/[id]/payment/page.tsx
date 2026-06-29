'use client';

import { useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Loader2, ChevronLeft, CreditCard, Shield, CheckCircle2,
  Calendar, MapPin, Users, Ticket, Lock, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { initiateRazorpayPayment } from '@/services/razorpay';
import type { PaymentOptions, BookingData } from '@/services/razorpay';
import { useAuthStore } from '@/store/useAuthStore';

function PaymentPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const eventId = params.id as string;
  const zoneName     = searchParams.get('zone') || 'General Entry';
  const zoneId       = searchParams.get('zoneId') || '';
  const quantity     = parseInt(searchParams.get('qty') || '1', 10);
  const pricePerSeat = parseFloat(searchParams.get('price') || '0');
  const commissionRate = parseFloat(searchParams.get('commission') || '10');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-payment', eventId],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/events/' + eventId + '/full');
      return res.data?.data || null;
    },
    staleTime: 30000,
  });

  const basePrice   = pricePerSeat * quantity;
  const platformFee = Math.round(basePrice * (commissionRate / 100));
  const totalPrice  = basePrice + platformFee;

  const isFree = pricePerSeat === 0;

  const handlePay = async () => {
    if (!event) return;
    setIsProcessing(true);
    try {
      if (isFree) {
        // Free event: directly book without payment
        await axiosInstance.post('/user/events/book', {
          eventId: event._id,
          ticketType: zoneName,
          zone: zoneName,
          pricePaid: 0,
          guestCount: quantity,
          guests: quantity,
          hostId: event.hostId?._id,
        });
        setPaymentDone(true);
        toast.success('You are in! Booking confirmed.');
        setTimeout(() => router.push('/dashboard/bookings'), 2000);
        return;
      }

      const po: PaymentOptions = {
        amount: totalPrice,
        receipt: 'rcpt_' + eventId + '_' + Date.now(),
        description: zoneName + ' x' + quantity + ' — ' + event.title,
        prefillName: user?.name || '',
        prefillEmail: user?.email || '',
        prefillContact: user?.phone || '',
      };
      const bd: BookingData = {
        eventId: event._id,
        ticketType: zoneName,
        zone: zoneName,
        pricePaid: totalPrice,
        guestCount: quantity,
        guests: quantity,
        hostId: event.hostId?._id,
      };

      const result = await initiateRazorpayPayment(po, bd);

      if (result.success) {
        setPaymentDone(true);
        toast.success('Payment successful! Booking confirmed.');
        setTimeout(() => router.push('/dashboard/bookings'), 2000);
      } else {
        toast.error(result.error || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (paymentDone) return (
    <div className="min-h-screen bg-[#05050A] flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h1>
        <p className="text-white/50 mb-6">You are all set. See you at the event.</p>
        <div className="w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </motion.div>
    </div>
  );

  const fd = event ? new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#05050A]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white">Complete Payment</h1>
            <p className="text-xs text-white/40">Review your order before paying</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Order details */}
          <div className="lg:col-span-3 space-y-6">

            {/* Event Card */}
            {event && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                {event.coverImage && (
                  <div className="w-full h-40 relative">
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-black text-white mb-3">{event.title}</h2>
                  <div className="space-y-2 text-sm text-white/50">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-400 shrink-0" /><span>{fd}</span></div>
                    {event.startTime && <div className="flex items-center gap-2"><Ticket className="w-4 h-4 text-violet-400 shrink-0" /><span>Doors open: {event.startTime}</span></div>}
                    {(event.venueName || event.locationData?.address) && (
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-violet-400 shrink-0" /><span>{event.venueName || event.locationData?.address}</span></div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Booking Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{zoneName}</p>
                      <p className="text-xs text-white/40">Zone / Ticket Type</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{isFree ? 'FREE' : 'Rs ' + pricePerSeat.toLocaleString('en-IN')}<span className="text-xs font-normal text-white/40 ml-1">/ person</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{quantity} Guest{quantity > 1 ? 's' : ''}</p>
                      <p className="text-xs text-white/40">Number of attendees</p>
                    </div>
                  </div>
                  {!isFree && <span className="text-lg font-bold text-white">Rs {basePrice.toLocaleString('en-IN')}</span>}
                </div>
              </div>
            </motion.div>

            {/* What to expect */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">What happens next</h3>
              <div className="space-y-3">
                {[
                  { icon: Lock, text: isFree ? 'Your spot is reserved instantly on confirmation' : 'Payment is processed securely via Razorpay', color: 'text-emerald-400' },
                  { icon: CheckCircle2, text: 'Your booking confirmation is sent to your email', color: 'text-blue-400' },
                  { icon: Ticket, text: 'Your e-ticket appears in My Bookings', color: 'text-violet-400' },
                  { icon: Sparkles, text: 'Show your ticket at the event entrance', color: 'text-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/50">
                    <item.icon className={"w-4 h-4 shrink-0 " + item.color} />{item.text}
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* RIGHT: Payment summary */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

              <div className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 border-b border-violet-500/20 px-6 py-5">
                <p className="text-xs text-violet-300/60 uppercase tracking-wider font-semibold mb-1">Payment Summary</p>
                <p className="text-3xl font-black text-white">{isFree ? 'FREE' : 'Rs ' + totalPrice.toLocaleString('en-IN')}</p>
                {!isFree && <p className="text-xs text-white/30 mt-1">All taxes & fees included</p>}
              </div>

              <div className="px-6 py-5 space-y-5">

                {/* Breakdown */}
                {!isFree && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/50">
                      <span>{zoneName} x{quantity}</span>
                      <span>Rs {basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Platform Fee ({commissionRate}%)</span>
                      <span>Rs {platformFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10 text-base">
                      <span>Total Payable</span>
                      <span className="text-violet-300">Rs {totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Payer info */}
                {user && (
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm">
                    <p className="text-xs text-white/30 mb-1">Booking for</p>
                    <p className="font-semibold text-white">{user.name || 'Guest'}</p>
                    {user.email && <p className="text-xs text-white/40">{user.email}</p>}
                  </div>
                )}

                {/* Pay button */}
                <button
                  id="razorpay-pay-btn"
                  onClick={handlePay}
                  disabled={isProcessing || !event}
                  className={"w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 " + (isProcessing || !event ? "bg-white/10 text-white/30 cursor-not-allowed" : isFree ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 active:scale-[0.98]" : "bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-600/30 active:scale-[0.98]")}
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : isFree ? (
                    <><CheckCircle2 className="w-5 h-5" /> Confirm Free Booking</>
                  ) : (
                    <><CreditCard className="w-5 h-5" /> Pay with Razorpay</>
                  )}
                </button>

                {/* Trust signals */}
                <div className="space-y-2">
                  <p className="flex items-center justify-center gap-1.5 text-xs text-white/20">
                    <Lock className="w-3 h-3" />256-bit SSL encryption
                  </p>
                  {!isFree && (
                    <p className="flex items-center justify-center gap-1.5 text-xs text-white/20">
                      <Shield className="w-3 h-3" />Powered by Razorpay · RBI compliant
                    </p>
                  )}
                </div>

                {/* Razorpay logo row */}
                {!isFree && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="text-xs text-white/20">Accepted:</span>
                    <span className="text-xs text-white/30 font-semibold">UPI · Cards · Net Banking · Wallets</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentPageInner />
    </Suspense>
  );
}