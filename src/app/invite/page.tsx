'use client';

import { ChevronLeft, Gift, Share2, Search, RefreshCw, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export default function InviteAndEarnPage() {
  const router = useRouter();

  const { data: referralData, isLoading } = useQuery({
    queryKey: ['referral-data'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/referral');
      return res.data;
    }
  });

  const handleShare = async () => {
    if (navigator.share && referralData?.referralCode) {
      try {
        await navigator.share({
          title: 'Join Entry Club',
          text: `Use my invite code ${referralData.referralCode} to get 50 bonus points on Entry Club!`,
          url: `${window.location.origin}/register?ref=${referralData.referralCode}`,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else if (referralData?.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode);
      alert('Referral code copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0A0A10]/80 backdrop-blur-xl flex items-center px-6 lg:px-10 py-6 border-b border-white/[0.05]">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-full bg-[#151520] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors mr-6"
        >
          <ChevronLeft className="w-6 h-6 text-white/80" />
        </button>
        <h1 className="text-2xl font-bold tracking-wide">Invite & Earn</h1>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-10">
        {isLoading ? (
           <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column: Loyalty & Stats */}
          <div className="w-full lg:w-5/12 space-y-8">
          
          {/* Main Loyalty Points Card */}
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl">
            {/* Soft glow in background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-blue-500/10 mx-auto flex items-center justify-center mb-6 border border-blue-500/20 relative z-10">
              <Gift className="w-8 h-8 text-blue-500" />
            </div>

            <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase mb-2 relative z-10">Your Loyalty Points</p>
            <h2 className="text-6xl font-bold text-white mb-8 tracking-tighter relative z-10">{referralData?.user?.loyaltyPoints || 0}</h2>

            <div className="h-px w-full bg-white/[0.05] mb-6 relative z-10" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-2xl font-bold text-blue-500 mb-1">{referralData?.referralCount || 0}</p>
                <p className="text-xs text-white/50 font-medium">Friends Invited</p>
              </div>
              <div className="w-px h-10 bg-white/[0.05]" />
              <div className="flex-1">
                <p className="text-2xl font-bold text-blue-500 mb-1">₹{(referralData?.referralCount || 0) * 200}</p>
                <p className="text-xs text-white/50 font-medium">Value Earned</p>
              </div>
            </div>
          </div>

          {/* Reward Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0A0A15] border border-[#1a1a3a] rounded-[1.5rem] p-5 text-center flex flex-col items-center justify-center shadow-lg">
              <p className="text-3xl font-bold text-[#4a72ff] mb-1">200</p>
              <p className="text-[10px] font-bold tracking-widest text-[#4a72ff]/50 uppercase mb-3">PTS</p>
              <p className="text-xs text-white/50 leading-relaxed font-medium">You earn when<br/>friend books</p>
            </div>
            
            <div className="bg-[#051105] border border-[#1a3a1a] rounded-[1.5rem] p-5 text-center flex flex-col items-center justify-center shadow-lg">
              <p className="text-3xl font-bold text-[#22c55e] mb-1">50</p>
              <p className="text-[10px] font-bold tracking-widest text-[#22c55e]/50 uppercase mb-3">PTS</p>
              <p className="text-xs text-white/50 leading-relaxed font-medium">Friend gets on<br/>signup</p>
            </div>
          </div>

          </div>

          {/* Right Column: Invite Actions */}
          <div className="w-full lg:w-7/12 bg-[#0A0A12] border border-white/[0.05] rounded-[2rem] p-8 lg:p-10 shadow-2xl">
            
            {/* Invite Code Section */}
            <div className="space-y-4 mb-10">
              <label className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase pl-1">Your Invite Code</label>
              <div className="flex items-center bg-[#11111A] border border-white/[0.08] rounded-2xl p-2 pl-6 shadow-inner">
                <span className="flex-1 text-2xl font-bold tracking-[0.25em] text-white">{referralData?.referralCode || 'N/A'}</span>
                <button onClick={handleShare} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer">
                  <Share2 className="w-5 h-5" />
                  <span className="text-lg">Share Code</span>
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-white/[0.05] mb-10" />

            {/* Contacts Search Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pl-1 pr-2">
                <label className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Invite From Contacts</label>
                <button className="text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 p-2 rounded-full">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search friends to invite..."
                  className="w-full bg-[#11111A] border border-white/[0.08] rounded-2xl pl-14 pr-6 py-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/30"
                />
              </div>

              {/* Dummy List Space */}
              <div className="pt-6 h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl mt-6">
                 <p className="text-white/20 font-medium">No contacts synced yet.</p>
              </div>
            </div>

          </div>

        </div>
        )}
      </div>
    </div>
  );
}
