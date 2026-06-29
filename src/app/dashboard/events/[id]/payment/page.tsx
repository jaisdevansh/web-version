'use client';

import { useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Loader2, ChevronLeft, CreditCard, Shield, CheckCircle2,
  Calendar, MapPin, Users, Ticket, Lock, Sparkles, Armchair, Zap
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
  const seatIdsStr   = searchParams.get('seats') || '';
  const seatIds      = seatIdsStr ? seatIdsStr.split(',') : [];

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
          seatIds: seatIds,
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
        seatIds: seatIds,
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
              <div className="space-y-4">
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

                {seatIds.length > 0 && (
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10 mt-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <Armchair className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">Selected Seats</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {seatIds.map((seatId: string) => (
                          <span key={seatId} className="bg-white/10 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {seatId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
          <div className="lg:col-span-2 space-y-4">
            
            {/* Promo Code Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/5 bg-[#111116] p-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 pl-3">
                <Zap className="w-4 h-4 text-white/30" />
                <input 
                  type="text" 
                  placeholder="ENTER PROMO CODE" 
                  className="bg-transparent border-none outline-none text-xs font-semibold tracking-wider text-white placeholder-white/30 uppercase w-full"
                />
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-[#1D172E] text-[#8B5CF6] text-xs font-bold tracking-wider hover:bg-[#251D3A] transition-colors">
                APPLY
              </button>
            </motion.div>

            {/* Payment Summary Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="rounded-3xl border border-white/5 bg-[#111116] p-6 space-y-5">
              
              <div className="flex items-center gap-3 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6338F1]">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                  <path d="M12 17.5v-11"/>
                </svg>
                <h3 className="text-base font-semibold tracking-wide">Payment Summary</h3>
              </div>

              <div className="space-y-4 text-sm pt-2">
                <div className="flex justify-between items-center text-white/50">
                  <span>{zoneName} ({quantity} Guest{quantity > 1 ? 's' : ''})</span>
                  <span className="text-white font-medium">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                {seatIds.length > 0 && (
                  <div className="flex justify-between items-center text-white/50">
                    <span>Seats: {seatIds.join(', ')}</span>
                    <span className="text-white font-medium">Reserved</span>
                  </div>
                )}
                {!isFree && (
                  <div className="flex justify-between items-center text-white/50">
                    <span>Platform Fee</span>
                    <span className="text-white font-medium">₹{platformFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-white/50">Total Payable</span>
                  <span className="text-xl font-bold text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>

            {/* Payer info */}
            {user && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-3xl border border-white/5 bg-[#111116] px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Booking for</p>
                  <p className="font-semibold text-white text-sm">{user.name || 'Guest'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white/50" />
                </div>
              </motion.div>
            )}

            {/* Pay button */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="pt-6 space-y-4">
              <button
                id="razorpay-pay-btn"
                onClick={handlePay}
                disabled={isProcessing || !event}
                className={"w-full h-14 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 " + 
                  (isProcessing || !event ? "bg-white/10 text-white/30 cursor-not-allowed" : 
                  isFree ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]" : 
                  "bg-[#6338F1] hover:bg-[#5328D1] text-white shadow-lg shadow-[#6338F1]/20 active:scale-[0.98]")}
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : isFree ? (
                  <><CheckCircle2 className="w-5 h-5" /> Confirm Free Booking</>
                ) : (
                  <>Pay with Razorpay <Lock className="w-3.5 h-3.5 ml-1 opacity-70" /></>
                )}
              </button>
              
              {!isFree && (
                <p className="text-center text-[10px] text-white/30 font-semibold tracking-widest uppercase">
                  100% Secure Transaction
                </p>
              )}
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