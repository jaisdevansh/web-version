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
    <div className="w-full max-w-3xl mx-auto pb-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 transition-colors flex items-center justify-center mr-4"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Write a Review
          </h1>
        </div>
        
        <button 
          onClick={() => setIsAnon(!isAnon)}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isAnon ? 'bg-black/20 text-white/80 border border-white/5' : 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          Anon
        </button>
      </header>

      {/* Review Content */}
      <div className="bg-[#080b12] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
        <div className="p-8 sm:p-10">
          
          {/* Event Banner */}
          <div className="bg-gradient-to-br from-[#2e1a47] to-[#1a102b] rounded-[2rem] p-6 mb-10 flex items-center shadow-inner border border-white/5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
              <img src={reviewingEvent.image} className="w-full h-full object-cover" alt="Event" />
            </div>
            <div className="ml-6">
              <h2 className="text-white font-bold text-2xl mb-1.5">{reviewingEvent.title}</h2>
              <p className="text-white/60 text-lg leading-tight">How was your elite experience? ✨</p>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="mb-12 flex flex-col items-center">
            <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] mb-6 uppercase text-center w-full">Overall Rating</h3>
            <div className="flex justify-center space-x-4 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-12 h-12 sm:w-14 sm:h-14 text-white/20 hover:text-yellow-400 hover:fill-yellow-400 transition-all cursor-pointer transform hover:scale-110" />
              ))}
            </div>
            <p className="text-center text-white/30 text-sm font-bold tracking-widest uppercase mt-2">Tap to rate</p>
          </div>

          {/* Rate The Details */}
          <div className="mb-12">
            <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] mb-6 uppercase text-center">Rate the Details</h3>
            <div className="bg-[#12161f] border border-white/[0.03] rounded-3xl p-8 space-y-8 shadow-inner">
              
              {/* Vibe */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-white font-medium text-xl">
                    <Sparkles className="w-6 h-6 mr-3 text-white/80" /> Vibe
                  </div>
                  <span className="text-white/20 font-bold text-xl">-</span>
                </div>
                <div className="flex justify-between max-w-sm mx-auto">
                  {[1, 2, 3, 4, 5].map((circle) => (
                    <div key={circle} className="w-12 h-12 rounded-full border-2 border-white/10 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all transform hover:scale-110" />
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-white/5" />

              {/* Service */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-white font-medium text-xl">
                    <Users className="w-6 h-6 mr-3 text-white/80" /> Service
                  </div>
                  <span className="text-white/20 font-bold text-xl">-</span>
                </div>
                <div className="flex justify-between max-w-sm mx-auto">
                  {[1, 2, 3, 4, 5].map((circle) => (
                    <div key={circle} className="w-12 h-12 rounded-full border-2 border-white/10 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all transform hover:scale-110" />
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-white/5" />

              {/* Music */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-white font-medium text-xl">
                    <Music className="w-6 h-6 mr-3 text-white/80" /> Music
                  </div>
                  <span className="text-white/20 font-bold text-xl">-</span>
                </div>
                <div className="flex justify-between max-w-sm mx-auto">
                  {[1, 2, 3, 4, 5].map((circle) => (
                    <div key={circle} className="w-12 h-12 rounded-full border-2 border-white/10 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all transform hover:scale-110" />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* What Stood Out */}
          <div className="mb-4">
            <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] mb-6 uppercase text-center">What Stood Out?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center px-6 py-4 bg-[#12161f] border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-2xl text-white/80 text-base font-medium transition-all transform hover:-translate-y-1">
                <Flame className="w-5 h-5 mr-3 text-orange-500" /> Fire Night
              </button>
              <button className="flex items-center px-6 py-4 bg-[#12161f] border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-2xl text-white/80 text-base font-medium transition-all transform hover:-translate-y-1">
                <Music className="w-5 h-5 mr-3 text-blue-400" /> Banging Music
              </button>
              <button className="flex items-center px-6 py-4 bg-[#12161f] border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-2xl text-white/80 text-base font-medium transition-all transform hover:-translate-y-1">
                <Sparkles className="w-5 h-5 mr-3 text-yellow-400" /> Great Crowd
              </button>
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="p-8 border-t border-white/5 bg-[#12161f]/50">
          <button 
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all transform hover:scale-[1.01]"
            onClick={() => router.push('/dashboard')}
          >
            Submit Elite Review
          </button>
        </div>
      </div>
    </div>
  );
}
