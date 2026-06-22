'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const SCENES = [
  {
    id: 1,
    headline: "FIND YOUR NEXT EXPERIENCE",
    subhead: "Something always worth trying",
    description: "Discover plans, activities, and things to do without overthinking. Just pick something and be a part of it.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    headline: "MEET REAL PEOPLE",
    subhead: "Grow With Entry Club",
    description: "Turn events into opportunities. Host events, promote them through the network, and unlock new earning possibilities.",
    image: "https://images.unsplash.com/photo-1511632765486-a01c80cf8cb4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    headline: "SEAMLESS BOOKING",
    subhead: "One Tap Reservations",
    description: "Book your spot instantly without the hassle. Get your digital tickets immediately and bypass the queues.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    headline: "BUILD YOUR COMMUNITY",
    subhead: "Connect & Engage",
    description: "Find your tribe. Join exclusive groups based on your interests, vibes, and passions in your city.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    headline: "SAFETY FIRST",
    subhead: "Verified & Secure",
    description: "Every profile and event is rigorously verified to ensure a completely safe, trustworthy, and premium community experience.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop"
  }
];

export function StickyScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track scroll to update active text index safely
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 5 scenes -> 0.2 threshold per scene
    if (latest < 0.2) setActiveIndex(0);
    else if (latest >= 0.2 && latest < 0.4) setActiveIndex(1);
    else if (latest >= 0.4 && latest < 0.6) setActiveIndex(2);
    else if (latest >= 0.6 && latest < 0.8) setActiveIndex(3);
    else setActiveIndex(4);
  });

  // Individual scroll transforms for images to create the synced "slide up" masking effect.
  // We use percentage strings so CSS transform handles the heavy lifting on GPU.
  
  // Image 1: Slides up and out exactly when text 2 triggers (0.2 -> 0.3)
  const img1Y = useTransform(scrollYProgress, [0.2, 0.3], ["0%", "-100%"]);
  
  // Image 2: Slides in 0.2 -> 0.3, stays, slides out exactly when text 3 triggers (0.4 -> 0.5)
  const img2Y = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], ["100%", "0%", "0%", "-100%"]);
  
  // Image 3: Slides in 0.4 -> 0.5, stays, slides out exactly when text 4 triggers (0.6 -> 0.7)
  const img3Y = useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.7], ["100%", "0%", "0%", "-100%"]);

  // Image 4: Slides in 0.6 -> 0.7, stays, slides out exactly when text 5 triggers (0.8 -> 0.9)
  const img4Y = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.9], ["100%", "0%", "0%", "-100%"]);

  // Image 5: Slides in 0.8 -> 0.9, stays till end
  const img5Y = useTransform(scrollYProgress, [0.8, 0.9], ["100%", "0%"]);

  const imgTransforms = [img1Y, img2Y, img3Y, img4Y, img5Y];

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-[#0b1120]">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden max-w-[1600px] mx-auto px-4 md:px-16 lg:px-24">
        
        {/* LEFT: Image Frame */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-[70vh] relative flex items-center justify-center">
          <div className="relative w-full max-w-[500px] aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden bg-gray-900 shadow-2xl border border-white/10">
            {SCENES.map((scene, index) => (
              <motion.div
                key={scene.id}
                style={{ y: imgTransforms[index], zIndex: index }}
                className="absolute inset-0 w-full h-full will-change-transform transform-gpu"
              >
                <Image 
                  src={scene.image}
                  alt={scene.headline}
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: Text Content */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-[70vh] flex items-center justify-center pl-0 md:pl-16 mt-8 md:mt-0">
          <div className="w-full max-w-lg relative h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }} // power3.out equivalent
                className="absolute inset-x-0"
              >
                <h3 className="text-[#8b5cf6] font-black text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-tight mb-2">
                  {SCENES[activeIndex].headline}
                </h3>
                <h4 className="text-white font-bold text-2xl md:text-4xl tracking-tight mb-6">
                  {SCENES[activeIndex].subhead}
                </h4>
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
                  {SCENES[activeIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
