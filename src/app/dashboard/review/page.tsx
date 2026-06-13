'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Eye, Star, Sparkles, Users, Music, Flame } from 'lucide-react';

export default function WriteReviewPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isAnon, setIsAnon] = useState(true);

  // Mock event data based on the screenshot
  const reviewingEvent = {
    title: searchParams.get('title') || "aujlaaa",
    image: searchParams.get('image') || "/flawless.png"
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#050505] pt-10 pb-16">
      <div className="w-full max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-transparent hover:bg-white/5 border border-white/10 transition-colors flex items-center justify-center mr-4"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
              Write a Review
            </h1>
          </div>
          
          <button 
            onClick={() => setIsAnon(!isAnon)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isAnon ? 'bg-transparent text-white/80 border border-white/10' : 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Anon
          </button>
        </header>

        {/* Review Content */}
        <div className="bg-[#0b0c10] rounded-[2.5rem] border border-white/[0.03] overflow-hidden shadow-2xl">
          <div className="p-8 sm:p-10">
            
            {/* Event Banner */}
            <div className="bg-[#24153a] rounded-[2rem] p-5 mb-14 flex items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-black">
                <img src={reviewingEvent.image} className="w-full h-full object-cover" alt="Event" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540039155732-d674d6e3f0be?q=80&w=1000&auto=format&fit=crop' }} />
              </div>
              <div className="ml-6">
                <h2 className="text-white font-bold text-2xl mb-1.5 font-serif">{reviewingEvent.title}</h2>
                <p className="text-white/50 text-[15px] font-medium">How was your elite experience? ✨</p>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="mb-14 flex flex-col items-center">
              <h3 className="text-[#a89b88] text-xs font-bold tracking-[0.2em] mb-6 uppercase text-center w-full font-serif">Overall Rating</h3>
              <div className="flex justify-center space-x-3 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-12 h-12 text-white/10 hover:text-yellow-400 hover:fill-yellow-400 transition-all cursor-pointer transform hover:scale-110" />
                ))}
              </div>
              <p className="text-center text-[#a89b88]/60 text-xs font-bold tracking-[0.15em] uppercase font-serif">Tap to rate</p>
            </div>

            {/* Rate The Details */}
            <div className="mb-10">
              <h3 className="text-[#a89b88] text-xs font-bold tracking-[0.2em] mb-6 uppercase text-center font-serif">Rate the Details</h3>
              <div className="bg-[#12161f] border border-white/[0.03] rounded-3xl p-8 space-y-0">
                
                {/* Vibe */}
                <div className="pb-8 border-b border-white/[0.03]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center text-white font-medium text-lg font-serif">
                      <Sparkles className="w-5 h-5 mr-3 text-white/80" /> Vibe
                    </div>
                    <span className="text-white/20 font-medium text-lg">-</span>
                  </div>
                  <div className="flex justify-between max-w-[280px] mx-auto px-4">
                    {[1, 2, 3, 4, 5].map((circle) => (
                      <div key={circle} className="w-10 h-10 rounded-full border border-white/[0.15] cursor-pointer hover:bg-white/10 transition-all" />
                    ))}
                  </div>
                </div>

                {/* Service */}
                <div className="py-8 border-b border-white/[0.03]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center text-white font-medium text-lg font-serif">
                      <Users className="w-5 h-5 mr-3 text-white/80" /> Service
                    </div>
                    <span className="text-white/20 font-medium text-lg">-</span>
                  </div>
                  <div className="flex justify-between max-w-[280px] mx-auto px-4">
                    {[1, 2, 3, 4, 5].map((circle) => (
                      <div key={circle} className="w-10 h-10 rounded-full border border-white/[0.15] cursor-pointer hover:bg-white/10 transition-all" />
                    ))}
                  </div>
                </div>

                {/* Music */}
                <div className="pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center text-white font-medium text-lg font-serif">
                      <Music className="w-5 h-5 mr-3 text-white/80" /> Music
                    </div>
                    <span className="text-white/20 font-medium text-lg">-</span>
                  </div>
                  <div className="flex justify-between max-w-[280px] mx-auto px-4">
                    {[1, 2, 3, 4, 5].map((circle) => (
                      <div key={circle} className="w-10 h-10 rounded-full border border-white/[0.15] cursor-pointer hover:bg-white/10 transition-all" />
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Footer Button */}
          <div className="px-10 pb-10 pt-4 bg-[#0b0c10]">
            <button 
              className="w-full py-5 bg-white text-black hover:bg-white/90 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.01]"
              onClick={() => router.push('/dashboard')}
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
