'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Eye, Star, Sparkles, Users, Music } from 'lucide-react';

import { toast } from 'sonner';
import api from '@/lib/axios';

export default function WriteReviewPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isAnon, setIsAnon] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  
  const [overallRating, setOverallRating] = useState(0);
  const [hoverOverall, setHoverOverall] = useState(0);
  
  const [vibeRating, setVibeRating] = useState(0);
  const [hoverVibe, setHoverVibe] = useState(0);
  
  const [serviceRating, setServiceRating] = useState(0);
  const [hoverService, setHoverService] = useState(0);
  
  const [musicRating, setMusicRating] = useState(0);
  const [hoverMusic, setHoverMusic] = useState(0);

  const reviewingEvent = {
    title: searchParams.get('title') || "Event",
    image: searchParams.get('image') || "/flawless.png",
    eventId: searchParams.get('eventId') || ""
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Fetch existing review
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (mounted && isAuthenticated && reviewingEvent.eventId) {
        try {
          const res = await api.get(`/user/reviews/my?eventId=${reviewingEvent.eventId}`);
          if (res.data?.success && res.data.data) {
            const review = res.data.data;
            setExistingReviewId(review._id);
            setVibeRating(review.scores?.vibe || 0);
            setServiceRating(review.scores?.service || 0);
            setMusicRating(review.scores?.music || 0);
            setOverallRating(Math.round(review.avgScore || 0));
            setIsAnon(Boolean(review.isAnonymous));
            if (review.feedback) {
              setFeedbackTags(review.feedback.split(', ').filter(Boolean));
            }
          }
        } catch (error) {
          console.error("Failed to fetch existing review", error);
        }
      }
    };
    fetchExistingReview();
  }, [mounted, isAuthenticated, reviewingEvent.eventId]);

  const toggleFeedbackTag = (tag: string) => {
    setFeedbackTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!vibeRating || !serviceRating || !musicRating) {
      toast.error('Please rate all categories before submitting.');
      return;
    }
    
    if (!reviewingEvent.eventId) {
      toast.error('Event ID is missing. Cannot submit review.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (existingReviewId) {
        // Update existing review
        const res = await api.put('/user/reviews', {
          reviewId: existingReviewId,
          vibe: vibeRating,
          service: serviceRating,
          music: musicRating,
          feedback: feedbackTags.join(', '),
          isAnonymous: isAnon
        });
        if (res.data?.success) {
          toast.success('Review updated successfully!');
          router.push('/dashboard');
        }
      } else {
        // Create new review
        const res = await api.post('/user/reviews', {
          eventId: reviewingEvent.eventId,
          vibe: vibeRating,
          service: serviceRating,
          music: musicRating,
          feedback: feedbackTags.join(', '),
          isAnonymous: isAnon
        });
        if (res.data?.success) {
          toast.success('Review submitted successfully!');
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derive overall rating from details if the user sets them
  useEffect(() => {
    if (vibeRating || serviceRating || musicRating) {
      const avg = Math.round((vibeRating + serviceRating + musicRating) / 3);
      setOverallRating(avg);
    }
  }, [vibeRating, serviceRating, musicRating]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#050505] pt-6 sm:pt-10 pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-transparent hover:bg-white/5 border border-white/10 transition-colors flex items-center justify-center mr-3 sm:mr-4 shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Write a Review
            </h1>
          </div>
          
          <button 
            onClick={() => setIsAnon(!isAnon)}
            className={`flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              isAnon ? 'bg-transparent text-white/80 border border-white/10' : 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Anon
          </button>
        </header>

        {/* Web App Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: Event Poster */}
          <div className="lg:col-span-4">
            <div className="bg-[#24153a] rounded-3xl p-4 sm:p-6 border border-white/[0.03] shadow-2xl lg:sticky lg:top-24">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-black mb-4 sm:mb-6 max-w-xs mx-auto lg:max-w-none">
                <img src={reviewingEvent.image} className="w-full h-full object-cover" alt="Event" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop' }} />
              </div>
              <h2 className="text-white font-bold text-2xl sm:text-3xl mb-1 sm:mb-2 font-serif">{reviewingEvent.title}</h2>
              <p className="text-white/60 text-base sm:text-lg font-medium">How was your elite experience? ✨</p>
            </div>
          </div>

          {/* Right Column: Rating Form */}
          <div className="lg:col-span-8">
            <div className="bg-[#0b0c10] rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.03] overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="p-5 sm:p-8 lg:p-12 flex-1">
                
                {/* Overall Rating */}
                <div className="mb-10 sm:mb-16 flex flex-col items-center bg-[#12161f]/50 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/[0.02]">
                  <h3 className="text-[#a89b88] text-xs sm:text-sm font-bold tracking-[0.2em] mb-6 sm:mb-8 uppercase text-center w-full font-serif">Overall Rating</h3>
                  <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        onMouseEnter={() => setHoverOverall(star)}
                        onMouseLeave={() => setHoverOverall(0)}
                        onClick={() => setOverallRating(star)}
                        className={`w-10 h-10 sm:w-16 sm:h-16 transition-all cursor-pointer transform hover:scale-110 ${
                          (hoverOverall || overallRating) >= star 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-center text-[#a89b88]/60 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase font-serif">Tap to rate</p>
                </div>

                {/* Rate The Details */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-[#a89b88] text-xs sm:text-sm font-bold tracking-[0.2em] mb-6 sm:mb-8 uppercase font-serif">Rate the Details</h3>
                  <div className="bg-[#12161f] border border-white/[0.03] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 space-y-0">
                    
                    {/* Vibe */}
                    <div className="pb-6 sm:pb-8 border-b border-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex items-center text-white font-medium text-lg sm:text-xl font-serif">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-white/80" /> Vibe
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-6">
                        {[1, 2, 3, 4, 5].map((circle) => (
                          <div 
                            key={circle} 
                            onMouseEnter={() => setHoverVibe(circle)}
                            onMouseLeave={() => setHoverVibe(0)}
                            onClick={() => setVibeRating(circle)}
                            className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full cursor-pointer transition-all ${
                              (hoverVibe || vibeRating) >= circle
                                ? 'bg-white/80 border-white/80 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                : 'border border-white/[0.15] hover:bg-white/10'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Service */}
                    <div className="py-6 sm:py-8 border-b border-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex items-center text-white font-medium text-lg sm:text-xl font-serif">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-white/80" /> Service
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-6">
                        {[1, 2, 3, 4, 5].map((circle) => (
                          <div 
                            key={circle} 
                            onMouseEnter={() => setHoverService(circle)}
                            onMouseLeave={() => setHoverService(0)}
                            onClick={() => setServiceRating(circle)}
                            className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full cursor-pointer transition-all ${
                              (hoverService || serviceRating) >= circle
                                ? 'bg-white/80 border-white/80 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                : 'border border-white/[0.15] hover:bg-white/10'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Music */}
                    <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex items-center text-white font-medium text-lg sm:text-xl font-serif">
                        <Music className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-white/80" /> Music
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-6">
                        {[1, 2, 3, 4, 5].map((circle) => (
                          <div 
                            key={circle} 
                            onMouseEnter={() => setHoverMusic(circle)}
                            onMouseLeave={() => setHoverMusic(0)}
                            onClick={() => setMusicRating(circle)}
                            className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full cursor-pointer transition-all ${
                              (hoverMusic || musicRating) >= circle
                                ? 'bg-white/80 border-white/80 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                : 'border border-white/[0.15] hover:bg-white/10'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* What Stood Out */}
                <div className="mb-8">
                  <h3 className="text-[#a89b88] text-xs sm:text-sm font-bold tracking-[0.2em] mb-6 uppercase text-center font-serif">What Stood Out?</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => toggleFeedbackTag("Fire Night")}
                      className={`flex items-center px-5 py-3 border rounded-2xl text-base font-medium transition-all transform hover:-translate-y-1 ${feedbackTags.includes("Fire Night") ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-[#12161f] border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <span className="mr-2 text-orange-500">🔥</span> Fire Night
                    </button>
                    <button 
                      onClick={() => toggleFeedbackTag("Banging Music")}
                      className={`flex items-center px-5 py-3 border rounded-2xl text-base font-medium transition-all transform hover:-translate-y-1 ${feedbackTags.includes("Banging Music") ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-[#12161f] border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <Music className={`w-5 h-5 mr-2 ${feedbackTags.includes("Banging Music") ? 'text-blue-400' : 'text-blue-400'}`} /> Banging Music
                    </button>
                    <button 
                      onClick={() => toggleFeedbackTag("Great Crowd")}
                      className={`flex items-center px-5 py-3 border rounded-2xl text-base font-medium transition-all transform hover:-translate-y-1 ${feedbackTags.includes("Great Crowd") ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-[#12161f] border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <Sparkles className={`w-5 h-5 mr-2 ${feedbackTags.includes("Great Crowd") ? 'text-yellow-400' : 'text-yellow-400'}`} /> Great Crowd
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer Button */}
              <div className="p-5 sm:p-8 lg:p-10 pt-4 sm:pt-6 bg-[#0b0c10] mt-auto border-t border-white/[0.03]">
                <button 
                  className="w-full py-4 sm:py-5 bg-white text-black hover:bg-white/90 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : existingReviewId ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
