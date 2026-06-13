'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

import { ShieldCheck, Ticket, Users, ArrowRight } from 'lucide-react';

const SLIDES = [
    {
        id: '1',
        title: 'Curated Nightlife',
        subtitle: "Discover the city's most exclusive venues, handpicked for the discerning few.",
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '2',
        title: 'Exclusive Access',
        subtitle: 'Experience the pinnacle of nightlife. Skip the lines and walk right into the most sought-after events.',
        image: '/slide2.png',
    },
    {
        id: '3',
        title: 'VIP Treatment',
        subtitle: 'Elevate your nights with premium table service and bespoke experiences crafted just for you.',
        image: '/slide3.png',
    }
];

export default function WelcomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="w-full flex flex-col min-h-screen bg-black overflow-x-hidden">
        <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-black text-white selection:bg-blue-500/30">
            {/* Background Image Carousel */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={SLIDES[currentIndex].image}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </AnimatePresence>

            {/* Gradient Overlay matching mobile styling */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/95" />

            {/* Logo Section */}
            <div className="relative z-10 mt-20 flex flex-col items-center pointer-events-none">
                <div className="flex h-[130px] w-[130px] items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    <span className="text-4xl font-light tracking-[0.1em] text-white/90 translate-x-[0.05em]">EC</span>
                </div>
                <div className="mt-8 flex flex-col items-center">
                    <h1 className="text-3xl font-light tracking-[0.55em] text-white translate-x-[0.275em]">ENTRY CLUB</h1>
                    <div className="my-5 h-[1px] w-12 bg-white/30" />
                    <p className="text-[10px] font-bold tracking-[0.7em] text-white/40 translate-x-[0.35em]">
                        EXCLUSIVE ACCESS
                    </p>
                </div>
            </div>

            {/* Bottom Action Section */}
            <div className="relative z-10 w-full px-6 pb-12 text-left md:max-w-md md:mx-auto">
                <div className="min-h-[120px] flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="mb-3 text-[38px] leading-tight font-bold tracking-tight text-white drop-shadow-xl">
                                {SLIDES[currentIndex].title}
                            </h2>
                            <p className="text-[16px] leading-relaxed text-white/85 drop-shadow-md font-medium">
                                {SLIDES[currentIndex].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Highly Performant Indicator Dots (mimicking mobile interpolation) */}
                <div className="mt-4 mb-10 flex items-center space-x-2">
                    {SLIDES.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${
                                idx === currentIndex ? 'w-6 bg-blue-600 scale-100' : 'w-2 bg-blue-600/30 scale-80'
                            }`}
                        />
                    ))}
                </div>

                {/* Button Container */}
                <div className="flex flex-col space-y-5">
                    <Link href="/register" className="w-full">
                        <Button className="h-14 w-full text-[16px] font-bold tracking-wide bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all">
                            Get Started
                        </Button>
                    </Link>
                    <div className="text-center">
                        <Link href="/login" className="inline-block px-4 py-2 opacity-80 hover:opacity-100 transition-opacity">
                            <span className="text-[14px] font-semibold text-white/60">
                                Already have an account? <span className="text-[#2563EB] font-bold ml-1">Sign In</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Scrolling Sections */}
        {/* Features Preview */}
        <div className="relative z-20 bg-black py-32 px-6 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 mb-6">Premium Features</h2>
                    <p className="text-white/50 text-xl font-light max-w-2xl mx-auto">Everything you need to manage your exclusive venue with military precision.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Ticket, title: "Smart Ticketing", desc: "Sell GA tickets and manage VIP table minimums flawlessly.", color: "text-blue-400", bg: "group-hover:bg-blue-500/10" },
                        { icon: Users, title: "Guest Management", desc: "Instant offline sync for guestlists and promoter tracking.", color: "text-purple-400", bg: "group-hover:bg-purple-500/10" },
                        { icon: ShieldCheck, title: "Bank-Grade Security", desc: "Dynamic QR codes and end-to-end encryption eliminate fraud.", color: "text-indigo-400", bg: "group-hover:bg-indigo-500/10" }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group relative p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.15] hover:-translate-y-2 transition-all duration-500 overflow-hidden backdrop-blur-xl"
                        >
                            <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${feature.bg}`} />
                            <div className="relative z-10">
                                <feature.icon className={`w-10 h-10 ${feature.color} mb-8 transform group-hover:scale-110 transition-transform duration-500`} />
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-white/50 leading-relaxed font-light">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Link href="/features" className="group inline-flex items-center text-blue-400 hover:text-white font-semibold text-lg transition-colors">
                        View All Features <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* About Preview */}
        <div className="relative z-20 bg-[#020202] py-32 px-6 border-y border-white/[0.02] overflow-hidden">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent blur-[100px] pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="space-y-10"
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-4 backdrop-blur-md">
                        The Entry Club Story
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                        Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Nightlife Elite</span>
                    </h2>
                    <p className="text-xl text-white/50 font-light leading-relaxed max-w-3xl mx-auto">
                        Founded by industry veterans, Entry Club was built to solve the real-world operational challenges faced by premium venue owners, promoters, and event organizers every single night.
                    </p>
                    <Link href="/about" className="inline-block mt-8">
                        <button className="relative px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden group">
                            <span className="relative z-10">Read Our Full Story</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Contact Form Preview */}
        <div className="relative z-20 bg-black py-32 px-6 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in Touch</h2>
                    <p className="text-white/50 text-xl font-light">Ready to elevate your venue? Our elite team is ready.</p>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-10 md:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <form className="relative z-10 space-y-8" onSubmit={(e) => { e.preventDefault(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-white/40 uppercase pl-2">Name</label>
                                <input type="text" placeholder="John Doe" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-white/40 uppercase pl-2">Email</label>
                                <input type="email" placeholder="john@example.com" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-white/40 uppercase pl-2">Message</label>
                            <textarea placeholder="Tell us about your venue..." rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all resize-none"></textarea>
                        </div>
                        <button type="submit" className="w-full relative overflow-hidden bg-white text-black font-bold text-lg py-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] group/btn mt-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Send Transmission</span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
        </main>
    );
}
