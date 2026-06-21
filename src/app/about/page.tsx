'use client';

import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Zap, Lock, Globe, Users } from "lucide-react";
import { useState, useEffect } from "react";

function LiveStats({ itemVariants }: { itemVariants: any }) {
  const [venues, setVenues] = useState(542);
  const [tickets, setTickets] = useState(1000);
  const [kyc, setKyc] = useState(64);
  const [uptime, setUptime] = useState(99.99);

  useEffect(() => {
    // Venues slowly increase
    const vInterval = setInterval(() => {
      setVenues(prev => prev + 1);
    }, 8500);

    // Tickets increase quickly
    const tInterval = setInterval(() => {
      setTickets(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 1200);

    // KYC fluctuates
    const kInterval = setInterval(() => {
      setKyc(Math.floor(Math.random() * 30) + 45); // between 45 and 75ms
    }, 2000);

    // Uptime fluctuates slightly
    const uInterval = setInterval(() => {
      setUptime(prev => prev === 99.99 ? 99.98 : 99.99);
    }, 15000);

    return () => {
      clearInterval(vInterval);
      clearInterval(tInterval);
      clearInterval(kInterval);
      clearInterval(uInterval);
    };
  }, []);

  const stats = [
    { icon: Globe, label: "Venues Worldwide", value: venues.toLocaleString(), color: "text-blue-400" },
    { icon: Users, label: "Tickets Sold", value: tickets.toLocaleString(), color: "text-purple-400" },
    { icon: Zap, label: "Instant KYC", value: `${kyc}ms`, color: "text-indigo-400" },
    { icon: ShieldCheck, label: "Uptime", value: `${uptime}%`, color: "text-blue-300" }
  ];

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-colors backdrop-blur-sm"
        >
          <stat.icon className={`h-8 w-8 ${stat.color} mb-4`} />
          <h4 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 tabular-nums">{stat.value}</h4>
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden py-20 selection:bg-blue-500/30">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <motion.div 
        className="container relative z-10 px-4 md:px-6 mx-auto space-y-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* App Banner */}
        <motion.div variants={item} className="relative z-20 max-w-4xl mx-auto bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-full shrink-0">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Looking for a smoother flow?</h3>
              <p className="text-white/70 text-sm font-light leading-relaxed">For the best experience, faster bookings, and exclusive features, please use the Entry Club mobile app.</p>
            </div>
          </div>
          <button className="whitespace-nowrap px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] text-sm shrink-0">
            Download App
          </button>
        </motion.div>
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={item} className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm">
              The Entry Club Story
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-xl">
              Revolutionizing <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Exclusive Access</span>
            </h1>
            
            <p className="text-lg text-white/60 font-light leading-relaxed">
              Founded by industry veterans, Entry Club was built to solve the real-world operational challenges faced by premium venue owners, promoters, and event organizers every single night.
            </p>
            
            <p className="text-lg text-white/60 font-light leading-relaxed">
              We believe that technology should enhance the guest experience, not get in the way. That is why we have engineered a seamless, enterprise-grade ecosystem that connects your staff, your customers, and your data with zero friction.
            </p>
          </motion.div>
          
          <motion.div 
            variants={item} 
            className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <img 
              src="/slide3.png" 
              alt="Premium Nightlife" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
            <div className="absolute bottom-0 left-0 right-0 p-10 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-lg">Premium Experience</h3>
              <p className="text-white/70 font-light text-lg">Designed exclusively for the best venues in the world.</p>
            </div>
          </motion.div>
        </div>

        {/* Live Stats Section */}
        <LiveStats itemVariants={item} />

        {/* The Technology / Foundation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={item} 
            className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { title: "Enterprise Security", desc: "Bank-grade encryption, token-based authentication, and HTTPS-only traffic to keep your data secure.", icon: Lock },
              { title: "Lightning Fast", desc: "Optimized infrastructure ensuring sub-100ms response times for critical host approval flows.", icon: Zap },
              { title: "Smart Sync", desc: "Real-time background uploads and smart caching means your staff never waits on the app.", icon: TrendingUp },
              { title: "Production Ready", desc: "Built on an enterprise-scale architecture designed to handle thousands of concurrent club entries.", icon: ShieldCheck },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                <feature.icon className="h-6 w-6 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={item} className="order-1 lg:order-2 space-y-8 lg:pl-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Built on a foundation of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Uncompromising Tech</span>
            </h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              We did not just build another ticketing app. We built a comprehensive, production-ready operating system for nightlife. 
            </p>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              From instant KYC background processing to sub-100ms API responses and military-grade security protocols, Entry Club is engineered to perform flawlessly in high-pressure, fast-paced environments where every second counts.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div variants={item} className="relative rounded-3xl overflow-hidden bg-blue-900/20 border border-blue-500/20 p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to elevate your venue?</h2>
            <p className="text-lg text-white/70 font-light">
              Join the hundreds of premium clubs worldwide that trust Entry Club to manage their most exclusive events.
            </p>
            <div className="pt-4">
              <button className="bg-white text-black px-8 py-4 rounded-full font-bold tracking-wide hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                GET IN TOUCH
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
