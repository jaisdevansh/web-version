'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black pt-16 pb-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[50px] bg-blue-500/10 blur-[50px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-[0.2em] text-white drop-shadow-md">
                ENTRY CLUB
              </span>
            </Link>
            <p className="text-white/60 font-light leading-relaxed max-w-sm">
              The premier ecosystem for exclusive nightlife venues, bringing enterprise-grade technology to host approvals, ticketing, and guest management.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold tracking-wider mb-6 text-sm uppercase">Explore</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">The Story</Link></li>
              <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="/venues" className="hover:text-blue-400 transition-colors">Venues</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold tracking-wider mb-6 text-sm uppercase">Support</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li className="flex items-center space-x-2 pt-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info.zenbourg@gmail.com" className="hover:text-white transition-colors">info.zenbourg@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} ENTRY CLUB INC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-6 text-xs text-white/40">
            <span>Built for the Elite</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
