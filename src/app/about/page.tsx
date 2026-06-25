'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SmoothScroll from '@/components/shared/SmoothScroll';

// Import modularized sections
import { CursorGlow } from '@/components/about/CursorGlow';
import { HeroSection, ProblemSection } from '@/components/about/HeroSection';
import { MarqueeSection, WhyEntryClub } from '@/components/about/StoryBlocks';
import { EcosystemSection, SocialProofSection } from '@/components/about/Ecosystem';
import { ForEveryoneSection } from '@/components/about/InteractiveCards';
import { VisionSection, CTASection } from '@/components/about/VisionAndCTA';
import { StampCardsSection } from '@/components/about/StampCards';
import { CreativeSection } from '@/components/about/CreativeSection';
import { StickyScrollytelling } from '@/components/about/StickyScrollytelling';

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  // Using useSpring for the progress bar is highly optimized
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <SmoothScroll>
      <div className="bg-black min-h-screen text-white font-sans selection:bg-blue-500/30 overflow-clip relative">
        
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1.5 bg-blue-500 origin-left z-50 shadow-[0_0_10px_rgba(59,130,246,0.8)] will-change-transform" 
          style={{ scaleX }} 
        />
        
        {/* GPU-Accelerated Cursor Glow */}
        <CursorGlow />

        {/* Page Content */}
        <div className="relative z-10">
          <HeroSection />
          <ProblemSection />
          <MarqueeSection />
          <StampCardsSection />
          <CreativeSection />
          <StickyScrollytelling />
          <WhyEntryClub />
          <EcosystemSection />
          <ForEveryoneSection />
          <SocialProofSection />
          <VisionSection />
          <CTASection />
        </div>
      </div>
    </SmoothScroll>
  );
}
