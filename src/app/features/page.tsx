'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';
import { Shield, Zap, QrCode, CreditCard, LayoutDashboard, Ticket, Users, Globe } from 'lucide-react';
import { ReactLenis } from 'lenis/react';

import FloatingPosterWall from '@/components/features/FloatingPosterWall';

function AnimatedFeatureCard({ feature, index }: { feature: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Dramatic Entrance Animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1.2", "1 1"]
  });

  // Make the scroll animation buttery smooth with a spring!
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Classy, subtle entrance animation values that look perfect on all devices (mobile, tablet, desktop)
  const y = useTransform(smoothProgress, [0, 1], [120, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.85, 1]);
  const rotateX = useTransform(smoothProgress, [0, 1], [25, 0]);
  const rotateY = useTransform(smoothProgress, [0, 1], [index % 2 === 0 ? 15 : -15, 0]);

  // Spotlight Mouse Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      style={{ 
        y, 
        opacity, 
        scale, 
        rotateX,
        rotateY,
        transformPerspective: 2500 
      }}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden rounded-3xl bg-[#050505] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl ${feature.colSpan}`}
    >
      {/* Background Image with Parallax & Scale */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={feature.image} 
          alt={feature.title} 
          fill 
          className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Glow Spotlight that follows mouse */}
      <motion.div 
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.15),
              transparent 80%
            )
          `
        }}
      />
      
      {/* Content */}
      <div className="relative z-20 flex flex-col h-full justify-between gap-8 md:gap-12 p-6 sm:p-8 md:p-10">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-white transition-colors drop-shadow-lg" />
        </div>
        
        <div className="transform transition-transform duration-500 group-hover:translate-x-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3 tracking-tight text-white drop-shadow-xl">{feature.title}</h3>
          <p className="text-white/70 leading-relaxed font-medium text-sm sm:text-base md:text-lg drop-shadow-md">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const features = [
    {
      title: "Seamless Ticketing",
      description: "Digital QR codes, instant delivery, and zero hassle at the door. Your phone is your entry pass.",
      icon: QrCode,
      colSpan: "md:col-span-2",
      gradient: "from-blue-500/20 to-purple-500/20",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2800&auto=format&fit=crop"
    },
    {
      title: "Split Payments",
      description: "Going with friends? Split the cost at checkout instantly without the awkward follow-ups.",
      icon: CreditCard,
      colSpan: "md:col-span-1",
      gradient: "from-emerald-500/20 to-teal-500/20",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2800&auto=format&fit=crop"
    },
    {
      title: "Real-time Analytics",
      description: "For organizers: Track attendance, revenue, and demographics live as your event unfolds.",
      icon: LayoutDashboard,
      colSpan: "md:col-span-1",
      gradient: "from-orange-500/20 to-red-500/20",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2800&auto=format&fit=crop"
    },
    {
      title: "VIP Access & Tables",
      description: "Skip the line and book exclusive VIP tables directly through the app. Premium service guaranteed.",
      icon: Shield,
      colSpan: "md:col-span-2",
      gradient: "from-amber-500/20 to-yellow-500/20",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2800&auto=format&fit=crop"
    },
    {
      title: "Global Discovery",
      description: "Find the best underground raves, exclusive clubs, and massive festivals in any city worldwide.",
      icon: Globe,
      colSpan: "md:col-span-3",
      gradient: "from-fuchsia-500/20 to-pink-500/20",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2800&auto=format&fit=crop"
    }
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <main className="min-h-screen bg-[#000000] text-white pb-24 overflow-hidden">
        
        {/* New Animated Floating Poster Hero */}
        <FloatingPosterWall />

        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[40%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 mt-32">

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" style={{ perspective: '2000px' }}>
            {features.map((feature, i) => (
              <AnimatedFeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </main>
    </ReactLenis>
  );
}
