'use client';

import { ChevronLeft, Sparkles, Building2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export default function RewardsPage() {
  const router = useRouter();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/profile');
      return res.data.data;
    }
  });

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white flex justify-center font-sans relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a1b4b] rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2d1b4e] rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen relative z-10 px-6 lg:px-10 pb-20">
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#0A0A12]/80 backdrop-blur-xl flex items-center py-6 border-b border-white/[0.05] mb-10">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-[#151520] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors mr-6"
          >
            <ChevronLeft className="w-6 h-6 text-white/80" />
          </button>
          <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">Entry Club Rewards</h1>
        </div>

        {isLoading ? (
           <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Loyalty Balance & Empty State */}
          <div className="w-full lg:w-5/12 space-y-6">
          
          {/* Total Loyalty Balance Card */}
          <div className="bg-[#11111A] border border-white/[0.05] rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 blur-sm" />

            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
              <p className="text-[11px] font-bold tracking-[0.15em] text-white/50 uppercase">Total Loyalty Balance</p>
            </div>

            <h2 className="text-7xl font-bold text-white mb-4 tracking-tighter">{profile?.loyaltyPoints || 0}</h2>
            <p className="text-sm font-bold text-white/40 tracking-wider mb-8">₹{profile?.loyaltyPoints || 0} VALUE</p>

            <div className="h-px w-full bg-white/[0.05] mb-6" />

            <p className="text-xs font-semibold text-white/30 tracking-wider">NEXT TIER AT 500 PTS</p>
          </div>

          {/* Empty State Card */}
          <div className="bg-[#11111A]/50 border border-dashed border-white/[0.15] rounded-[2rem] p-12 text-center backdrop-blur-sm">
            <p className="text-[#8888a0] text-lg font-medium">You haven't redeemed any<br/>coupons yet.</p>
          </div>
          </div>

          {/* Right Column: Redeem Points Section */}
          <div className="w-full lg:w-7/12 bg-[#0C0C16] border border-white/[0.05] rounded-[2rem] p-8 lg:p-10 shadow-2xl">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase mb-8">Redeem Points</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Coupon 1 */}
              <div className="bg-[#151522] border border-white/[0.05] rounded-3xl p-6 flex flex-col relative overflow-hidden opacity-70 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-bold text-white">50% off</h4>
                    <span className="px-2.5 py-1 rounded-md border border-red-500/30 text-[10px] font-bold text-red-400 tracking-wider">SOLD OUT</span>
                  </div>
                </div>
                
                <p className="text-[#FFD700] font-bold text-base mb-2">50% OFF</p>
                <p className="text-sm font-medium text-[#6b6b85]">Min Order ₹0 • Valid on all</p>
              </div>

              {/* Coupon 2 */}
              <div className="bg-[#151522] border border-white/[0.05] rounded-3xl p-6 flex flex-col relative hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-4">Goug 50 rs off</h4>
                    <div className="inline-flex items-center gap-2 bg-[#1A1A24] border border-white/[0.05] rounded-lg px-3 py-2 mb-4">
                      <Building2 className="w-4 h-4 text-[#e5b370]" />
                      <span className="text-sm text-white/70">Events hosted by Kailash Ji</span>
                    </div>
                    <p className="text-[#FFD700] font-bold text-base mb-2">50% OFF</p>
                  </div>
                </div>
                {/* Redeem Button */}
                <div className="mt-auto pt-4 border-t border-white/[0.05] flex justify-end">
                  <button className="bg-[#1A1A24] hover:bg-white/10 border border-white/5 rounded-xl px-6 py-3 transition-colors cursor-pointer">
                    <span className="text-white/80 font-bold">Redeem for 50 ✦</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
        )}
      </div>
    </div>
  );
}
