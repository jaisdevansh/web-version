'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        ease: [0.22, 1, 0.36, 1], // Apple-like smooth easing curve
        duration: 0.8 
      }}
      className="will-change-[opacity,transform] transform-gpu"
    >
      {children}
    </motion.div>
  );
}
