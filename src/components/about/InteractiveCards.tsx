'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function TiltCard({ title, index }: { title: string, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Use framer motion values instead of react state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the motion
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to rotation angle
  // max rotation: 10 degrees
  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to -1 to 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      className="flex-1 rounded-[3rem] bg-white/[0.02] border border-white/5 p-12 flex flex-col justify-end relative overflow-hidden group cursor-pointer will-change-transform"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
      <h3 className="text-5xl font-bold text-white relative z-10 drop-shadow-2xl" style={{ transform: "translateZ(50px)" }}>{title}</h3>
    </motion.div>
  );
}

export function ForEveryoneSection() {
  const cards = ["For Explorers", "For Communities", "For Organizers"];
  return (
    <section className="py-48 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 h-[600px] md:h-[800px] perspective-1000">
        {cards.map((card, i) => (
          <TiltCard key={i} title={card} index={i} />
        ))}
      </div>
    </section>
  );
}
