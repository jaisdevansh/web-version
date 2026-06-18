'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Eye, Share2, Lock, Sliders, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden pt-32 pb-32 font-sans selection:bg-cyan-500/30">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full pointer-events-none fixed" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-600/10 blur-[180px] rounded-full pointer-events-none fixed" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24 text-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center px-5 py-2 mb-8 text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.15)]"
          >
            Data Protection
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            How we collect, use, and fiercely protect your personal information on our exclusive platform.
          </p>
          <div className="mt-12 pt-10 border-t border-white/5 flex justify-center items-center space-x-3 text-sm text-white/40 uppercase tracking-[0.15em] font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse"></span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>

        <div className="relative text-white/80 max-w-4xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[35px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-cyan-500/50 via-teal-500/20 to-transparent hidden md:block" />

          <div className="space-y-10">
            {/* Section 1 */}
            <motion.section 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
                <Database className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Database className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">1. Information We Collect</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">1. Information We Collect</h2>
                <div className="space-y-8 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, update your profile, use our services, request customer support, or communicate with us.
                  </p>
                  <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/10">
                    <h3 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase text-cyan-400">This may include:</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <li className="flex items-center space-x-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <span className="font-medium text-white/90">Name & Contact Details</span>
                      </li>
                      <li className="flex items-center space-x-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <span className="font-medium text-white/90">Payment Information</span>
                      </li>
                      <li className="flex items-center space-x-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <span className="font-medium text-white/90">Location Data</span>
                      </li>
                      <li className="flex items-center space-x-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <span className="font-medium text-white/90">Device Information</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
                <Eye className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Eye className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">2. How We Use Information</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">2. How We Use Information</h2>
                <div className="space-y-5 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices and support messages.
                  </p>
                  <p>
                    This information also helps us communicate with you about products, services, offers, and events offered by Entry Club and our carefully selected partner venues, ensuring a tailored and exclusive experience.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
                <Share2 className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Share2 className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">3. Information Sharing</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">3. Information Sharing</h2>
                <div className="space-y-8 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    We may share your information with our partner venues strictly to facilitate your access, ticketing, and guestlist requests.
                  </p>
                  <div className="p-8 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl flex items-center">
                    <Lock className="w-6 h-6 text-cyan-400 mr-5 shrink-0" />
                    <p className="text-white/90 font-medium text-lg">We never sell your personal information to third parties.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
                <Lock className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">4. Data Security</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">4. Data Security</h2>
                <div className="space-y-8 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    We implement enterprise-grade security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                      <h4 className="text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-widest">Encryption</h4>
                      <p className="text-white/60">End-to-end encryption for all sensitive data and transactions.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                      <h4 className="text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-widest">Access Control</h4>
                      <p className="text-white/60">Strict internal access protocols and regular security audits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
                <Sliders className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Sliders className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">5. Your Choices</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">5. Your Choices</h2>
                <div className="space-y-5 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    You have full control over your data. You may update, correct, or delete your account information at any time by logging into your account settings.
                  </p>
                  <p>
                    You can also opt out of receiving promotional communications from us by following the instructions in those messages or updating your notification preferences in the dashboard.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 6 */}
            <motion.section 
              initial={{ opacity: 0, x: 40 }}
               whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-2xl">
                <Mail className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">6. Contact Us</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">6. Contact Us</h2>
                <div className="space-y-10 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our data practices, our privacy team is here to help.
                  </p>
                  <a href="mailto:privacy@entryclub.com" className="group relative inline-flex items-center justify-center px-8 py-5 text-sm font-bold tracking-[0.2em] text-[#030303] uppercase overflow-hidden rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)]">
                    <span className="relative z-10">Contact Privacy Team</span>
                  </a>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
}
