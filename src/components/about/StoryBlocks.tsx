'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe } from 'lucide-react';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

import Image from 'next/image';

export function MarqueeSection() {
  const items = Array.from({ length: 12 });
  
  return (
    <section className="py-12 md:py-20 overflow-hidden relative bg-black flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 md:mb-12 tracking-tight">Explore Vibe</h2>
      
      {/* Row 1 - Moving Left */}
      <div className="relative flex whitespace-nowrap group w-full border-y border-white/10 bg-[#111]">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center group-hover:[animation-play-state:paused] will-change-transform w-max"
        >
          {items.map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-12 px-4 md:px-6 py-4 md:py-6">
              <span className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-white tracking-tighter leading-none uppercase">
                CHILL VIBE
              </span>
              <div className="w-16 h-16 md:w-28 md:h-28 lg:w-32 lg:h-32 relative flex-shrink-0">
                <Image src="/favicon.png" alt="Entry Club" fill className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2 - Moving Right */}
      <div className="relative flex whitespace-nowrap group w-full border-b border-white/10 bg-[#0a1128]">
        {/* Subtle texture/gradient for second row */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-[#15274d] to-[#0a1128] opacity-50 pointer-events-none" />
        
        <motion.div
          animate={{ x: ["-50%", 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center group-hover:[animation-play-state:paused] will-change-transform w-max"
        >
          {items.map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-12 px-4 md:px-6 py-4 md:py-6 relative z-10">
              <div className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                <span className="text-6xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 uppercase">
                  CHILL VIBE
                </span>
              </div>
              <div className="w-16 h-16 md:w-28 md:h-28 lg:w-32 lg:h-32 relative flex-shrink-0">
                <Image src="/favicon.png" alt="Entry Club" fill className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StackingCard({ block, index, progress, targetScale }: { block: any, index: number, progress: any, targetScale: number }) {
  const scale = useTransform(progress, [index * 0.25, 1], [1, targetScale]);

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0 px-4">
      <motion.div
        style={{ scale, top: `calc(-5vh + ${index * 20}px)` }}
        className="relative w-full max-w-5xl h-auto min-h-[300px] sm:h-[480px] md:h-[600px] rounded-2xl sm:rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 shadow-2xl p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-12 origin-top will-change-transform"
      >
        <div className="flex-1 w-full relative z-10">
          <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-5 md:mb-6 tracking-tight">
            {block.title}
          </h3>
          <p className="text-base sm:text-xl md:text-2xl text-white/80 md:text-white/60 font-light leading-relaxed">
            {block.text}
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:flex-1 relative h-48 sm:h-64 md:h-full rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/5 flex items-center justify-center overflow-hidden">
          {block.image ? (
            <>
              <div className="absolute inset-0 bg-black/20 z-10 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 md:hidden" />
              <Image src={block.image} alt={block.title} fill className="object-cover transition-transform duration-700 hover:scale-105" />
            </>
          ) : (
            <Globe className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 text-white/10 stroke-[0.5]" />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function WhyEntryClub() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const blocks = [
    { title: "Discover Experiences", text: "Find curated events that perfectly match your vibe and aesthetic.", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop" },
    { title: "Meet Your Tribe", text: "Connect deeply with people who share your obscure passions.", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2000&auto=format&fit=crop" },
    { title: "Build Communities", text: "Grow your network in the real world and forge lasting bonds.", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2000&auto=format&fit=crop" },
    { title: "Host And Earn", text: "Monetize your passion by organizing events the right way.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop" }
  ];

  return (
    <section ref={containerRef} className="relative mt-12 sm:mt-16 md:mt-24 px-4" style={{ height: "400vh" }}>
      {blocks.map((block, i) => {
        const targetScale = 1 - ((blocks.length - i) * 0.05);
        return (
          <StackingCard key={i} block={block} index={i} progress={scrollYProgress} targetScale={targetScale} />
        );
      })}
    </section>
  );
}

function TimelineStep({ step, index, totalSteps, progress }: { step: string, index: number, totalSteps: number, progress: any }) {
  const stepTriggerPoint = index / (totalSteps - 1);

  const dotScale = useTransform(
    progress,
    [stepTriggerPoint - 0.1, stepTriggerPoint],
    [0, 1]
  );

  const opacity = useTransform(
    progress,
    [stepTriggerPoint - 0.1, stepTriggerPoint],
    [0.2, 1]
  );

  return (
    <div className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} justify-end md:justify-between w-full`}>
      <div className="hidden md:block w-[45%]" />

      {/* Timeline dot */}
      <div className="absolute left-6 sm:left-10 md:left-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black border-4 border-white/20 -translate-x-[12px] sm:-translate-x-[15px] md:-translate-x-1/2 flex items-center justify-center z-10">
        <motion.div
          style={{ scale: dotScale }}
          className="w-full h-full rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] will-change-transform transform-gpu"
        />
      </div>

      <motion.div
        style={{ opacity }}
        className="w-[calc(100%-4rem)] sm:w-[calc(100%-5rem)] md:w-[45%] pl-6 sm:pl-10 md:pl-0 will-change-[opacity] transform-gpu"
      >
        <div className={`p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
          <span className="text-blue-500 font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-4 block">Step 0{index + 1}</span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">{step}</h3>
        </div>
      </motion.div>
    </div>
  );
}

export function TimelineSection() {
  const steps = ["Discover", "Join", "Connect", "Grow"];
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end 80%"]
  });

  return (
    <section ref={ref} className="py-20 sm:py-32 md:py-48 px-4 max-w-5xl mx-auto relative">
      <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center text-white mb-16 sm:mb-28 md:mb-40 tracking-tight">
        How It Works
      </h2>

      <div className="relative">
        {/* Track line */}
        <div className="absolute left-6 sm:left-10 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 md:-translate-x-1/2 rounded-full" />
        <motion.div
          className="absolute left-6 sm:left-10 md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-500 md:-translate-x-1/2 origin-top rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] will-change-transform transform-gpu"
          style={{ scaleY: scrollYProgress }}
        />

        <div className="space-y-20 sm:space-y-32 md:space-y-40 relative z-10">
          {steps.map((step, i) => (
            <TimelineStep key={i} step={step} index={i} totalSteps={steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
