'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export default function EventsCarousel() {
  const { data: fetchedEvents } = useQuery({
      queryKey: ['publicEvents'],
      queryFn: async () => {
          const res = await axiosInstance.get('/user/events?limit=20');
          return res.data?.data || [];
      },
      enabled: typeof window !== 'undefined',
  });

  const displayEvents = useMemo(() => {
      if (!fetchedEvents || fetchedEvents.length === 0) return [];
      return fetchedEvents.map((ev: any) => ({
          id: ev._id,
          title: ev.title,
          image: ev.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'
      }));
  }, [fetchedEvents]);

  if (displayEvents.length === 0) return null;

  return (
    <div className="relative w-full py-10 sm:py-14 md:py-16 overflow-hidden bg-[#050B14]">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
          Exclusive Experiences
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/70 px-2">
          Handpicked events, electrifying concerts, and unforgettable nights.
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
          slideToClickedSlide={true}
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
          {Array.from({ length: Math.max(1, Math.ceil(15 / displayEvents.length)) })
            .flatMap(() => displayEvents)
            .map((event, index) => (
            <SwiperSlide key={`${event.id}-${index}`} className="events-carousel-slide">
              {({ isActive }) => (
                <Link
                  href={`/events/${event.id}`}
                  className={`block relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 border-2 ${
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
                </Link>
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
