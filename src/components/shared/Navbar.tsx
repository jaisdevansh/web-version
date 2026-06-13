'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* Left: Logo */}
        <div className="flex items-center md:w-1/3">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-xl tracking-tight text-white drop-shadow-md hidden sm:inline-block">
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
          </nav>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-2 md:w-1/3">
          <nav className="flex items-center space-x-3">
            {!mounted ? null : isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full px-6">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={logout} className="border-none bg-red-600 text-white hover:bg-red-700 rounded-full px-6 cursor-pointer">Log out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5 rounded-full px-6">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 border-0 rounded-full px-8 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5">
                    Sign up
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
