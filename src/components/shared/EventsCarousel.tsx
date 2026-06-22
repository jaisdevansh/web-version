'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

const DEMO_EVENTS = [
  {
    id: 'movie-screening',
    title: 'MOVIE SCREENING',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop'
  },
  {
    id: 'shakira-delhi',
    title: 'SHAKIRA',
    image: 'https://images.unsplash.com/photo-1540039155732-d68f7b7fce8d?q=80&w=2800&auto=format&fit=crop'
  },
  {
    id: 'fun-day-out',
    title: 'FUN DAY-OUT',
    image: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=2800&auto=format&fit=crop'
  },
  {
    id: 'gaurav-gupta',
    title: 'GAURAV GUPTA',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2800&auto=format&fit=crop'
  },
  {
    id: 'honey-singh',
    title: 'Yo Yo! Honey Singh',
    image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5cb3b?q=80&w=2800&auto=format&fit=crop'
  }
];

export default function EventsCarousel() {
  return (
    <div className="relative w-full py-16 overflow-hidden bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Happening Around You
        </h2>
        <p className="text-lg text-white/70">
          More than events, explore experiences that bring people together.
        </p>
      </div>

      <div className="w-full pb-10">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full !px-4 md:!px-10"
        >
          {DEMO_EVENTS.map((event, index) => (
            <SwiperSlide key={index} className="max-w-[280px] md:max-w-[320px] transition-all duration-300">
              {({ isActive }) => (
                <div 
                  className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 border-2 ${
                    isActive 
                      ? 'border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-100 z-10' 
                      : 'border-white/10 opacity-60 scale-90 z-0 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {/* Subtle gradient overlay to make text pop if added later */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Event Title (Optional, mirroring the screenshot poster look) */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <h3 className={`font-bold text-white uppercase tracking-wider ${isActive ? 'text-xl' : 'text-lg'}`}>
                      {event.title}
                    </h3>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-slide {
          transition: all 0.3s ease;
        }
      `}} />
    </div>
  );
}
