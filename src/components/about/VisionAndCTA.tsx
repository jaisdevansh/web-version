'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
    <section className="relative py-64 px-4 flex items-center justify-center overflow-hidden bg-black z-0">
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
          <Link href="/dashboard">
            <motion.button whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="px-14 py-6 bg-white text-black font-bold rounded-full text-2xl shadow-[0_0_50px_rgba(255,255,255,0.3)]">
              Explore Events
            </motion.button>
          </Link>
          <Link href="/business">
            <motion.button whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="px-14 py-6 bg-white/5 text-white font-bold rounded-full text-2xl border border-white/10 backdrop-blur-xl hover:bg-white/10">
              Become A Host
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
