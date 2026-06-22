'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Apple, Play } from 'lucide-react';

export default function DownloadPage() {
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center pt-32 md:pt-40 overflow-hidden bg-[#050B14] text-white">
      
      {/* Full-screen Crowd Image Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Image 
          src="/images/download-bg.png" 
          alt="Concert Crowd" 
          fill 
          priority
          className="object-cover object-center opacity-80 grayscale"
        />
        {/* Bright blue tint matching the user's color */}
        <div className="absolute inset-0 bg-[#0D52FF] mix-blend-color opacity-30" />
        {/* Soft fade from the top to blend with the solid background color */}
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-[#050B14] via-[#050B14]/90 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-4xl md:text-[3.5rem] font-bold tracking-tight mb-10 text-white"
        >
          Download the Vibe
        </motion.h1>

        {/* Download Buttons CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="flex flex-row items-center justify-center gap-4 mb-16 md:mb-20"
        >
          {/* Google Play Button */}
          <Link href="#" className="flex items-center justify-center gap-3 bg-black hover:bg-[#111] border border-white/20 px-4 py-[9px] rounded-xl transition-all duration-300 min-w-[170px]">
            <svg width="22" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M96.7 31.3C90.3 38.3 85.3 50.1 85.3 65.6v892.8c0 15.5 5 27.4 11.4 34.4l11.4 11.4 472.9-472.9v-39.7L108 19.9 96.7 31.3z" fill="#00e676"/>
              <path d="M738.3 754.7L580.9 597.4V426.6L738.3 269.3l17.1 9.7 203.4 115.7c58 33 58 87.1 0 120.1L755.4 745l-17.1 9.7z" fill="#ffea00"/>
              <path d="M755.4 745L580.9 597.4 108 1004.3c18.3 19.3 49 20.4 86.6-.9l560.8-318.4z" fill="#ff2a2a"/>
              <path d="M755.4 279.1L194.6 20.6c-37.5-21.3-68.3-20.2-86.6-.9L580.9 426.6 755.4 279.1z" fill="#00d8ff"/>
            </svg>
            <div className="flex flex-col items-start text-left mt-0.5">
              <span className="text-[9px] text-white/90 uppercase font-medium leading-none mb-1">GET IT ON</span>
              <span className="text-[19px] font-semibold tracking-tight text-white leading-none">Google Play</span>
            </div>
          </Link>

          {/* App Store Button */}
          <Link href="#" className="flex items-center justify-center gap-3 bg-black hover:bg-[#111] border border-white/20 px-4 py-[9px] rounded-xl transition-all duration-300 min-w-[170px]">
            <svg viewBox="0 0 384 512" width="22" height="24" fill="white">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            <div className="flex flex-col items-start text-left mt-0.5">
              <span className="text-[9px] text-white/90 font-medium leading-none mb-1">Download on the</span>
              <span className="text-[19px] font-semibold tracking-tight text-white leading-none">App Store</span>
            </div>
          </Link>
        </motion.div>

        {/* iPhone Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="relative w-[300px] h-[600px] md:w-[340px] md:h-[680px] bg-black rounded-[45px] md:rounded-[55px] border-[8px] md:border-[10px] border-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-20 group"
        >
          {/* Dynamic Island Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30" />
          
          {/* Side Buttons (Volume & Power) */}
          <div className="absolute top-32 -left-[14px] w-[6px] h-12 bg-black/80 rounded-l-md z-0" />
          <div className="absolute top-48 -left-[14px] w-[6px] h-12 bg-black/80 rounded-l-md z-0" />
          <div className="absolute top-36 -right-[14px] w-[6px] h-16 bg-black/80 rounded-r-md z-0" />

          {/* App Screen Content */}
          <div className="w-full h-full relative bg-[#0a0a0a] flex flex-col items-center">
            
            {/* Screen Background Image */}
            <div className="absolute inset-0 z-0">
              <Image src="/images/download-bg-blue.png" alt="App Background" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-[#0a0a0a]/90" />
            </div>

            {/* App UI Elements */}
            <div className="relative z-10 flex flex-col items-center h-full w-full">
              
              {/* Status Bar Fake Info */}
              <div className="w-full flex justify-between items-center px-6 pt-4 pb-2 text-[10px] font-medium text-white/90">
                <span>5:13</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-white/50 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* App Logo & Subtitle */}
              <div className="mt-24 text-center">
                <div className="text-3xl font-black text-white tracking-widest flex items-center justify-center">
                  ENTRY<span className="text-blue-500 ml-1">CLUB</span>
                </div>
                <div className="text-[10px] font-bold tracking-widest text-white/80 mt-1 uppercase">
                  Find the Vibe Everywhere!
                </div>
              </div>

              {/* Bottom Card overlapping background */}
              <div className="mt-auto mb-8 mx-5 p-6 bg-white/[0.08] backdrop-blur-md rounded-3xl border border-white/10 text-center shadow-xl">
                <h3 className="font-bold text-white text-lg mb-2">Welcome to Entry Club</h3>
                <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                  The social app where real people meet real vibes. Discover, host or join events and turn every moment into a memory worth keeping!
                </p>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
