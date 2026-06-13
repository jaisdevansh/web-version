'use client';

import { motion } from "framer-motion";
import { Star, ShieldCheck, Ticket, Users, BarChart3, Smartphone, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-blue-500/30">
      {/* Background Glow Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[150px]" />
        <div className="absolute top-[40%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-white/5">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUpVariants} className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 backdrop-blur-sm mb-8">
            <Star className="mr-2 h-4 w-4" /> Next-Generation Venue Management
          </motion.div>
          
          <motion.h1 variants={fadeUpVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl leading-[1.1] mb-8">
            The Operating System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Exclusive Nightlife</span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Entry Club unifies ticketing, guestlist management, point-of-sale, and real-time analytics into a single, beautifully designed platform built for the world's top venues.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 text-center flex justify-center items-center">
              Request Access <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 font-semibold rounded-full hover:bg-white/10 transition-all text-center">
              Book a Demo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Deep Dive Feature 1: Ticketing */}
      <section className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-900/40 to-purple-900/20 border border-white/10 p-1 flex items-center justify-center overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1540039155732-68473678c482?q=80&w=1200&auto=format&fit=crop" 
                alt="Smart Ticketing Interface" 
                className="w-full h-full object-cover rounded-2xl opacity-60 mix-blend-screen"
              />
              {/* Floating UI Element */}
              <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">VIP Table Booked</p>
                    <p className="text-white/50 text-sm">$2,500 Minimum</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Ticket className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Flawless Smart Ticketing & VIP Bookings
            </h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              Ditch the clunky third-party platforms. Sell GA tickets, manage complex table minimums, and process VIP requests directly through your own beautifully branded portal. 
            </p>
            <ul className="space-y-4">
              {['Dynamic Pricing Engine', 'Automated Table Approvals', 'Apple/Google Wallet Integration', 'Zero-delay payout schedules'].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Deep Dive Feature 2: Guest Management */}
      <section className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              A Frictionless Front Door Experience
            </h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              Your door staff shouldn't be scrolling through clipboards. Our sub-100ms sync engine ensures that guestlists, promoter tracking, and ban-lists are instantly updated across all devices.
            </p>
            <ul className="space-y-4">
              {['Sub-100ms Offline Sync', 'Promoter Performance Tracking', 'Instant ID Verification', 'VIP Arrival Alerts'].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/20 border border-white/10 p-1 flex items-center justify-center overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop" 
                alt="Front Door Scanning" 
                className="w-full h-full object-cover rounded-2xl opacity-60 mix-blend-screen"
              />
               {/* Floating UI Element */}
               <div className="absolute top-8 left-8 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <div className="flex items-center space-x-4">
                  <ShieldCheck className="w-8 h-8 text-indigo-400" />
                  <div>
                    <p className="text-white font-medium">Identity Verified</p>
                    <p className="text-indigo-300 text-sm">Welcome back, Alex.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid of Other Features */}
      <section className="relative z-10 py-24 px-4 md:px-8 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-white/50 text-lg font-light">We didn't just build a ticketing app. We built an entire ecosystem to power your venue.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Monitor revenue, bar spend, and attendance from your phone, in real time.' },
              { icon: Zap, title: 'Lightning Fast POS', desc: 'Integrated point-of-sale systems that keep the drinks flowing without the lag.' },
              { icon: Smartphone, title: 'White-labeled App', desc: 'Give your most loyal guests a dedicated app with your own branding.' },
              { icon: ShieldCheck, title: 'Bank-Grade Security', desc: 'End-to-end encryption and dynamic QR codes eliminate ticket fraud completely.' },
              { icon: Users, title: 'Staff Management', desc: 'Granular permissions ensure the right staff have access to the right tools.' },
              { icon: Star, title: 'CRM Integration', desc: 'Know your biggest spenders and build automated retention campaigns.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-4 md:px-8 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Ready to elevate your venue?
          </h2>
          <p className="text-xl text-white/60 font-light mb-10 max-w-2xl mx-auto">
            Join the most exclusive network of nightlife venues. Upgrade to Entry Club today and see the difference immediately.
          </p>
          <Link href="/register" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(79,70,229,0.3)] text-lg">
            Create Your Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
