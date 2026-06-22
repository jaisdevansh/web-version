'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Vikram Patel",
    time: "5 days ago",
    text: "Thought it would be just another app, but plans actually happen here.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Tanvi Kulkarni",
    time: "1 week ago",
    text: "People matter more than the app, and here you find people who actually show up.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Neha Gupta",
    time: "4 days ago",
    text: "The best part? You don't have to convince anyone. People are already ready to join.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Priya Verma",
    time: "3 days ago",
    text: "Less overthinking here. Just join a plan and see for yourself.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    name: "Siddharth Reddy",
    time: "2 days ago",
    text: "Tried a coffee meetup. Felt a bit awkward at first, but got comfortable quickly.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    name: "Ananya Iyer",
    time: "1 week ago",
    text: "Posted a movie plan just to test it out. People actually showed up and we watched the movie.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop"
  },
  {
    id: 7,
    name: "Rohan Das",
    time: "1 days ago",
    text: "New to the city and didn't know anyone. Honestly, it was incredibly helpful.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
  },
  {
    id: 8,
    name: "Meera Joshi",
    time: "3 days ago",
    text: "I'm an introvert, but this community makes it so much easier to step out.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
  }
];

// Split reviews for two columns
const col1 = REVIEWS.slice(0, 4);
const col2 = REVIEWS.slice(4, 8);

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div className="bg-[#11111b] border border-[#2a2a3b] rounded-3xl p-6 flex flex-col gap-4 shadow-lg shrink-0">
      <div className="flex gap-1 justify-end">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < review.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-600'}`} 
          />
        ))}
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 mt-1">
          <Image src={review.avatar} alt={review.name} width={40} height={40} className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-white/90 text-[15px] leading-relaxed mb-4">
            {review.text}
          </p>
          <div className="flex flex-col items-end text-right">
            <span className="text-white font-bold text-sm">{review.name}</span>
            <span className="text-gray-400 text-xs">{review.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <section className="w-full bg-[#050505] py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-8 relative">
        
        {/* LEFT: Sticky Stamp Card */}
        <div className="w-full lg:w-[45%] lg:h-[600px] lg:sticky lg:top-24 flex items-center justify-center">
          <style dangerouslySetInnerHTML={{__html: `
            .stamp-cutout-large {
              mask: 
                linear-gradient(#000 0 0), 
                radial-gradient(circle at 0 24px, #000 16px, transparent 16.5px), 
                radial-gradient(circle at 100% 24px, #000 16px, transparent 16.5px), 
                radial-gradient(circle at 24px 0, #000 16px, transparent 16.5px), 
                radial-gradient(circle at 24px 100%, #000 16px, transparent 16.5px);
              mask-size: 100% 100%, 16px 48px, 16px 48px, 48px 16px, 48px 16px;
              mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
              mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
              mask-composite: subtract;
              -webkit-mask: 
                linear-gradient(#000 0 0), 
                radial-gradient(circle at 0 24px, #000 16px, transparent 16.5px), 
                radial-gradient(circle at 100% 24px, #000 16px, transparent 16.5px), 
                radial-gradient(circle at 24px 0, #000 16px, transparent 16.5px), 
                radial-gradient(circle at 24px 100%, #000 16px, transparent 16.5px);
              -webkit-mask-size: 100% 100%, 16px 48px, 16px 48px, 48px 16px, 48px 16px;
              -webkit-mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
              -webkit-mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
              -webkit-mask-composite: destination-out;
            }
          `}} />
          <div className="stamp-cutout-large bg-[#8B5CF6] p-8 w-full max-w-[500px] aspect-square rounded-[3rem] relative shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <Image 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop" 
                alt="Friends hanging out" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Vertical Marquee */}
        <div 
          className="w-full lg:w-[55%] h-[600px] relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
        >
          <div className="flex gap-6 h-full justify-center">
            {/* Column 1 - Scrolling up */}
            <div className="flex flex-col gap-6 w-full max-w-[350px] animate-marquee-vertical">
              {[...col1, ...col1].map((review, i) => (
                <ReviewCard key={`c1-${i}`} review={review} />
              ))}
            </div>

            {/* Column 2 - Scrolling down (reverse) */}
            <div className="flex flex-col gap-6 w-full max-w-[350px] animate-marquee-vertical-reverse">
              {[...col2, ...col2].map((review, i) => (
                <ReviewCard key={`c2-${i}`} review={review} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
