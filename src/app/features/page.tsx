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

      {/* Deep Dive Feature 1: Ticketing */}
      <section className="bg-black py-24 md:py-32 overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 max-w-[1300px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="aspect-[4/3] rounded-3xl bg-[#111] border border-white/5 group-hover:border-blue-500/30 p-1 flex items-center justify-center overflow-hidden shadow-2xl relative transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/flawless.png" 
                  alt="Smart Ticketing Interface" 
                  className="w-full h-full object-cover rounded-2xl opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                />
                {/* Floating UI Element */}
                <div className="absolute bottom-8 right-8 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500 z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold uppercase tracking-tight">VIP Table Booked</p>
                      <p className="text-gray-400 text-sm font-light">₹2,500 Minimum</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Ticket className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-4xl md:text-[56px] font-black uppercase text-white tracking-tighter leading-[0.9]">
                Flawless Smart Ticketing <br/><span className="italic font-light text-blue-500">& VIP Bookings</span>
              </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                Ditch the clunky third-party platforms. Sell GA tickets, manage complex table minimums, and process VIP requests directly through your own beautifully branded portal. 
              </p>
              <ul className="space-y-4">
                {['Dynamic Pricing Engine', 'Automated Table Approvals', 'Apple/Google Wallet Integration', 'Zero-delay payout schedules'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-300 font-light">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Feature 2: Guest Management */}
      <section className="bg-black py-24 md:py-32 overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-4 max-w-[1300px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-4xl md:text-[56px] font-black uppercase text-white tracking-tighter leading-[0.9]">
                A Frictionless <span className="italic font-light text-indigo-400">Front Door</span> Experience
              </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                Your door staff shouldn't be scrolling through clipboards. Our sub-100ms sync engine ensures that guestlists, promoter tracking, and ban-lists are instantly updated across all devices.
              </p>
              <ul className="space-y-4">
                {['Sub-100ms Offline Sync', 'Promoter Performance Tracking', 'Instant ID Verification', 'VIP Arrival Alerts'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-300 font-light">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative group">
              <div className="aspect-[4/3] rounded-3xl bg-[#111] border border-white/5 group-hover:border-indigo-500/30 p-1 flex items-center justify-center overflow-hidden shadow-2xl relative transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/slide2.png" 
                  alt="Front Door Scanning" 
                  className="w-full h-full object-cover rounded-2xl opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                />
                 {/* Floating UI Element */}
                 <div className="absolute top-8 left-8 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 z-10">
                  <div className="flex items-center space-x-4">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    <div>
                      <p className="text-white font-bold uppercase tracking-tight">Identity Verified</p>
                      <p className="text-indigo-300 text-sm font-light">Welcome back.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Other Features */}
      <section className="bg-black text-white py-24 pb-32 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-[1300px] relative z-10">
          <div className="mb-16">
            <h4 className="text-center font-bold text-[20px] mb-4 text-blue-500">Everything's covered</h4>
            <h2 className="text-center text-4xl md:text-[64px] font-bold leading-[1.1] max-w-[960px] mx-auto text-white">
              We didn't just build a ticketing app. We built an entire ecosystem to power your venue.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Monitor revenue, bar spend, and attendance from your phone, in real time.', color: 'text-blue-400', hoverBorder: 'group-hover:border-blue-500/30', gradient: 'from-blue-500/5' },
              { icon: Zap, title: 'Lightning Fast POS', desc: 'Integrated point-of-sale systems that keep the drinks flowing without the lag.', color: 'text-cyan-400', hoverBorder: 'group-hover:border-cyan-500/30', gradient: 'from-cyan-500/5' },
              { icon: Smartphone, title: 'White-labeled App', desc: 'Give your most loyal guests a dedicated app with your own branding.', color: 'text-indigo-400', hoverBorder: 'group-hover:border-indigo-500/30', gradient: 'from-indigo-500/5' },
              { icon: ShieldCheck, title: 'Bank-Grade Security', desc: 'End-to-end encryption and dynamic QR codes eliminate ticket fraud completely.', color: 'text-blue-300', hoverBorder: 'group-hover:border-blue-300/30', gradient: 'from-blue-300/5' },
              { icon: Users, title: 'Staff Management', desc: 'Granular permissions ensure the right staff have access to the right tools.', color: 'text-sky-400', hoverBorder: 'group-hover:border-sky-500/30', gradient: 'from-sky-500/5' },
              { icon: Star, title: 'CRM Integration', desc: 'Know your biggest spenders and build automated retention campaigns.', color: 'text-blue-500', hoverBorder: 'group-hover:border-blue-600/30', gradient: 'from-blue-600/5' },
            ].map((feature, i) => (
              <div 
                key={i}
                className={`p-10 rounded-2xl bg-[#111] border border-white/5 ${feature.hoverBorder} transition-colors duration-500 group relative overflow-hidden flex flex-col`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <feature.icon className={`w-10 h-10 ${feature.color} mb-6 relative z-10`} />
                <h3 className="text-[24px] font-bold uppercase tracking-tight text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-[16px] text-gray-400 font-light leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
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
