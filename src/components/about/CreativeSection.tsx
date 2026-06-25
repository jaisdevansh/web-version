'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function CreativeSection() {
  return (
    <section className="w-full bg-[#111111] py-32 md:py-48 px-4 md:px-8 overflow-hidden flex flex-col items-center justify-center relative z-20 border-t border-white/5 mt-[-100vh]">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center justify-center">
        <h2 className="text-white font-black text-[10vw] sm:text-[8vw] md:text-[9vw] leading-[0.9] tracking-tighter uppercase flex items-center flex-wrap justify-center whitespace-nowrap">
          <span className="mr-4 md:mr-8">WE'RE A</span>
          <motion.div 
            initial={{ width: 0, opacity: 0, scale: 0.5 }}
            whileInView={{ width: "auto", opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative h-[8vw] md:h-[7vw] w-[16vw] md:w-[14vw] rounded-xl md:rounded-2xl overflow-hidden mx-2 md:mx-4 shrink-0 transform-gpu"
          >
            <Image 
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop" 
              alt="Creative singer" 
              fill
              className="object-cover"
            />
          </motion.div>
          <span className="ml-2 md:ml-4">CREATIVE</span>
        </h2>
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-blue-500 font-black text-[10vw] sm:text-[8vw] md:text-[9vw] leading-[0.9] tracking-tighter uppercase flex items-center justify-center whitespace-nowrap mt-2 md:mt-4"
        >
          COMMUNITY
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false, amount: 0.3 }}
          className="mt-8 md:mt-12 text-gray-400 text-lg md:text-2xl font-medium max-w-3xl text-center px-4"
        >
          Where event organizers, party-goers, and artists come together to craft and celebrate unforgettable experiences.
        </motion.p>
      </div>
    </section>
  );
}
