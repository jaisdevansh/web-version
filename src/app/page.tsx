'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

import { ShieldCheck, Ticket, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

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
const ROTATING_FEATURES = [
    {
        title: "Flawless Booking",
        desc: "Ditch the clunky platforms. Sell GA tickets, manage complex table minimums, and process VIP requests directly through your own beautifully branded portal.",
        bullets: ['Dynamic Pricing Engine', 'Automated Table Approvals', 'Zero-delay payouts'],
        icon: Ticket,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        img: "/flawless.png",
        uiTitle: "VIP Table Booked",
        uiSubtitle: "Confirmed for tonight.",
        uiIcon: Ticket,
        uiColor: "text-blue-400"
    },
    {
        title: "A Frictionless Front Door Experience",
        desc: "Your door staff shouldn't be scrolling through clipboards. Our sub-100ms sync engine ensures that guestlists, promoter tracking, and ban-lists are instantly updated across all devices.",
        bullets: ['Sub-100ms Offline Sync', 'Promoter Performance Tracking', 'Instant ID Verification', 'VIP Arrival Alerts'],
        icon: Users,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        img: "/slide2.png",
        uiTitle: "Identity Verified",
        uiSubtitle: "Welcome back, Alex.",
        uiIcon: ShieldCheck,
        uiColor: "text-indigo-400"
    },
    {
        title: "Bank-Grade Security",
        desc: "We protect your venue's data and revenue with enterprise-grade infrastructure. End-to-end encryption and dynamic QR codes eliminate ticket fraud completely.",
        bullets: ['Dynamic QR Codes', 'End-to-end Encryption', 'Role-based Access Control', 'Automated Fraud Detection'],
        icon: ShieldCheck,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10 border-indigo-500/20",
        img: "/invalid-qr.png",
        uiTitle: "Fraud Prevented",
        uiSubtitle: "Invalid QR code detected.",
        uiIcon: ShieldCheck,
        uiColor: "text-red-400"
    }
];

function RotatingFeatureSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % ROTATING_FEATURES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const feature = ROTATING_FEATURES[activeIndex];

    return (
        <div className="py-24 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <div className="space-y-8">
                        <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} border flex items-center justify-center`}>
                            <feature.icon className={`w-7 h-7 ${feature.color}`} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            {feature.title}
                        </h2>
                        <p className="text-lg text-white/60 font-light leading-relaxed">
                            {feature.desc}
                        </p>
                        <ul className="space-y-4">
                            {feature.bullets.map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-white/80">
                                    <CheckCircle2 className={`w-5 h-5 ${feature.color}`} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-1 flex items-center justify-center overflow-hidden shadow-2xl relative group">
                            <img 
                                src={feature.img} 
                                alt={feature.title} 
                                className="w-full h-full object-cover rounded-2xl opacity-60 mix-blend-screen"
                            />
                            {/* Floating UI Element */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute top-8 left-8 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl"
                            >
                                <div className="flex items-center space-x-4">
                                    <feature.uiIcon className={`w-8 h-8 ${feature.uiColor}`} />
                                    <div>
                                        <p className="text-white font-medium">{feature.uiTitle}</p>
                                        <p className="text-white/60 text-sm">{feature.uiSubtitle}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-24"
            >
                <Link href="/features" className="group inline-flex items-center px-8 py-4 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] rounded-full text-white font-semibold text-lg transition-all hover:scale-105">
                    View All Features <ArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </div>
    );
}

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
                <RotatingFeatureSection />
            </div>
        </div>

        {/* About Preview */}
        <div className="relative z-20 bg-[#020202] py-32 px-6 border-y border-white/[0.02] overflow-hidden">
            <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm">
                            The Entry Club Story
                        </div>
                        
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-xl leading-tight">
                            Revolutionizing <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Exclusive Access</span>
                        </h2>
                        
                        <p className="text-lg text-white/60 font-light leading-relaxed">
                            Founded by industry veterans, Entry Club was built to solve the real-world operational challenges faced by premium venue owners, promoters, and event organizers every single night.
                        </p>
                        
                        <p className="text-lg text-white/60 font-light leading-relaxed">
                            We believe that technology should enhance the guest experience, not get in the way. That is why we have engineered a seamless, enterprise-grade ecosystem that connects your staff, your customers, and your data with zero friction.
                        </p>

                        <Link href="/about" className="inline-block mt-4">
                            <button className="relative px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden group">
                                <span className="relative z-10">Read Our Full Story</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </button>
                        </Link>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
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
            </div>
        </div>

        {/* Contact Form Preview */}
        <div className="relative z-20 bg-black py-32 px-6 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Get in Touch</h2>
                            <p className="text-white/50 text-xl font-light leading-relaxed">Ready to elevate your venue? Our elite team is ready to help you implement the world's most advanced nightlife platform.</p>
                        </div>
                        
                        <div className="space-y-6 pt-8 border-t border-white/5">
                            <h3 className="text-xl font-bold text-white">Download the App Now</h3>
                            <p className="text-white/60 font-light">For the best experience, faster bookings, and exclusive features, get the Entry Club mobile app.</p>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                                    <svg viewBox="0 0 384 512" className="w-6 h-6 mr-3 fill-current text-white group-hover:scale-110 transition-transform"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                                    <div className="text-left">
                                        <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Download on the</div>
                                        <div className="text-sm font-semibold text-white">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                                    <svg viewBox="0 0 512 512" className="w-6 h-6 mr-3 fill-current text-white group-hover:scale-110 transition-transform"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                                    <div className="text-left">
                                        <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Get it on</div>
                                        <div className="text-sm font-semibold text-white">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
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
        </div>
        </main>
    );
}
