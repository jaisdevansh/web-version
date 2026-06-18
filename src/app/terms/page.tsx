'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Scale, UserCheck, AlertTriangle, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden pt-32 pb-32 font-sans selection:bg-blue-500/30">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none fixed" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none fixed" />
      
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
            className="inline-flex items-center justify-center px-5 py-2 mb-8 text-xs font-bold tracking-[0.2em] text-blue-400 uppercase rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            Legal Information
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform to understand your rights and responsibilities.
          </p>
          <div className="mt-12 pt-10 border-t border-white/5 flex justify-center items-center space-x-3 text-sm text-white/40 uppercase tracking-[0.15em] font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>

        <div className="relative text-white/80 max-w-4xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[35px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500/50 via-indigo-500/20 to-transparent hidden md:block" />

          <div className="space-y-10">
            {/* Section 1 */}
            <motion.section 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative md:pl-24 group"
            >
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-2xl">
                <Shield className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">1. Acceptance</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">1. Acceptance of Terms</h2>
                <div className="space-y-5 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    By accessing and using Entry Club, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Our services are exclusively available for approved users and partner venues.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you and Entry Club regarding your use of the platform. We reserve the right to update these terms at our discretion.
                  </p>
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
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-2xl">
                <UserCheck className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">2. User Accounts</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">2. User Accounts</h2>
                <div className="space-y-8 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/10">
                    <h3 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase text-blue-400">Account Requirements</h3>
                    <ul className="space-y-5">
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2.5 mr-5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <span>You must provide <strong className="text-white font-medium">accurate and complete information</strong> during registration.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2.5 mr-5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <span>You are responsible for safeguarding your password and multi-factor authentication.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2.5 mr-5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        <span>Entry Club reserves the right to <strong className="text-white font-medium">terminate accounts</strong> that violate our community standards or exclusivity guidelines.</span>
                      </li>
                    </ul>
                  </div>
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
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-2xl">
                <FileText className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">3. Platform Services</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">3. Platform Services</h2>
                <div className="space-y-5 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    Entry Club provides enterprise-grade technology for exclusive nightlife venues, including host approvals, ticketing, guest management, and VIP concierge services.
                  </p>
                  <p>
                    We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice. We will not be liable to you or to any third party for any modification, suspension or discontinuance of the service.
                  </p>
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
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-2xl">
                <Scale className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <Scale className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">4. Code of Conduct</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">4. Code of Conduct</h2>
                <div className="space-y-8 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    Users must maintain a high standard of conduct both on the platform and at our partner venues. Harassment, fraud, or any inappropriate behavior will result in immediate termination of your account and a permanent ban from the platform.
                  </p>
                  <blockquote className="relative p-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <p className="text-white/90 italic font-medium text-lg relative z-10 leading-relaxed">
                      "Our community relies on trust, respect, and exclusivity. Any violation of these principles is taken very seriously to protect the experience of our members and venues."
                    </p>
                  </blockquote>
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
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-2xl">
                <AlertTriangle className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">5. Ticketing & Refunds</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">5. Ticketing and Refunds</h2>
                <div className="space-y-6 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    All ticket sales and reservations made through Entry Club are subject to the specific venue's refund policy. Please review individual venue policies before completing a purchase.
                  </p>
                  <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="w-5 h-5 text-blue-400 mr-3" />
                      <strong className="text-white font-semibold text-sm tracking-widest uppercase">Important Notice</strong>
                    </div>
                    <p className="text-white/60">Entry Club acts solely as a technology provider and is not responsible for venue-specific decisions regarding entry, dress code enforcement, or refunds at the door.</p>
                  </div>
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
              <div className="absolute left-0 top-6 w-[72px] h-[72px] rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 hidden md:flex group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-2xl">
                <HelpCircle className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-8 md:hidden">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <HelpCircle className="w-7 h-7" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">6. Contact Information</h2>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-6 hidden md:block">6. Contact Information</h2>
                <div className="space-y-10 font-light text-[1.1rem] leading-relaxed text-white/70">
                  <p>
                    If you have any questions about these Terms, or if you need to reach out to us regarding any legal matters, our legal team is available to assist you.
                  </p>
                  <a href="mailto:legal@entryclub.com" className="group relative inline-flex items-center justify-center px-8 py-5 text-sm font-bold tracking-[0.2em] text-white uppercase overflow-hidden rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]">
                    <span className="relative z-10">Contact Legal Team</span>
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
