'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Eye, Star, Sparkles, Users, Music } from 'lucide-react';

export default function WriteReviewPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isAnon, setIsAnon] = useState(true);
  const [overallRating, setOverallRating] = useState(0);
  const [hoverOverall, setHoverOverall] = useState(0);
  
  const [vibeRating, setVibeRating] = useState(0);
  const [hoverVibe, setHoverVibe] = useState(0);
  
  const [serviceRating, setServiceRating] = useState(0);
  const [hoverService, setHoverService] = useState(0);
  
  const [musicRating, setMusicRating] = useState(0);
  const [hoverMusic, setHoverMusic] = useState(0);

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
      <div className="w-full max-w-7xl mx-auto px-6">
        
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
                className="w-full py-5 bg-white text-black hover:bg-white/90 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.01]"
                onClick={() => router.push('/dashboard')}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
