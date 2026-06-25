'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, ArrowRight } from 'lucide-react';
import { ReactLenis } from 'lenis/react';

import Link from 'next/link';

export default function ContactPage() {
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <main className="min-h-screen bg-[#000000] text-white pt-32 pb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left side: Info */}
            <div className="flex flex-col justify-center">
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
              >
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">touch</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="text-lg md:text-xl text-white/50 mb-10 max-w-md leading-relaxed"
              >
                Our team would love to hear from you. We're always looking for ways to improve Entry Club.
              </motion.p>

              <div className="space-y-10">

                {/* AI Support Chat Block */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">AI Support Chat</h3>
                  <p className="text-white/50 mb-6 max-w-md leading-relaxed">
                    Experience the future of support. Get instant, intelligent answers tailored to your Entry Club experience.
                  </p>
                  <Link href="/settings/ai-chat" className="text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-2 group w-fit">
                    Start a conversation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Direct Email Block */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Direct Email</h3>
                  <p className="text-white/50 mb-6 max-w-md leading-relaxed">
                    Prefer the classic way? Drop us an email and our human support team will respond within 24 hours.
                  </p>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info.zenbourg@gmail.com&su=Support%20Query%20-%20Entry%20Club&body=Hi%20Entry%20Club%20Team,%0A%0A[Please%20write%20your%20query%20here...]%0A%0AThanks!" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 group w-fit">
                    Send an email
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Right side: Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 1, delay: 0.2, ease }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden h-fit"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              
              <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    placeholder="First Name *"
                    className="bg-transparent border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white placeholder:text-white text-base"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name *"
                    className="bg-transparent border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white placeholder:text-white text-base"
                  />
                </div>

                <input 
                  type="email" 
                  placeholder="Email *"
                  className="bg-transparent border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white placeholder:text-white text-base"
                />

                <textarea 
                  rows={5}
                  placeholder="Message *"
                  className="bg-transparent border border-white/20 rounded-[32px] px-6 py-5 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white placeholder:text-white text-base resize-none"
                />

                <button 
                  type="submit"
                  className="mt-4 bg-white text-black hover:bg-gray-200 font-bold rounded-full py-4 transition-colors flex items-center justify-center gap-2 group"
                >
                  Send message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </main>
    </ReactLenis>
  );
}
