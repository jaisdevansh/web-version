'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

import { MobileSidebar } from '@/components/shared/Sidebar';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        {/* Left: Logo */}
        <div className="flex items-center md:w-1/3 shrink-0">
          {mounted && pathname?.startsWith('/dashboard') && (
            <div className="mr-2 md:hidden">
              <MobileSidebar />
            </div>
          )}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-base md:text-xl tracking-tight text-blue-500 drop-shadow-md">
              ENTRY CLUB
            </span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex flex-1 justify-center md:w-1/3">
          <nav className="flex items-center space-x-12 text-sm uppercase tracking-widest font-semibold">
            <Link
              href="/features"
              className="relative text-blue-400 hover:text-white transition-colors duration-300 group"
            >
              Features
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="relative text-blue-400 hover:text-white transition-colors duration-300 group"
            >
              About
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="relative text-blue-400 hover:text-white transition-colors duration-300 group"
            >
              Contact
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center justify-end md:w-1/3 shrink-0">
          <nav className="flex items-center space-x-2 md:space-x-3">
            {!mounted ? null : isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full px-3 md:px-6 h-8 md:h-10 text-xs md:text-sm">Dashboard</Button>
                </Link>
                <Button onClick={logout} className="bg-red-600/90 hover:bg-red-500 text-white border border-red-500/30 rounded-full px-4 md:px-6 h-8 md:h-10 text-xs md:text-sm cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all">Log out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-full px-4 md:px-8 h-8 md:h-10 text-xs md:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                    Log In / Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
