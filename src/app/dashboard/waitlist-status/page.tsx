'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Hourglass, X, Bell, CreditCard, Zap } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistStatusPage() {
  const router = useRouter();
  const [canceling, setCanceling] = useState(false);

  const handleCancel = () => {
    setCanceling(true);
    setTimeout(() => {
      setCanceling(false);
      router.push('/dashboard/bookings');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[80vh] flex flex-col pb-32">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight text-white">Waitlist Status</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push('/dashboard')}
          className="rounded-full w-10 h-10 bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5 text-white" />
        </Button>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <Hourglass className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-black mb-2 text-white text-center">You're on the Waitlist!</h2>
        <p className="text-white/60 text-center max-w-sm mb-8">
          Your request is currently queued. We will notify you immediately if a spot becomes available.
        </p>

        <div className="bg-yellow-500/5 border border-yellow-500/20 px-10 py-6 rounded-2xl flex flex-col items-center">
          <p className="text-[10px] font-extrabold tracking-widest text-white/50 mb-1">CURRENT POSITION</p>
          <p className="text-5xl font-black text-yellow-500 tracking-tighter">#12</p>
          <p className="text-sm font-semibold text-white/40 mt-1">of 45 waiting</p>
        </div>
      </div>

      <h3 className="text-[10px] font-extrabold tracking-widest text-white/40 mb-3 ml-1">YOUR REQUEST</h3>
      <Card className="bg-white/[0.03] border-white/5 p-4 mb-8">
        <div className="flex gap-4 items-center mb-4">
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=200" 
            alt="Venue" 
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-bold text-white mb-1 text-sm">VIP Booth V4 • Elite Lounge</h4>
            <p className="text-xs text-white/50">Sat, 24 Oct • 10:30 PM (4 Guests)</p>
          </div>
        </div>
        <div className="h-px bg-white/5 mb-4" />
        <div className="flex justify-between items-center">
          <p className="text-sm text-white/50">Estimated Pre-Auth</p>
          <p className="text-sm font-bold text-white">₹25,000</p>
        </div>
      </Card>

      <Card className="bg-white/[0.03] border-white/5 p-4 mb-8 flex flex-col gap-4">
        <div className="flex gap-3 p-3 bg-yellow-500/5 rounded-xl items-start">
          <Bell className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-white/70 leading-relaxed">
            You will receive a push notification if your booking is confirmed.
          </p>
        </div>
        <div className="flex gap-3 p-3 bg-yellow-500/5 rounded-xl items-start">
          <CreditCard className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-white/70 leading-relaxed">
            Your card won't be charged unless your spot is successfully secured.
          </p>
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#050505] border-t border-white/5 z-40">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-full border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-base"
            onClick={handleCancel}
            disabled={canceling}
          >
            {canceling ? 'Canceling...' : 'Leave'}
          </Button>
          <Button 
            className="flex-[2] h-14 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-base flex items-center gap-2"
            onClick={() => router.push('/dashboard/waitlist-upgrade')}
          >
            Skip the Queue <Zap className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
