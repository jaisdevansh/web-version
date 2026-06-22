'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorGlow() {
  // Initialize slightly off-screen
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth out the mouse movement for a buttery feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // We attach the listener to the window so it tracks everywhere.
    // By using motion values, we bypass React state and avoid re-renders.
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half the width/height (300px) to center the glow on the cursor
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-500/10 mix-blend-screen pointer-events-none z-0 blur-[120px] will-change-transform"
      style={{ x: smoothX, y: smoothY }}
    />
  );
}
