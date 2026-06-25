'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

import Image from 'next/image';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EcosystemSection() {
  const features = [
    { title: "Event Discovery", span: "md:col-span-2 md:row-span-2", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" },
    { title: "Communities", span: "md:col-span-1 md:row-span-1", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop" },
    { title: "Host Dashboard", span: "md:col-span-1 md:row-span-2", image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop" },
    { title: "Smart Recommendations", span: "md:col-span-1 md:row-span-1", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" },
    { title: "Private Clubs", span: "md:col-span-2 md:row-span-1", image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop" },
    { title: "QR Check-In", span: "md:col-span-1 md:row-span-1", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop" },
    { title: "Analytics", span: "md:col-span-1 md:row-span-1", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
    { title: "Networking", span: "md:col-span-2 md:row-span-1", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop" },
  ];

  return (
    <section className="py-20 sm:py-32 md:py-48 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center text-white mb-10 sm:mb-16 md:mb-24 tracking-tight">
        Ecosystem
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[280px] gap-3 sm:gap-4 md:gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease }}
            className={`${f.span} p-5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-end group hover:border-white/20 transition-all cursor-pointer overflow-hidden relative will-change-transform`}
          >
            {f.image && (
              <Image 
                src={f.image} 
                alt={f.title} 
                fill 
                className="object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105 pointer-events-none" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors relative z-10 leading-tight">
              {f.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Counter({ value }: { value: number }) {
  const ref = useRef(null);
  const springValue = useSpring(0, { bounce: 0, duration: 2500 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <motion.span
      ref={ref}
      onViewportEnter={() => springValue.set(value)}
      className="tabular-nums inline-block"
    >
      {display}
    </motion.span>
  );
}

export function SocialProofSection() {
  const metrics = [
    { label: "Events", value: 25, suffix: "+" },
    { label: "Communities", value: 10, suffix: "+" },
    { label: "Members", value: 1500, suffix: "+" }
  ];
  return (
    <section className="py-20 sm:py-32 md:py-48 px-4 md:px-8 bg-white/[0.02] border-y border-white/5 backdrop-blur-xl relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-10 sm:gap-16 md:gap-24 text-center">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-2 sm:mb-4 tracking-tighter">
              <Counter value={m.value} />{m.suffix}
            </div>
            <div className="text-base sm:text-xl md:text-2xl md:text-3xl text-white/50 tracking-[0.2em] uppercase font-bold">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
