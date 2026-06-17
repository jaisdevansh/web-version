'use client';

import { motion } from "framer-motion";
import { Star, ShieldCheck, Ticket, Users, BarChart3, Smartphone, Zap, ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <section className="bg-black pt-20 md:pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1536px]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-8 mt-4 md:mt-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-white/80 tracking-[0.2em] uppercase">Next-Generation Venue Management</span>
          </div>

          <h1 className="text-6xl md:text-[128px] leading-[0.9] font-black uppercase tracking-tighter mb-8 text-white max-w-7xl">
            The OS for <span className="italic font-light text-blue-500">Exclusive Nightlife</span>
          </h1>
          
          <p className="text-lg md:text-[18px] text-gray-400 max-w-[800px] mb-12">
            Entry Club unifies ticketing, guestlist management, point-of-sale, and real-time analytics into a single, beautifully designed platform built for the world's top venues.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto px-[32px] py-[28px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full uppercase tracking-wider text-[13px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] border-0 text-center flex justify-center items-center h-auto">
              Request Access <ArrowUpRight className="ml-2 w-5 h-5" strokeWidth={3} />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-[32px] py-[28px] bg-transparent text-white border-2 border-white/10 font-bold rounded-full hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 uppercase tracking-wider text-[13px] text-center h-auto">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Staggered Features Section */}
      <section className="bg-black py-24 md:py-32 overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 max-w-[1300px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 items-start">
            
            {/* Column 1 */}
            <div className="space-y-24">
              {/* Feature 01 */}
              <div className="group">
                <div className="aspect-[4/3] rounded-3xl bg-[#111] border border-white/5 mb-8 overflow-hidden shadow-2xl relative transition-all duration-500 group-hover:border-blue-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src="/flawless.png" 
                    alt="Sell Tickets" 
                    className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[32px] font-black uppercase text-white tracking-tighter mb-4 flex items-baseline gap-4">
                  <span className="text-gray-600 font-bold text-[32px]">01.</span> SELL TICKETS
                </h3>
                <p className="text-gray-400 font-light leading-relaxed text-[18px]">
                  Increase conversions and give your customers a premium buying experience. Our optimised, intuitive ticketing and marketing features give you everything you need to maximise ticket sales.
                </p>
              </div>

              {/* Feature 03 */}
              <div className="group">
                <div className="aspect-[4/3] rounded-3xl bg-[#111] border border-white/5 mb-8 overflow-hidden shadow-2xl relative transition-all duration-500 group-hover:border-indigo-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src="/slide3.png" 
                    alt="Front Door" 
                    className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[32px] font-black uppercase text-white tracking-tighter mb-4 flex items-baseline gap-4">
                  <span className="text-gray-600 font-bold text-[32px]">03.</span> FRONT DOOR EXPERIENCE
                </h3>
                <p className="text-gray-400 font-light leading-relaxed text-[18px]">
                  Your door staff shouldn't be scrolling through clipboards. Our sub-100ms sync engine ensures that guestlists, promoter tracking, and ban-lists are instantly updated across all devices.
                </p>
              </div>
            </div>

            {/* Column 2 (Staggered) */}
            <div className="space-y-24 md:mt-32">
              {/* Feature 02 */}
              <div className="group">
                <div className="aspect-[4/3] rounded-3xl bg-[#111] border border-white/5 mb-8 overflow-hidden shadow-2xl relative transition-all duration-500 group-hover:border-sky-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src="/slide2.png" 
                    alt="Build a Following" 
                    className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[32px] font-black uppercase text-white tracking-tighter mb-4 flex items-baseline gap-4">
                  <span className="text-gray-600 font-bold text-[32px]">02.</span> BUILD A FOLLOWING
                </h3>
                <p className="text-gray-400 font-light leading-relaxed text-[18px]">
                  Grow your audience with every ticket you sell. Every time a customer purchases a ticket to your event on Entry Club they become part of your following. Giving you a stronger foundation to launch your next event.
                </p>
              </div>

              {/* Feature 04 */}
              <div className="group">
                <div className="aspect-[4/3] rounded-3xl bg-[#111] border border-white/5 mb-8 overflow-hidden shadow-2xl relative transition-all duration-500 group-hover:border-cyan-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src="/flawless.png" 
                    alt="Real-time Analytics" 
                    className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[32px] font-black uppercase text-white tracking-tighter mb-4 flex items-baseline gap-4">
                  <span className="text-gray-600 font-bold text-[32px]">04.</span> REAL-TIME ANALYTICS
                </h3>
                <p className="text-gray-400 font-light leading-relaxed text-[18px]">
                  Monitor revenue, bar spend, and attendance from your phone, in real time. Our dashboard gives you the insights you need to make informed decisions without waiting for the night to end.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-24 pb-48 relative overflow-hidden border-t border-white/10">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.1)] w-full max-w-[1312px] min-h-[600px] md:min-h-[754px] rounded-3xl relative flex flex-col items-center justify-center px-4 py-20 md:p-[176px_80px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

            {/* Phone Mockups (Absolute) */}
            <div className="hidden md:flex absolute -left-[32px] -bottom-[64px] w-[300px] h-[500px] bg-[#111] border-[12px] border-[#181817] rounded-[40px] items-center justify-center shadow-2xl overflow-hidden z-10">
              <img src="/slide2.png" alt="App Preview" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="hidden md:flex absolute -right-[48px] -top-[48px] w-[300px] h-[500px] bg-[#111] border-[12px] border-[#181817] rounded-[40px] items-center justify-center shadow-2xl overflow-hidden z-10">
               <img src="/slide3.png" alt="App Preview" className="w-full h-full object-cover opacity-80" />
            </div>

            <h2 className="text-white text-5xl md:text-[112px] font-medium leading-[0.9] text-center mb-10 z-20 uppercase">
              Ready to elevate <span className="italic font-light">your venue?</span>
            </h2>
            
            <p className="text-gray-300 font-light text-[16px] text-center max-w-[512px] mb-12 z-20 leading-relaxed opacity-90">
              Join the most exclusive network of nightlife venues. Upgrade to Entry Club today and see the difference immediately.
            </p>

            <Link href="/contact" className="z-20">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] px-[32px] py-[28px] h-auto rounded-full uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] border-0 flex items-center justify-center">
                Create Your Account <ArrowUpRight className="ml-2 w-5 h-5" strokeWidth={3} />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
