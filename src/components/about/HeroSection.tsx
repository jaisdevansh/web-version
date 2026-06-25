'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Users, Ticket, Heart, ArrowUpRight } from 'lucide-react';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroSection() {
  const words = "Where Events Become Communities".split(" ");
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-black pt-16 pb-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(120,119,198,0.18), transparent 55%)' }} />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-indigo-500/10 rounded-full blur-[120px] will-change-transform"
      />
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto will-change-transform mt-4 sm:mt-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
          className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-2 sm:mb-3"
        >
          Entry Club
        </motion.p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-5 tracking-tight flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.05, ease }}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8, ease }}
          className="text-sm sm:text-base md:text-lg text-white/60 font-light flex flex-col items-center space-y-1 mb-5 sm:mb-6"
        >
          <p>Discover experiences.</p>
          <p>Meet like-minded people.</p>
          <p>Build real connections.</p>
          <p>Grow together.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease }}
        >
          <Link
            href="/events"
            className="group inline-flex items-center gap-4 pl-8 pr-2 py-2 bg-[#131620] text-white rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-blue-500/10"
          >
            <span className="font-medium text-lg tracking-wide">Explore Events</span>
            <div className="bg-[#6D28D9] text-white p-3 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:bg-[#7C3AED]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Word({ word, index, total, progress }: { word: string, index: number, total: number, progress: any }) {
  const start = index / total;
  const end = start + (1 / total);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="will-change-[opacity] transform-gpu">
      {word}
    </motion.span>
  );
}

function RevealText({ text }: { text: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 50%"]
  });

  const words = text.split(" ");

  return (
    <h2 ref={ref} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 tracking-tight flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2">
      {words.map((word, i) => (
        <Word key={i} word={word} index={i} total={words.length} progress={scrollYProgress} />
      ))}
    </h2>
  );
}

export function ProblemSection() {
  const cards = [
    { title: "Events", desc: "Thousands of generic parties, zero real connection.", icon: Ticket, color: "from-blue-500 to-cyan-400" },
    { title: "Communities", desc: "Scattered across platforms with no central hub.", icon: Users, color: "from-purple-500 to-pink-500" },
    { title: "Meaningful Connections", desc: "Harder than ever to find your tribe in the real world.", icon: Heart, color: "from-orange-500 to-red-500" }
  ];
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="max-w-5xl mb-12 sm:mb-20 md:mb-32 relative">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <RevealText text="The world is more connected than ever. Yet people feel more disconnected than before." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative p-8 sm:p-10 rounded-[2rem] bg-[#070707] border border-white/5 overflow-hidden will-change-transform cursor-default"
          >
            {/* Subtle Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
            
            {/* Top Border Highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Bottom Border Glow */}
            <div className={`absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[2px]`} />

            {/* Icon Container with Glow */}
            <div className="relative mb-8 sm:mb-10 inline-flex items-center justify-center">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 rounded-full`} />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <card.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 group-hover:text-white transition-colors duration-500" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-white/70 transition-all duration-500">
                {card.title}
              </h3>
              <p className="text-white/50 leading-relaxed text-base sm:text-lg group-hover:text-white/80 transition-colors duration-500">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
