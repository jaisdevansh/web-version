import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TestimonialsMarquee } from './TestimonialsMarquee';
import { CityExplorer } from './CityExplorer';
import { FAQSection } from './FAQSection';

export function BottomSections() {
    return (
        <>
            {/* How It Works Section - Premium */}
            <div className="relative z-20 bg-black py-16 lg:py-20 px-6 overflow-hidden">
                {/* Animated Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] transform-gpu" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] transform-gpu" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm mb-6">
                            The Entry Club Experience
                        </div>
                        <h2 className="text-hero text-white tracking-tight drop-shadow-xl">
                            Unlock The City's <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Best Events</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 mb-12 relative items-center justify-center pt-10 perspective-[800px]">
                        
                        {/* Stamp CSS defined inline for the cutouts */}
                        <style dangerouslySetInnerHTML={{__html: `
                          .stamp-cutout {
                            -webkit-mask: 
                              linear-gradient(#000 0 0), 
                              radial-gradient(circle at 0 18px, #000 12px, transparent 12.5px), 
                              radial-gradient(circle at 100% 18px, #000 12px, transparent 12.5px), 
                              radial-gradient(circle at 18px 0, #000 12px, transparent 12.5px), 
                              radial-gradient(circle at 18px 100%, #000 12px, transparent 12.5px);
                            -webkit-mask-size: 100% 100%, 12px 36px, 12px 36px, 36px 12px, 36px 12px;
                            -webkit-mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
                            -webkit-mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
                            -webkit-mask-composite: destination-out;
                            
                            mask: 
                              linear-gradient(#000 0 0), 
                              radial-gradient(circle at 0 18px, #000 12px, transparent 12.5px), 
                              radial-gradient(circle at 100% 18px, #000 12px, transparent 12.5px), 
                              radial-gradient(circle at 18px 0, #000 12px, transparent 12.5px), 
                              radial-gradient(circle at 18px 100%, #000 12px, transparent 12.5px);
                            mask-size: 100% 100%, 12px 36px, 12px 36px, 36px 12px, 36px 12px;
                            mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
                            mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
                            mask-composite: subtract;
                          }
                        `}} />

                        {/* Card 1: Rating & Reviews */}
                        <motion.div
                            initial={{ opacity: 0, rotateY: 45, rotateX: 30, y: 100, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, scale: 1 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                            className="relative z-10 w-full max-w-[320px] mx-auto transform-style-3d will-change-transform"
                        >
                            <div className="stamp-cutout bg-blue-600 p-8 md:p-6 lg:p-8 rounded-xl min-h-[400px] flex flex-col justify-end relative shadow-2xl overflow-hidden hover:-translate-y-4 transition-transform duration-500">
                                {/* Decorative elements */}
                                <div className="absolute top-8 left-6 right-6 h-[180px] bg-white/20 rounded-xl mb-6 relative">
                                  {/* Mock Review 1 */}
                                  <div className="absolute top-2 left-2 bg-white rounded-lg p-2 shadow-lg w-[85%] z-10">
                                    <div className="flex gap-1 mb-1 text-yellow-400 text-xs">
                                      <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
                                    </div>
                                    <div className="text-[9px] text-gray-800 font-medium">The event felt amazing with strangers!</div>
                                  </div>
                                  {/* Mock Review 2 */}
                                  <div className="absolute top-16 right-2 bg-[#fff8e1] rounded-lg p-2 shadow-lg w-[85%] z-20">
                                    <div className="flex gap-1 mb-1 text-yellow-500 text-xs">
                                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                    </div>
                                    <div className="text-[9px] text-gray-800 font-medium">Amazing arrangements and the crowd was just fab!</div>
                                  </div>
                                </div>
                                
                                <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-md">Rating & <br/>Reviews</h3>
                                <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-sm">Before you join anything, you can check for verified profiles, user ratings and what others have said.</p>
                            </div>
                        </motion.div>

                        {/* Card 2: Join & Create Events */}
                        <motion.div
                            initial={{ opacity: 0, rotateY: 45, rotateX: 30, y: 100, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, scale: 1 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.1 }}
                            className="relative z-20 w-full max-w-[340px] mx-auto md:-translate-y-8 transform-style-3d will-change-transform"
                        >
                            <div className="stamp-cutout bg-blue-500 p-8 md:p-6 lg:p-8 rounded-xl min-h-[440px] flex flex-col justify-end relative shadow-[0_20px_50px_rgba(59,130,246,0.3)] overflow-hidden hover:-translate-y-4 hover:scale-105 transition-transform duration-500">
                                {/* Decorative elements */}
                                <div className="absolute top-6 left-6 right-6 h-[200px] bg-white rounded-xl mb-6 relative overflow-hidden shadow-inner">
                                  {/* Map background placeholder */}
                                  <div className="absolute inset-0 bg-[#e5e5f7] opacity-60" style={{ backgroundImage: "radial-gradient(#444cf7 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
                                  
                                  {/* Mock Event Card */}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] bg-black text-white rounded-lg p-3 shadow-2xl border border-white/20">
                                    <div className="h-20 bg-gray-800 rounded-md mb-2 overflow-hidden relative">
                                      <div className="absolute inset-0 bg-blue-500/20" />
                                      <div className="absolute bottom-1 right-1 bg-blue-600 text-[8px] px-1 rounded">SPORTS</div>
                                    </div>
                                    <h4 className="font-bold text-xs uppercase text-[#c084fc]">Running Club</h4>
                                    <div className="text-[8px] text-gray-300 mt-1">22 Malviya Nagar, Jaipur</div>
                                  </div>
                                </div>
                                
                                <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-md">Join & Create <br/>Events</h3>
                                <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-sm">See something you like? Just join! Didn't find the right plan? Create one yourself and vibe with like-minded people.</p>
                            </div>
                        </motion.div>

                        {/* Card 3: Build Community */}
                        <motion.div
                            initial={{ opacity: 0, rotateY: 45, rotateX: 30, y: 100, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, scale: 1 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.2 }}
                            className="relative z-10 w-full max-w-[320px] mx-auto transform-style-3d will-change-transform"
                        >
                            <div className="stamp-cutout bg-blue-600 p-8 md:p-6 lg:p-8 rounded-xl min-h-[400px] flex flex-col justify-end relative shadow-2xl overflow-hidden hover:-translate-y-4 transition-transform duration-500">
                                {/* Decorative elements */}
                                <div className="absolute top-8 left-6 right-6 h-[180px] bg-white/20 rounded-xl mb-6 relative flex items-center justify-center overflow-hidden">
                                  {/* Photo placeholder */}
                                  <div className="absolute inset-2 bg-black rounded-lg overflow-hidden border-2 border-white transform -rotate-3">
                                    <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop" alt="Friends" fill className="object-cover grayscale opacity-80" loading="lazy" />
                                  </div>
                                  {/* Floating Badges */}
                                  <div className="absolute top-2 left-2 bg-[#6b21a8] text-white text-[10px] font-bold px-2 py-1 rounded-full rotate-6 shadow-lg">Fan Clubs</div>
                                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full -rotate-6 shadow-lg">Sports</div>
                                  <div className="absolute bottom-8 right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full rotate-12 shadow-lg">Travelling</div>
                                </div>
                                
                                <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-md">Build <br/>Community</h3>
                                <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-sm">Explore interest-based circles & connect with people who share your vibe.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Event Organiser CTA Section */}
            <div className="relative z-20 w-full py-16 overflow-hidden bg-black border-y border-white/[0.02]">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop" 
                        alt="Crowd cheering at a concert" 
                        fill 
                        quality={60}
                        loading="lazy"
                        sizes="100vw"
                        className="object-cover opacity-35 object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-black/75 to-purple-950/30" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-section text-white tracking-tight">
                            Are You An <span className="text-[#e879f9]">Event</span> <span className="text-[#818cf8]">Organiser?</span>
                        </h2>
                        <p className="text-body text-white/80">
                            Get Your Event Live in Less Than 3 Minutes
                        </p>
                        <div className="pt-2">
                            <Link href="/dashboard">
                                <button className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-md">
                                    List Event
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* App Promo Section - Premium */}
            <div className="relative z-20 bg-[#020202] py-16 lg:py-20 px-6 overflow-hidden border-t border-white/[0.02]">
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                            Your City. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Unlocked.</span>
                        </h2>

                        <div className="space-y-8 mb-16">
                            {[
                                { title: "Curated For Your Vibe", desc: "Skip the noise. Entry Club brings you handpicked events, secret gigs, and exclusive parties tailored to your taste." },
                                { title: "The Entry Club Community", desc: "Connect with people on the same wavelength. Join fan clubs, coordinate plans, and build your social circle." },
                                { title: "Instant Tickets & Guestlists", desc: "No more waiting. Book tickets in seconds, get on exclusive guestlists, and breeze through the doors." }
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="flex items-start group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mt-1 mr-6 shrink-0 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors shadow-lg">
                                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-card-heading text-white mb-2 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                                        <p className="text-white/70 text-body leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <h3 className="text-subheading text-white mb-8">Ready To Party Smarter?</h3>

                        <div className="flex flex-wrap gap-4">
                            <button aria-label="Get it on Google Play" className="flex items-center px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-white/30 transition-all transform hover:-translate-y-1 group backdrop-blur-md shadow-xl">
                                <svg viewBox="0 0 512 512" className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform">
                                    <defs>
                                        <linearGradient id="google-play-gradient-promo" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4285F4" />
                                            <stop offset="30%" stopColor="#34A853" />
                                            <stop offset="70%" stopColor="#FBBC05" />
                                            <stop offset="100%" stopColor="#EA4335" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#google-play-gradient-promo)" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Get it on</div>
                                    <div className="text-lg font-semibold text-white">Google Play</div>
                                </div>
                            </button>
                            <button aria-label="Download on the App Store" className="flex items-center px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-white/30 transition-all transform hover:-translate-y-1 group backdrop-blur-md shadow-xl">
                                <svg viewBox="0 0 384 512" className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform">
                                    <defs>
                                        <linearGradient id="apple-gradient-promo" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#FFFFFF" />
                                            <stop offset="100%" stopColor="#B0B5B9" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#apple-gradient-promo)" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                    </svg>
                                <div className="text-left">
                                    <div className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Download on the</div>
                                    <div className="text-lg font-semibold text-white">App Store</div>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Side Visual (Floating Glass Cards) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[450px] lg:h-[600px] w-full flex items-center justify-center scale-75 sm:scale-90 lg:scale-100 mt-4 lg:mt-0"
                    >
                        {/* Top Card Wrapper for Floating */}
                        <motion.div 
                            animate={{ y: [-12, 12, -12] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute z-30 transform -rotate-6 -translate-x-10"
                        >
                            {/* Inner Card for Drag & Hover */}
                            <motion.div 
                                drag
                                dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
                                dragElastic={0.2}
                                whileHover={{ scale: 1.05, rotate: 2, cursor: "grab" }}
                                whileTap={{ scale: 0.95, cursor: "grabbing" }}
                                className="w-[300px] h-[400px] bg-[#0A0A0F]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 hover:shadow-[0_0_50px_rgba(217,70,239,0.2)] transition-shadow border-t-white/20"
                            >
                                <div className="w-full h-40 bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative group">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600')] bg-cover opacity-60 blend-overlay" 
                                    />
                                </div>
                                <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-3/4 h-6 bg-white/10 rounded-full mt-2" />
                                <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }} className="w-1/2 h-4 bg-white/5 rounded-full" />
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-auto w-full h-12 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 font-bold text-sm hover:bg-fuchsia-500/30 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_25px_rgba(217,70,239,0.4)]"
                                >
                                    Get Ticket
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Bottom Card Wrapper for Floating */}
                        <motion.div 
                            animate={{ y: [12, -12, 12] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                            className="absolute z-10 transform rotate-12 translate-x-20 translate-y-20"
                        >
                            {/* Inner Card for Drag & Hover */}
                            <motion.div 
                                drag
                                dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
                                dragElastic={0.2}
                                whileHover={{ scale: 1.05, rotate: 6, zIndex: 40, cursor: "grab" }}
                                whileTap={{ scale: 0.95, cursor: "grabbing" }}
                                className="w-[300px] h-[400px] bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-shadow border-t-white/20"
                            >
                                <div className="w-full h-40 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative group">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600')] bg-cover opacity-60 blend-overlay" 
                                    />
                                </div>
                                <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }} className="w-3/4 h-6 bg-white/10 rounded-full mt-2" />
                                <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.8 }} className="w-1/2 h-4 bg-white/5 rounded-full" />
                                <div className="mt-auto w-full flex gap-2">
                                     <motion.div whileHover={{ y: -5 }} className="w-10 h-10 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-xs font-bold shadow-lg z-30 cursor-pointer">+3</motion.div>
                                     <motion.div whileHover={{ y: -5 }} className="w-10 h-10 rounded-full bg-blue-500/40 -ml-4 border border-white/20 backdrop-blur-md shadow-lg z-20 cursor-pointer" />
                                     <motion.div whileHover={{ y: -5 }} className="w-10 h-10 rounded-full bg-purple-500/40 -ml-4 border border-white/20 backdrop-blur-md shadow-lg z-10 cursor-pointer" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <TestimonialsMarquee />

            <CityExplorer />

            <FAQSection />

            {/* Contact Form Preview */}
            <div id="host-contact" className="relative z-20 bg-black py-32 px-6 overflow-hidden">
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
                                <h2 className="text-section text-white mb-6 tracking-tight">Want to be the host?</h2>
                                <p className="text-white/70 text-body leading-relaxed">Just fill this form and our team will connect with you within 24 hrs.</p>
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
                                        <label htmlFor="host-name" className="text-xs font-bold tracking-widest text-white/70 uppercase pl-2">Name</label>
                                        <input id="host-name" type="text" placeholder="John Doe" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="host-email" className="text-xs font-bold tracking-widest text-white/70 uppercase pl-2">Email</label>
                                        <input id="host-email" type="email" placeholder="john@example.com" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="host-message" className="text-xs font-bold tracking-widest text-white/70 uppercase pl-2">Message</label>
                                    <textarea id="host-message" placeholder="Tell us about your venue..." rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all resize-none"></textarea>
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
        </>
    );
}
