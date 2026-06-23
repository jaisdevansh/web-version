'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const POSTERS = [
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=300"
];

const NUM_CARDS = 100; // Significantly more cards for a dense, mosaic-like wall

interface CardData {
  id: number;
  image: string;
  speed: number;
  delay: number;
  floatOffset: number;
}

// Generate randomized cards strictly once at module evaluation time
// This prevents React Hydration mismatch between Server and Client, and saves massive CPU overhead.
const STATIC_CARDS: CardData[] = Array.from({ length: NUM_CARDS }).map((_, i) => ({
  id: i,
  image: POSTERS[i % POSTERS.length],
  speed: 4 + Math.random() * 4,
  delay: Math.random() * 3,
  floatOffset: 15 + Math.random() * 20
}));

export default function FloatingPosterWall() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for global parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Grid moves slower than the page to create subtle depth
  const globalY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10 pt-20 bg-black"
    >
      {/* 2D Panning Container */}
      <motion.div 
        style={{ 
          y: globalY
        }}
        className="absolute inset-0 z-0 flex items-center justify-center opacity-80"
      >
        <div 
          className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-12 gap-3 md:gap-4 w-[250vw] md:w-[200vw] h-[200vh] origin-center"
          style={{ transform: 'rotateZ(-12deg) scale(1.3)' }}
        >
          {STATIC_CARDS.map((card, i) => (
            <div
              key={card.id}
              className="aspect-[4/5] rounded-xl md:rounded-2xl bg-zinc-900 overflow-hidden relative group transform-gpu"
            >
              {/* Card Content Wrapper */}
              <div className="w-full h-full relative">
                <Image 
                  src={card.image} 
                  alt="Event poster"
                  fill
                  sizes="(max-width: 768px) 20vw, 10vw"
                  className="object-cover brightness-[0.65] group-hover:brightness-100 transition-all duration-300" 
                  priority={i < 15} // Prioritize loading the first 15 images visible above the fold
                />
                
                {/* Premium Glass Reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edge Gradients for fading out the grid smoothly */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-80" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-50" />

      {/* Text Content */}
      <div className="relative z-20 text-center max-w-5xl mx-auto px-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] drop-shadow-2xl text-white">
              Elevate Your <br />
              Social Experience
            </h1>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
