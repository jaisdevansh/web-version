'use client';

import React from 'react';
import Image from 'next/image';
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
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2800&auto=format&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2800&auto=format&fit=crop'
  }
];

export default function EventsCarousel() {
  return (
    <div className="relative w-full py-10 sm:py-14 md:py-16 overflow-hidden bg-[#050B14]">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
          Happening Around You
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/70 px-2">
          More than events, explore experiences that bring people together.
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full pb-6 sm:pb-8 md:pb-10">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          loopAdditionalSlides={DEMO_EVENTS.length}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={600}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 80,
            modifier: 2,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full events-carousel-swiper"
        >
          {/* Triple slides for seamless infinite loop with slidesPerView='auto' */}
          {[...DEMO_EVENTS, ...DEMO_EVENTS, ...DEMO_EVENTS].map((event, index) => (
            <SwiperSlide key={`${event.id}-${index}`} className="events-carousel-slide">
              {({ isActive }) => (
                <div
                  className={`relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 border-2 ${
                    isActive
                      ? 'border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.5)] sm:shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-100 z-10'
                      : 'border-white/10 opacity-50 sm:opacity-60 scale-90 z-0 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                  {/* Event Title */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-left">
                    <h3
                      className={`font-bold text-white uppercase tracking-wider leading-tight ${
                        isActive ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'
                      }`}
                    >
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
        /* Mobile: smaller cards */
        .events-carousel-slide {
          width: 200px !important;
          transition: all 0.3s ease;
        }

        /* Tablet */
        @media (min-width: 640px) {
          .events-carousel-slide {
            width: 260px !important;
          }
        }

        /* Desktop */
        @media (min-width: 768px) {
          .events-carousel-slide {
            width: 320px !important;
          }
        }

        /* Swiper padding on mobile */
        .events-carousel-swiper {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }

        @media (min-width: 640px) {
          .events-carousel-swiper {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }

        @media (min-width: 768px) {
          .events-carousel-swiper {
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }
      `}} />
    </div>
  );
}
