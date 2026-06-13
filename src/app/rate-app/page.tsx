'use client';

import { X, Smartphone, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RateAppPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Gradients (as seen in screenshot) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1a1b4b] rounded-full blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2d1b4e] rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-[#2a1b4d] rounded-full blur-[80px] opacity-50 pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto min-h-[600px] flex flex-col md:flex-row items-stretch justify-center p-6 gap-8 z-10">
        
        {/* Left Side: Graphic & Info */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#110e1f]/80 to-[#0a0812]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#5c40ad]/20 blur-[80px]" />
          
          {/* Close Button (moved to top-left of this card) */}
          <button 
            onClick={() => router.back()} 
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.05] flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors z-20 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

        {/* Icon with glowing background */}
        <div className="relative mb-8 z-20">
          <div className="absolute inset-0 bg-[#4F378B] rounded-full blur-[30px] opacity-80" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-[#5c40ad] to-[#3b2377] flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(92,64,173,0.5)]">
            
            {/* Mobile Icon (Smartphone) */}
            <div className="md:hidden w-10 h-16 border-[3px] border-white rounded-xl flex items-center justify-center relative">
              <div className="absolute top-1 w-3 h-1 bg-white/50 rounded-full" />
              <div className="absolute bottom-1 w-4 h-1 bg-white/50 rounded-full" />
            </div>

            {/* Desktop Icon (Laptop) */}
            <div className="hidden md:flex flex-col items-center justify-center relative mt-1">
              <div className="w-14 h-9 border-[3px] border-white rounded-t-lg rounded-b-sm relative flex items-center justify-center">
                 <div className="absolute top-1 w-1.5 h-1.5 bg-white/50 rounded-full" />
              </div>
              <div className="w-[72px] h-2 bg-white rounded-b-md" />
              <div className="absolute bottom-[2px] w-4 h-[2px] bg-black/20 rounded-full" />
            </div>

          </div>
        </div>
          
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10 text-center">Entry Club Experience</h2>
        <p className="text-white/50 text-center text-sm relative z-10">Your feedback helps us create better premium features for you.</p>
        </div>

        {/* Right Side: Glassmorphism Rating Form */}
        <div className="w-full md:w-7/12 bg-[#110e1f]/60 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-14 flex flex-col items-center justify-center text-center relative shadow-2xl">
          
          <h1 className="text-[32px] md:text-5xl font-extrabold text-white mb-4 tracking-tight">Rate Your App</h1>
          <p className="text-[#8888a0] text-xl mb-12 font-medium">Review about app</p>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-4 mb-16">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              >
                <Star 
                  className={`w-12 h-12 md:w-16 md:h-16 transition-all ${
                    (hoverRating || rating) >= star 
                      ? 'fill-white text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]' 
                      : 'fill-transparent text-[#44445c] stroke-[2px]'
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button 
            className="w-full max-w-sm bg-[#563b9e] hover:bg-[#6849bc] text-white text-lg font-bold py-5 rounded-full transition-all shadow-[0_10px_30px_rgba(86,59,158,0.4)] hover:shadow-[0_10px_40px_rgba(86,59,158,0.6)] hover:-translate-y-1 mb-6 cursor-pointer"
          >
            Submit App Review
          </button>

          {/* Maybe Later Link */}
          <button 
            onClick={() => router.back()}
            className="text-[#6b6b85] hover:text-[#9a9ab5] font-semibold text-base transition-colors cursor-pointer"
          >
            Maybe Later
          </button>

        </div>
      </div>
    </div>
  );
}
