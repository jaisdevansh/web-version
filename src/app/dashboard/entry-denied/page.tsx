'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Hand, X, AlertCircle, Users, Shirt } from 'lucide-react';
import Link from 'next/link';

export default function EntryDeniedPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight text-white">Access Status</h1>
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
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <Hand className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-black mb-2 text-white text-center">Entry Denied</h2>
        <p className="text-white/60 text-center max-w-sm">
          Your ticket was rejected at the venue entrance. Access to this event has been restricted.
        </p>
      </div>

      <h3 className="text-[10px] font-extrabold tracking-widest text-white/40 mb-3 ml-1">AFFECTED BOOKING</h3>
      <Card className="bg-white/[0.03] border-white/5 p-4 mb-8">
        <div className="flex gap-4 items-center">
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=200" 
            alt="Venue" 
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div>
            <h4 className="font-bold text-white mb-1 text-sm">VIP Booth V4 • Elite Lounge</h4>
            <p className="text-xs text-white/50">Sat, 24 Oct • 10:30 PM (4 Guests)</p>
          </div>
        </div>
      </Card>

      <h3 className="text-[10px] font-extrabold tracking-widest text-white/40 mb-3 ml-1">WHY DID THIS HAPPEN?</h3>
      <Card className="bg-white/[0.03] border-white/5 p-5 mb-8 flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <Shirt className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-1">Dress Code Violation</h4>
            <p className="text-xs text-white/60 leading-relaxed">The venue reserves the right to deny entry if dress policies are not met.</p>
          </div>
        </div>
        
        <div className="h-px bg-white/5" />
        
        <div className="flex gap-4">
          <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-1">Intoxication or Conduct</h4>
            <p className="text-xs text-white/60 leading-relaxed">Security can refuse entry to heavily intoxicated individuals for safety reasons.</p>
          </div>
        </div>

        <div className="h-px bg-white/5" />
        
        <div className="flex gap-4">
          <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-1">Invalid Ticket</h4>
            <p className="text-xs text-white/60 leading-relaxed">The QR code presented may have been scanned previously or deemed invalid.</p>
          </div>
        </div>
      </Card>

      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-5 text-center mb-10">
        <h4 className="font-bold text-white mb-2">Need clarification?</h4>
        <p className="text-xs text-white/60 leading-relaxed">
          If you believe this was an error, please reach out to support. Note that venue decisions at the door are final and non-refundable.
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 pb-6">
        <Link href="/settings/support" className="w-full">
          <Button variant="outline" className="w-full h-14 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-[15px]">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
