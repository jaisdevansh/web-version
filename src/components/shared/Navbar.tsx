'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocationStore } from '@/store/useLocationStore';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, MapPin, ChevronDown, Navigation, Check } from 'lucide-react';

import { MobileSidebar } from '@/components/shared/Sidebar';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai'];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const { city, setCity, setLocation } = useLocationStore();
  const [isLocating, setIsLocating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                let detectedCity = 'Unknown Location';
                if (data && data.address) {
                    detectedCity = data.address.city || data.address.town || data.address.state_district || 'Unknown Location';
                }
                setLocation(latitude, longitude, detectedCity);
            } catch (err) {
                console.error(err);
                setLocation(latitude, longitude, 'Location Found');
            }
            setIsLocating(false);
            setIsDropdownOpen(false);
        }, (error) => {
            console.error("Error getting location:", error);
            setIsLocating(false);
        });
    } else {
        setIsLocating(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        {/* Left: Logo */}
        <div className="flex items-center md:w-[30%] shrink-0">
          {mounted && pathname?.startsWith('/dashboard') ? (
            <div className="mr-2 md:hidden">
              <MobileSidebar />
            </div>
          ) : mounted && (
            <div className="mr-2 md:hidden">
              <MobilePublicMenu />
            </div>
          )}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-bold text-base md:text-xl tracking-tight text-blue-500 drop-shadow-md">
              ENTRY CLUB
            </span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex flex-1 justify-center md:w-[40%]">
          <nav className="flex items-center space-x-10 lg:space-x-12 text-sm uppercase tracking-widest font-semibold">
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
            <Link
              href="/business"
              className="relative text-blue-400 hover:text-white transition-colors duration-300 group"
            >
              Business
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center justify-end md:w-[30%] shrink-0 gap-2 md:gap-4">
          {/* Location Selector */}
          {mounted && (
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white hover:bg-white/10 flex items-center gap-2 rounded-full px-3 md:px-4 h-8 md:h-10 text-xs md:text-sm"
              >
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                <span className="max-w-[80px] md:max-w-[120px] truncate">{city}</span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-50" />
              </Button>

              {/* Location Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                  >
                    <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-pulse' : ''}`} />
                    {isLocating ? 'Locating...' : 'Detect my location'}
                  </button>
                  <div className="h-px bg-white/10 my-1 mx-2" />
                  <button 
                    onClick={() => { setCity('All Cities'); setIsDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    <span>All Cities</span>
                    {city === 'All Cities' && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                  {CITIES.map(c => (
                    <button 
                      key={c}
                      onClick={() => { setCity(c); setIsDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      <span>{c}</span>
                      {city === c && <Check className="w-4 h-4 text-blue-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
                    Log In
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

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

function MobilePublicMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] p-0 bg-[#0A0A0A] border-r border-white/10">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full py-6">
          <div className="px-6 mb-8">
            <span className="font-bold text-xl tracking-tight text-blue-500 drop-shadow-md">
              ENTRY CLUB
            </span>
          </div>
          <nav className="flex flex-col gap-2 px-4">
            {[
              { href: '/features', label: 'Features' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
              { href: '/business', label: 'Business' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-semibold uppercase tracking-widest text-sm ${
                  pathname === link.href 
                  ? 'bg-blue-600/10 text-blue-500' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
