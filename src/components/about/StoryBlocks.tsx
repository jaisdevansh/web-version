'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Star } from 'lucide-react';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function MarqueeSection() {
  const items = [
    "College Events", "Startup Meetups", "Music Nights", "Sports Clubs", 
    "Workshops", "Food Walks", "Hackathons", "Networking", "Open Mics", "Travel Groups"
  ];
  return (
    <section className="py-32 overflow-hidden relative bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-20 pointer-events-none" />
      <div className="relative flex whitespace-nowrap group w-[200%]">
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 px-3 group-hover:[animation-play-state:paused] will-change-transform"
        >
          {[...items, ...items, ...items, ...items].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="px-12 py-16 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex-shrink-0 flex flex-col items-center justify-center min-w-[320px] cursor-pointer will-change-transform"
            >
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Star className="w-10 h-10 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StackingCard({ block, index, progress, targetScale }: { block: any, index: number, progress: any, targetScale: number }) {
  // As the user scrolls, each card scales down when it reaches the top
  const scale = useTransform(progress, [index * 0.25, 1], [1, targetScale]);
  
  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, top: `calc(-5vh + ${index * 25}px)` }}
        className="relative w-full max-w-5xl h-[500px] md:h-[600px] rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 origin-top will-change-transform"
      >
        <div className="flex-1 w-full">
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{block.title}</h3>
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed">{block.text}</p>
        </div>
        <div className="flex-1 w-full relative h-full rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/5 flex items-center justify-center overflow-hidden">
          <Globe className="w-48 h-48 text-white/10 stroke-[0.5]" />
        </div>
      </motion.div>
    </div>
  );
}

export function WhyEntryClub() {
  const containerRef = useRef(null);
  
  // Track scroll progress of the entire container (400vh tall)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const blocks = [
    { title: "Discover Experiences", text: "Find curated events that perfectly match your vibe and aesthetic." },
    { title: "Meet Your Tribe", text: "Connect deeply with people who share your obscure passions." },
    { title: "Build Communities", text: "Grow your network in the real world and forge lasting bonds." },
    { title: "Host And Earn", text: "Monetize your passion by organizing events the right way." }
  ];

  return (
    <section ref={containerRef} className="relative mt-24 px-4" style={{ height: "400vh" }}>
      {blocks.map((block, i) => {
        const targetScale = 1 - ( (blocks.length - i) * 0.05 );
        return (
          <StackingCard key={i} block={block} index={i} progress={scrollYProgress} targetScale={targetScale} />
        );
      })}
    </section>
  );
}

function TimelineStep({ step, index, totalSteps, progress }: { step: string, index: number, totalSteps: number, progress: any }) {
  const stepTriggerPoint = index / (totalSteps - 1);
            
  // Map scroll progress tightly to step opacity and dot scale
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
      
      <div className="absolute left-10 md:left-1/2 w-8 h-8 rounded-full bg-black border-4 border-white/20 -translate-x-[15px] md:-translate-x-1/2 flex items-center justify-center z-10">
        <motion.div 
          style={{ scale: dotScale }}
          className="w-full h-full rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] will-change-transform transform-gpu"
        />
      </div>

      <motion.div 
        style={{ opacity }}
        className="w-[calc(100%-5rem)] md:w-[45%] pl-10 md:pl-0 will-change-[opacity] transform-gpu"
      >
        <div className={`p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
          <span className="text-blue-500 font-bold tracking-widest text-sm uppercase mb-4 block">Step 0{index+1}</span>
          <h3 className="text-5xl font-bold text-white tracking-tight">{step}</h3>
        </div>
      </motion.div>
    </div>
  );
}

export function TimelineSection() {
  const steps = ["Discover", "Join", "Connect", "Grow"];
  const ref = useRef(null);
  
  // Track scroll precisely for the timeline draw effect
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start center", "end 80%"] 
  });
  
  return (
    <section ref={ref} className="py-48 px-4 max-w-5xl mx-auto relative">
      <h2 className="text-6xl md:text-8xl font-bold text-center text-white mb-40 tracking-tight">How It Works</h2>
      
      <div className="relative">
        <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 md:-translate-x-1/2 rounded-full" />
        <motion.div 
          className="absolute left-10 md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-500 md:-translate-x-1/2 origin-top rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] will-change-transform transform-gpu"
          style={{ scaleY: scrollYProgress }}
        />

        <div className="space-y-40 relative z-10">
          {steps.map((step, i) => (
            <TimelineStep key={i} step={step} index={i} totalSteps={steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
