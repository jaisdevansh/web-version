'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export function VisionSection() {
  // Static rendering of particles to avoid state-driven re-renders
  const particles = Array.from({ length: 40 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 20,
    scale: 0.5 + Math.random() * 1.5
  }));

  return (
    <section className="relative py-20 md:py-32 px-4 flex items-center justify-center overflow-hidden bg-black z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -300, 0],
            opacity: [0, 0.4, 0]
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          className="absolute w-2 h-2 bg-white rounded-full blur-[2px] will-change-transform"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `scale(${p.scale})` }}
        />
      ))}
      <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-center text-white leading-[1.1] max-w-7xl relative z-10 tracking-tight mix-blend-screen drop-shadow-2xl">
        We're building the operating system for real-world communities.
      </h2>
    </section>
  );
}

export function CTASection() {
  // Use framer motion values for the glow to prevent react re-renders
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Offset by half the width/height of the glow (400px)
    mouseX.set(e.clientX - rect.left - 400);
    mouseY.set(e.clientY - rect.top - 400);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black z-10"
    >
      <AnimatePresence>
        {isHovering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px] bg-gradient-to-r from-blue-600/30 to-purple-600/30 pointer-events-none will-change-transform"
            style={{ x: smoothX, y: smoothY }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-bold text-white mb-16 tracking-tight leading-tight">Ready To Find Your Next Community?</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Link href="/events">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="group inline-flex items-center gap-6 pl-10 pr-3 py-3 bg-[#131620] text-white rounded-full shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-blue-500/10 cursor-pointer">
              <span className="font-medium text-2xl tracking-wide">Explore Events</span>
              <div className="bg-[#6D28D9] text-white p-4 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:bg-[#7C3AED]">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </motion.div>
          </Link>
          <Link href="/business">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="group inline-flex items-center gap-6 pr-10 pl-3 py-3 bg-[#3B2164] text-white rounded-full shadow-[0_0_40px_rgba(109,40,217,0.2)] border border-[#5B31A4] cursor-pointer hover:bg-[#4B2A80]">
              <div className="bg-white text-[#6D28D9] p-4 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-rotate-12">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span className="font-medium text-2xl tracking-wide">Become A Host</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
