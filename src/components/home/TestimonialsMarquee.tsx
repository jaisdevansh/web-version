'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Vikram Patel",
    time: "2 days ago",
    text: "finally an app where people actually show up lol. went for a coffee meetup and ended up chilling for 3 hours.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1615109398623-88346a601842?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Tanvi Kulkarni",
    time: "1 week ago",
    text: "so much better than making plans on whatsapp groups where everyone just ghosts you 💀",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Neha Gupta",
    time: "4 days ago",
    text: "Ngl, was skeptical but ended up going to a pottery workshop. met some really cool folks there.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Priya Verma",
    time: "3 days ago",
    text: "the guestlist feature is an absolute lifesaver. skipped a massive queue at the club last saturday night.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    name: "Siddharth Reddy",
    time: "2 days ago",
    text: "found a sick techno gig through this. the crowd was amazing and the whole process was super smooth tbh",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    name: "Ananya Iyer",
    time: "1 week ago",
    text: "Love how easy it is to find niche stuff. went for a jazz & wine night and the vibe was immaculate ✨",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop"
  },
  {
    id: 7,
    name: "Rohan Das",
    time: "5 days ago",
    text: "Just moved to BLR and didn't know anyone. attended a board game night and already made a solid group of friends",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop"
  },
  {
    id: 8,
    name: "Meera Joshi",
    time: "3 days ago",
    text: "was tired of my friends always bailing on weekend plans so I hosted a sundowner here. 15 people showed up and it was mad fun.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop"
  }
];

// Split reviews for two columns
const col1 = REVIEWS.slice(0, 4);
const col2 = REVIEWS.slice(4, 8);

const ReviewCard = memo(function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
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
});

export const TestimonialsMarquee = memo(function TestimonialsMarquee() {
  return (
    <section className="w-full bg-[#050505] py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-8 relative">
        
        {/* LEFT: Sticky Stamp Card */}
        <div className="w-full lg:w-[45%] lg:h-[600px] lg:sticky lg:top-24 flex items-center justify-center">
          <div className="bg-[#a855f7] p-6 md:p-8 w-full max-w-[450px] aspect-square relative flex items-center justify-center overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            {/* Fake Stamp Cutout using section background color to simulate holes */}
            <div className="absolute inset-[-14px] border-[28px] border-dotted border-[#050505] rounded-[3rem] pointer-events-none z-10"></div>
            
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative z-0">
              <Image 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop" 
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

            {/* Column 2 - Scrolling down (reverse) - Hidden on mobile */}
            <div className="hidden md:flex flex-col gap-6 w-full max-w-[350px] animate-marquee-vertical-reverse">
              {[...col2, ...col2].map((review, i) => (
                <ReviewCard key={`c2-${i}`} review={review} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
});
