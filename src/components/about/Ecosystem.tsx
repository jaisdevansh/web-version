'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EcosystemSection() {
  const features = [
    { title: "Event Discovery", span: "md:col-span-2 md:row-span-2" },
    { title: "Communities", span: "md:col-span-1 md:row-span-1" },
    { title: "Host Dashboard", span: "md:col-span-1 md:row-span-2" },
    { title: "Smart Recommendations", span: "md:col-span-1 md:row-span-1" },
    { title: "Private Clubs", span: "md:col-span-2 md:row-span-1" },
    { title: "QR Check-In", span: "md:col-span-1 md:row-span-1" },
    { title: "Analytics", span: "md:col-span-1 md:row-span-1" },
    { title: "Networking", span: "md:col-span-2 md:row-span-1" },
  ];

  return (
    <section className="py-48 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-6xl md:text-8xl font-bold text-center text-white mb-24 tracking-tight">Ecosystem</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease }}
            className={`${f.span} p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-end group hover:bg-white/[0.06] transition-colors cursor-pointer overflow-hidden relative will-change-transform`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors relative z-10">{f.title}</h3>
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
    <section className="py-48 px-4 md:px-8 bg-white/[0.02] border-y border-white/5 backdrop-blur-xl relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-24 text-center md:text-left">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="text-7xl md:text-9xl font-bold text-white mb-4 tracking-tighter">
              <Counter value={m.value} />{m.suffix}
            </div>
            <div className="text-2xl md:text-3xl text-white/50 tracking-[0.2em] uppercase font-bold">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
