'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Users, CalendarHeart, ShieldCheck, Ticket } from 'lucide-react';

interface CardData {
  id: number;
  title: string;
  image: string;
  Icon: React.ElementType;
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: "FIND FRIENDS ANYTIME, ANYWHERE!",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop",
    Icon: Users,
  },
  {
    id: 2,
    title: "EXPLORE TRENDING EVENTS",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop",
    Icon: Ticket,
  },
  {
    id: 3,
    title: "JOIN OR CREATE ANY PLAN",
    image: "https://images.unsplash.com/photo-1511632765486-a01c80cf8cb4?q=80&w=1000&auto=format&fit=crop",
    Icon: CalendarHeart,
  },
  {
    id: 4,
    title: "BUILD COMMUNITY BASED ON YOUR VIBE",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
    Icon: MapPin,
  },
  {
    id: 5,
    title: "SAFETY COMES FIRST",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop",
    Icon: ShieldCheck,
  }
];

function StampCard({ 
  card, 
  index, 
  progress 
}: { 
  card: CardData; 
  index: number; 
  progress: MotionValue<number>;
}) {
  // Center card is index 2.
  const isCenter = index === 2;
  const isLeft1 = index === 1;
  const isRight1 = index === 3;
  const isLeft2 = index === 0;
  const isRight2 = index === 4;

  // Base values for the final expanded state
  // Reduced size and gap so all 5 fit easily on typical laptop screens (1366px+)
  const CARD_WIDTH = 250;
  const GAP = 16;
  const OFFSET = CARD_WIDTH + GAP;

  // X Translation
  const targetX = isCenter ? 0 
    : isLeft1 ? -OFFSET 
    : isRight1 ? OFFSET 
    : isLeft2 ? -(OFFSET * 2) 
    : (OFFSET * 2);

  // Define scroll trigger points for staging stretched to 0.5 so it finishes midway,
  // allowing the next section to overlap while this remains sticky.
  const x = useTransform(
    progress,
    [0, 0.125, 0.25, 0.375, 0.5],
    [
      0, 
      isLeft1 || isRight1 ? targetX * 0.5 : 0, 
      isLeft1 || isRight1 ? targetX : (isLeft2 || isRight2 ? targetX * 0.5 : 0),
      isLeft2 || isRight2 ? targetX * 0.8 : targetX,
      targetX
    ]
  );

  const scale = useTransform(
    progress,
    [0, 0.25, 0.5],
    [
      isCenter ? 1 : (isLeft1 || isRight1 ? 0.9 : 0.8),
      isCenter ? 1 : (isLeft1 || isRight1 ? 1 : 0.9),
      1
    ]
  );

  const opacity = useTransform(
    progress,
    [0, 0.125, 0.25, 0.375, 0.5],
    [
      isCenter ? 1 : 0,
      isCenter ? 1 : (isLeft1 || isRight1 ? 0.8 : 0),
      isCenter ? 1 : (isLeft1 || isRight1 ? 1 : 0.6),
      1,
      1
    ]
  );

  const zIndex = isCenter ? 50 : (isLeft1 || isRight1 ? 40 : 30);

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity,
        zIndex,
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[250px] aspect-[3/4] bg-white rounded-lg shadow-2xl flex flex-col will-change-transform transform-gpu"
    >
      {/* Stamp Perforation Border using CSS Mask */}
      <style dangerouslySetInnerHTML={{__html: `
        .stamp-border-${index} {
          -webkit-mask: 
            linear-gradient(#000 0 0), 
            radial-gradient(circle at 0 10px, #000 6px, transparent 6.5px), 
            radial-gradient(circle at 100% 10px, #000 6px, transparent 6.5px), 
            radial-gradient(circle at 10px 0, #000 6px, transparent 6.5px), 
            radial-gradient(circle at 10px 100%, #000 6px, transparent 6.5px);
          -webkit-mask-size: 100% 100%, 8px 20px, 8px 20px, 20px 8px, 20px 8px;
          -webkit-mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
          -webkit-mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
          -webkit-mask-composite: destination-out;
          
          mask: 
            linear-gradient(#000 0 0), 
            radial-gradient(circle at 0 10px, #000 6px, transparent 6.5px), 
            radial-gradient(circle at 100% 10px, #000 6px, transparent 6.5px), 
            radial-gradient(circle at 10px 0, #000 6px, transparent 6.5px), 
            radial-gradient(circle at 10px 100%, #000 6px, transparent 6.5px);
          mask-size: 100% 100%, 8px 20px, 8px 20px, 20px 8px, 20px 8px;
          mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
          mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
          mask-composite: subtract;
        }
      `}} />
      
      <div className={`stamp-border-${index} w-full h-full bg-white p-4 flex flex-col justify-between overflow-hidden relative`}>
        {/* Top Blob Design & Image */}
        <div className="relative h-[60%] w-full flex items-center justify-center mt-4">
          <div className="absolute inset-0 bg-gray-200/50 rounded-full blur-2xl transform scale-150" />
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner rotate-[-2deg] bg-black">
            <Image 
              src={card.image} 
              alt={card.title}
              fill
              className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <card.Icon className="w-12 h-12 text-white drop-shadow-xl" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Bottom Title */}
        <div className="text-center pb-4 px-2">
          <h3 className="font-black text-xl leading-[0.95] tracking-tighter text-black uppercase">
            {card.title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word}
                {i !== card.title.split(' ').length - 1 && <br/>}
              </React.Fragment>
            ))}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export function StampCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#0b1121]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Particles/Glow for premium feel */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] transform-gpu" />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto h-full">
          {CARDS.map((card, index) => (
            <StampCard 
              key={card.id} 
              card={card} 
              index={index} 
              progress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
