'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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

export function FeaturedEventsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const getOffset = (itemIndex: number) => {
    const totalItems = EVENTS.length;
    // Normalize active index
    const normalizedActive = ((activeIndex % totalItems) + totalItems) % totalItems;
    let diff = itemIndex - normalizedActive;
    
    // Wrap around for infinite effect
    if (diff > totalItems / 2) diff -= totalItems;
    if (diff < -totalItems / 2) diff += totalItems;
    return diff;
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      prevSlide();
    } else if (offset.x < -50) {
      nextSlide(); // fallback for slow swipes
    } else if (offset.x > 50) {
      prevSlide();
    }
  };

  const cardVariants = {
    active: {
      x: "0%",
      scale: 1,
      opacity: 1,
      zIndex: 50,
      z: 200, // Pop out heavily
      rotateY: 0,
      filter: "blur(0px) brightness(1)",
      boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.4)",
    },
    left1: {
      x: "-45%",
      scale: 0.85,
      opacity: 0.8,
      zIndex: 40,
      z: 0,
      rotateY: 25, // Angled inwards
      filter: "blur(2px) brightness(0.6)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    right1: {
      x: "45%",
      scale: 0.85,
      opacity: 0.8,
      zIndex: 40,
      z: 0,
      rotateY: -25, // Angled inwards
      filter: "blur(2px) brightness(0.6)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    left2: {
      x: "-80%",
      scale: 0.7,
      opacity: 0.3,
      zIndex: 30,
      z: -200, // Pushed far back
      rotateY: 45, // More extreme angle
      filter: "blur(5px) brightness(0.3)",
      pointerEvents: "none" as any,
    },
    right2: {
      x: "80%",
      scale: 0.7,
      opacity: 0.3,
      zIndex: 30,
      z: -200, // Pushed far back
      rotateY: -45, // More extreme angle
      filter: "blur(5px) brightness(0.3)",
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
  };

  return (
    <section className="w-full bg-[#050505] py-32 overflow-hidden flex flex-col items-center justify-center relative">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4">
          Featured <span className="text-[#8B5CF6]">Events</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto px-4">
          Discover handpicked experiences around you. The best events, curated for your vibe.
        </p>
      </div>

      <div 
        className="relative w-full max-w-[1200px] h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px] transform-style-3d"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* We use a large invisible drag layer to catch swipes easily */}
        <motion.div
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        />

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
                ease: [0.25, 1, 0.5, 1] // Power4.out equivalent
              }}
              className="absolute top-0 w-[280px] md:w-[400px] h-[450px] md:h-[550px] rounded-3xl overflow-hidden bg-gray-900 border border-white/10 flex flex-col pointer-events-none"
            >
              {/* Event Image */}
              <div className="relative w-full h-[65%]">
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">{event.category}</span>
                </div>
                {/* Gradient fade to blend image into card body */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>

              {/* Event Details */}
              <div className="flex-1 bg-gray-900 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-2xl font-bold leading-tight mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                    {event.location}
                  </div>
                </div>

                {/* Optional Action Button (Only fully visible/interactive on active card) */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[#8B5CF6] text-sm font-bold uppercase tracking-wider">Explore</span>
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                </div>
              </div>

              {/* Interactive overlay to handle clicks routing to the event. 
                  Since drag layer is absolute full-screen, we keep this pointer-events-none,
                  but in a real app we would map clicks via the drag layer coordinates or make the center card z-index higher than drag layer.
              */}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
