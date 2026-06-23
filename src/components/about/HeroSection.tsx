'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Users, Ticket, Heart } from 'lucide-react';

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
    <section ref={ref} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(120,119,198,0.18), transparent 55%)' }} />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-indigo-500/10 rounded-full blur-[120px] will-change-transform"
      />
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto will-change-transform"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
          className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 sm:mb-6"
        >
          Entry Club
        </motion.p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 tracking-tight flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2">
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
          className="text-sm sm:text-lg md:text-2xl text-white/60 font-light flex flex-col items-center space-y-1 sm:space-y-2 mb-8 sm:mb-12"
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
            href="/dashboard"
            className="inline-block px-7 py-4 sm:px-10 sm:py-5 bg-white text-black font-bold text-sm sm:text-base rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Explore Events
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
    { title: "Events", desc: "Thousands of generic parties, zero real connection.", icon: Ticket },
    { title: "Communities", desc: "Scattered across platforms with no central hub.", icon: Users },
    { title: "Meaningful Connections", desc: "Harder than ever to find your tribe in the real world.", icon: Heart }
  ];
  return (
    <section className="py-20 sm:py-32 md:py-40 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="max-w-5xl mb-12 sm:mb-20 md:mb-32">
        <RevealText text="The world is more connected than ever. Yet people feel more disconnected than before." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors will-change-transform"
          >
            <card.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 mb-5 sm:mb-6 md:mb-8" />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">{card.title}</h3>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base md:text-lg">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
