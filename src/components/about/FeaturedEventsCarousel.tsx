'use client';

import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const EVENTS = [
  {
    id: 1,
    title: "Midnight Sun Music Festival",
    date: "Aug 15, 2026",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop",
    category: "Music"
  },
  {
    id: 2,
    title: "Tech Founders Retreat",
    date: "Sep 02, 2026",
    location: "Goa, India",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    category: "Networking"
  },
  {
    id: 3,
    title: "Secret Supper Club",
    date: "Oct 12, 2026",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    category: "Food & Drink"
  },
  {
    id: 4,
    title: "Urban Art Walk",
    date: "Nov 05, 2026",
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
    category: "Arts"
  },
  {
    id: 5,
    title: "Himalayan Yoga Retreat",
    date: "Dec 20, 2026",
    location: "Rishikesh, India",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    category: "Wellness"
  }
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const FeaturedEventsCarousel = memo(function FeaturedEventsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transform: moves up as you scroll down
  const containerY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const getOffset = (itemIndex: number) => {
    const totalItems = EVENTS.length;
    const normalizedActive = ((activeIndex % totalItems) + totalItems) % totalItems;
    let diff = itemIndex - normalizedActive;
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;
    return diff;
  };

  const handleDragEnd = useCallback((e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      prevSlide();
    } else if (offset.x < -50) {
      nextSlide();
    } else if (offset.x > 50) {
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  // Responsive card variants — smaller offsets on mobile
  const cardVariants = useMemo(() => ({
    active: {
      x: "0%",
      scale: 1,
      opacity: 1,
      zIndex: 50,
      z: 200,
      rotateY: 0,
      filter: "blur(0px) brightness(1)",
      boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.4)",
    },
    left1: {
      x: "-38%",
      scale: 0.83,
      opacity: 0.75,
      zIndex: 40,
      z: 0,
      rotateY: 20,
      filter: "blur(1px) brightness(0.6)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    right1: {
      x: "38%",
      scale: 0.83,
      opacity: 0.75,
      zIndex: 40,
      z: 0,
      rotateY: -20,
      filter: "blur(1px) brightness(0.6)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    left2: {
      x: "-72%",
      scale: 0.68,
      opacity: 0.25,
      zIndex: 30,
      z: -200,
      rotateY: 40,
      filter: "blur(4px) brightness(0.3)",
      pointerEvents: "none" as any,
    },
    right2: {
      x: "72%",
      scale: 0.68,
      opacity: 0.25,
      zIndex: 30,
      z: -200,
      rotateY: -40,
      filter: "blur(4px) brightness(0.3)",
      pointerEvents: "none" as any,
    },
    hiddenLeft: {
      x: "-100%",
      scale: 0.5,
      opacity: 0,
      zIndex: 10,
      z: -400,
      rotateY: 65,
      filter: "blur(8px)",
      pointerEvents: "none" as any,
    },
    hiddenRight: {
      x: "100%",
      scale: 0.5,
      opacity: 0,
      zIndex: 10,
      z: -400,
      rotateY: -65,
      filter: "blur(8px)",
      pointerEvents: "none" as any,
    }
  }), []);

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] py-16 sm:py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center relative">
      {/* Header */}
      <div className="text-center relative z-10 px-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-3 sm:mb-4">
          Featured <span className="text-[#3B82F6]">Events</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
          Discover handpicked experiences around you. The best events, curated for your vibe.
        </p>
      </div>

      {/* Carousel container */}
      <motion.div
        style={{ y: containerY }}
        className="relative w-full max-w-[1200px] h-[380px] sm:h-[480px] md:h-[560px] flex items-center justify-center perspective-[2000px] transform-style-3d mt-8 z-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPanEnd={handleDragEnd}
      >
        {EVENTS.map((event, index) => {
          const offset = getOffset(index);
          const state =
            offset === 0 ? "active" :
            offset === -1 ? "left1" :
            offset === 1 ? "right1" :
            offset === -2 ? "left2" :
            offset === 2 ? "right2" :
            offset < -2 ? "hiddenLeft" : "hiddenRight";

          return (
            <motion.div
              key={event.id}
              variants={cardVariants}
              initial={false}
              animate={state}
              transition={{
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1]
              }}
              onClick={() => {
                if (offset !== 0) {
                  setActiveIndex((prev) => prev + offset);
                }
              }}
              // Responsive card size
              className={`absolute top-0 w-[200px] sm:w-[280px] md:w-[360px] h-[340px] sm:h-[430px] md:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 border border-white/10 flex flex-col ${offset !== 0 ? 'cursor-pointer' : ''}`}
            >
              {/* Event Image */}
              <div className="relative w-full h-[60%]">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/50 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10">
                  <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">{event.category}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>

              {/* Event Details */}
              <div className="flex-1 bg-gray-900 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-base sm:text-xl md:text-2xl font-bold leading-tight mb-2 sm:mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-[#3B82F6] shrink-0" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-[#3B82F6] shrink-0" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 sm:mt-4">
                  <span className="text-[#3B82F6] text-xs sm:text-sm font-bold uppercase tracking-wider">Explore</span>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center cursor-pointer hover:bg-[#3B82F6]/30 transition-colors">
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#3B82F6]" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dot indicators for mobile */}
      <div className="flex items-center gap-2 mt-6 sm:mt-8 relative z-10">
        {EVENTS.map((_, i) => {
          const normalizedActive = ((activeIndex % EVENTS.length) + EVENTS.length) % EVENTS.length;
          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === normalizedActive
                  ? 'w-6 h-2 bg-[#3B82F6]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
});
