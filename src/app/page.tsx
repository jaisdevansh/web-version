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
        <div className="relative z-20 bg-black py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Premium Features</h2>
                    <p className="text-white/50 text-lg">Everything you need to manage your exclusive venue.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all">
                        <Ticket className="w-8 h-8 text-blue-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Smart Ticketing</h3>
                        <p className="text-white/50 leading-relaxed">Sell GA tickets and manage VIP table minimums flawlessly.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all">
                        <Users className="w-8 h-8 text-purple-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Guest Management</h3>
                        <p className="text-white/50 leading-relaxed">Instant offline sync for guestlists and promoter tracking.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all">
                        <ShieldCheck className="w-8 h-8 text-indigo-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">Bank-Grade Security</h3>
                        <p className="text-white/50 leading-relaxed">Dynamic QR codes and end-to-end encryption eliminate fraud.</p>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <Link href="/features" className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center">
                        View All Features <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </div>

        {/* About Preview */}
        <div className="relative z-20 bg-[#050505] py-24 px-6 border-y border-white/5">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white">The Entry Club Story</h2>
                <p className="text-lg text-white/60 font-light leading-relaxed">
                    Founded by industry veterans, Entry Club was built to solve the real-world operational challenges faced by premium venue owners, promoters, and event organizers every single night.
                </p>
                <Link href="/about" className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all">
                    Read Our Full Story
                </Link>
            </div>
        </div>

        {/* Contact Form Preview */}
        <div className="relative z-20 bg-black py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h2>
                    <p className="text-white/50">Ready to elevate your venue? Drop us a line.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                            <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <textarea placeholder="Your Message" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </main>
    );
}
