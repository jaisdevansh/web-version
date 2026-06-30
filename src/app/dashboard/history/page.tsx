'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ArrowRight, Loader2, ChevronLeft, Eye, Star, Sparkles, Users, Music, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [reviewingEvent, setReviewingEvent] = useState<any>(null);
  const [isAnon, setIsAnon] = useState(true);

  // Review states
  const [vibe, setVibe] = useState(0);
  const [service, setService] = useState(0);
  const [music, setMusic] = useState(0);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['myBookingsAll'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/bookings');
      return res.data.data?.bookings || [];
    },
    enabled: mounted && isAuthenticated,
  });

  if (!mounted || !isAuthenticated) return null;

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  
  // Filter only past bookings
  const pastBookings = bookings.filter((b: any) => 
    b.status === 'completed' || b.status === 'past' || b.status === 'cancelled'
  );

  const toggleFeedbackTag = (tag: string) => {
    setFeedbackTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async () => {
    if (!reviewingEvent) return;
    if (vibe === 0 && service === 0 && music === 0) {
      import('sonner').then(m => m.toast.error('Please rate at least one category.'));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/user/reviews', {
        eventId: reviewingEvent._id,
        hostId: reviewingEvent.hostId?._id || reviewingEvent.hostId,
        vibe: vibe || 1,
        service: service || 1,
        music: music || 1,
        feedback: feedbackTags.join(', '),
        isAnonymous: isAnon
      });
      import('sonner').then(m => m.toast.success('Review submitted successfully!'));
      setReviewingEvent(null);
      // Reset state
      setVibe(0);
      setService(0);
      setMusic(0);
      setFeedbackTags([]);
    } catch (err: any) {
      import('sonner').then(m => m.toast.error(err.response?.data?.message || 'Failed to submit review'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-full">
      <div className={`space-y-8 pb-12 transition-opacity duration-300 ${reviewingEvent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Activity History</h1>
          <p className="text-muted-foreground">Your past events and bookings.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#12161f] rounded-3xl p-6 border border-white/[0.03] shadow-lg flex flex-col h-[280px]">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-6 w-16 rounded-md bg-white/5" />
                  <Skeleton className="h-4 w-16 bg-white/5" />
                </div>
                <div className="flex items-center mb-8 flex-1">
                  <Skeleton className="w-20 h-20 rounded-2xl bg-white/5 shrink-0" />
                  <div className="ml-5 space-y-2 w-full">
                    <Skeleton className="h-3 w-20 bg-white/5" />
                    <Skeleton className="h-5 w-32 bg-white/5" />
                    <Skeleton className="h-3 w-16 bg-white/5" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-white/5">
                  <Skeleton className="h-5 w-24 bg-white/5" />
                  <Skeleton className="h-4 w-20 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            


            {/* Real Data Rendering */}
            {pastBookings.map((booking: any, i: number) => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#12161f] rounded-3xl p-6 border border-white/[0.03] shadow-lg shadow-black/50 hover:border-white/10 transition-colors flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md uppercase bg-[#064e3b]/30 text-[#34d399]`}>
                    {booking.status}
                  </span>
                  <span className="text-white/30 text-xs font-mono">#{booking.ticketNumber?.substring(0,8) || booking._id.substring(0,8).toUpperCase()}</span>
                </div>
                
                <div className="flex items-center mb-8 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {booking.eventId?.coverImage ? (
                      <img src={booking.eventId.coverImage} className="w-full h-full object-cover" alt="Event cover" />
                    ) : (
                      <span className="text-white text-3xl font-semibold">EC</span>
                    )}
                  </div>
                  <div className="ml-5">
                    <p className="text-[#3b82f6] text-xs font-bold tracking-wider uppercase mb-1.5">{booking.eventId?.venue || 'Entry Club'}</p>
                    <h3 className="text-white text-xl font-medium leading-tight mb-2 line-clamp-2">{booking.eventId?.title || 'General Access'}</h3>
                    <p className="text-white/40 text-sm">
                      {new Date(booking.eventId?.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-5 border-t border-white/5 mb-6">
                  <p className="text-white/80 font-medium text-base">Price: <span className="font-bold">₹{booking.pricePaid || 0}</span></p>
                  <button onClick={() => router.push(`/dashboard/bookings/${booking._id}`)} className="text-[#3b82f6] text-sm font-medium flex items-center hover:text-blue-400 transition-colors">
                    View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setReviewingEvent(booking.eventId);
                    setVibe(0); setService(0); setMusic(0); setFeedbackTags([]);
                  }}
                  className="w-full mt-auto py-3.5 bg-[#2e1a47] hover:bg-[#3b2359] text-[#d8b4fe] rounded-xl font-semibold text-sm transition-colors border border-purple-500/20"
                >
                  Write a Review
                </button>
              </motion.div>
            ))}

          </div>
        )}
      </div>

      {/* Write a Review Overlay (Web Adapted) */}
      <AnimatePresence>
        {reviewingEvent && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 flex items-start justify-center pt-10 pb-20"
          >
            <div className="w-full max-w-2xl bg-[#080b12] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col max-h-full">
              
              {/* Header */}
              <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#080b12]/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center">
                  <button 
                    onClick={() => setReviewingEvent(null)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center mr-4"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Write a Review
                  </h1>
                </div>
                
                <button 
                  onClick={() => setIsAnon(!isAnon)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isAnon ? 'bg-white/10 text-white/80' : 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Anon
                </button>
              </header>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-8 py-8 hide-scrollbar">
                
                {/* Event Banner */}
                <div className="bg-gradient-to-br from-[#2e1a47] to-[#1a102b] rounded-[2rem] p-6 mb-10 flex items-center shadow-inner border border-white/5">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                    <img src={reviewingEvent.image || "/flawless.png"} className="w-full h-full object-cover" alt="Event" />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-white font-bold text-2xl mb-1.5">{reviewingEvent.title || 'Event'}</h2>
                    <p className="text-white/60 text-lg leading-tight">How was your elite experience? ✨</p>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="mb-12 flex flex-col items-center">
                  <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] mb-6 uppercase text-center w-full">Overall Rating</h3>
                  <div className="flex justify-center space-x-4 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-12 h-12 text-white/20 hover:text-yellow-400 hover:fill-yellow-400 transition-all cursor-pointer transform hover:scale-110" />
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
                          <div 
                            key={circle} 
                            onClick={() => setVibe(circle)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 cursor-pointer transition-all transform hover:scale-110 ${vibe >= circle ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-white/10 hover:bg-white/10 hover:border-white/30'}`} 
                          />
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
                          <div 
                            key={circle} 
                            onClick={() => setService(circle)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 cursor-pointer transition-all transform hover:scale-110 ${service >= circle ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-white/10 hover:bg-white/10 hover:border-white/30'}`} 
                          />
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
                          <div 
                            key={circle} 
                            onClick={() => setMusic(circle)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 cursor-pointer transition-all transform hover:scale-110 ${music >= circle ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-white/10 hover:bg-white/10 hover:border-white/30'}`} 
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* What Stood Out */}
                <div className="mb-8">
                  <h3 className="text-white/40 text-sm font-bold tracking-[0.2em] mb-6 uppercase text-center">What Stood Out?</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => toggleFeedbackTag("Fire Night")}
                      className={`flex items-center px-5 py-3 border rounded-2xl text-base font-medium transition-all transform hover:-translate-y-1 ${feedbackTags.includes("Fire Night") ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-[#12161f] border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <Flame className={`w-5 h-5 mr-2 ${feedbackTags.includes("Fire Night") ? 'text-orange-400' : 'text-orange-500'}`} /> Fire Night
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

              {/* Sticky Footer */}
              <div className="p-8 border-t border-white/5 bg-[#080b12]/90 backdrop-blur-xl shrink-0">
                <button 
                  disabled={isSubmitting}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] ${isSubmitting ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_40px_rgba(59,130,246,0.3)]'}`}
                  onClick={handleSubmitReview}
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Submit Elite Review'}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global style to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
