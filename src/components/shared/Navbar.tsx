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
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
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
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 py-0' 
        : 'bg-transparent border-transparent py-2'
    }`}>
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        {/* Left: Logo */}
        <div className="flex items-center md:w-[30%] min-w-0">
          {mounted && pathname?.startsWith('/dashboard') ? (
            <div className="mr-2 md:hidden shrink-0">
              <MobileSidebar />
            </div>
          ) : mounted && (
            <div className="mr-2 md:hidden shrink-0">
              <MobilePublicMenu />
            </div>
          )}
          <Link href="/" className="flex items-center space-x-1 md:space-x-3 group pt-1 truncate">
            {/* Text Logo */}
            <span className="font-bold text-base sm:text-lg md:text-2xl tracking-widest md:tracking-[0.25em] flex items-center">
              <span className="text-white">ENTRY</span>
              <span className="text-blue-500 ml-1.5 md:ml-2">CLUB</span>
            </span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex flex-1 justify-center md:w-[40%]">
          <nav className={`flex items-center p-1 space-x-1 rounded-full transition-all duration-300 ${
            isScrolled ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-transparent border-transparent'
          }`}>
            {[
              { name: 'Home', href: '/' },
              { name: 'Events', href: '/events' },
              { name: 'About', href: '/about' }
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Explore Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDownloadOpen(true)}
              onMouseLeave={() => setIsDownloadOpen(false)}
            >
              {(() => {
                const dropdownItems = [
                  { name: 'Features', href: '/features' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Download', href: '/download' }
                ];
                const activeItem = dropdownItems.find(item => item.href === pathname);
                const label = activeItem ? activeItem.name : 'Explore';

                return (
                  <>
                    <button
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeItem ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border-transparent' : 'bg-transparent hover:bg-white/10 text-white border-transparent hover:border-white/10'} border`}
                    >
                      {label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDownloadOpen ? 'rotate-180' : 'opacity-70'}`} />
                    </button>
                    
                    {isDownloadOpen && (
                      <div className="absolute top-full left-0 pt-2 w-52 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2">
                          {dropdownItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-600/15 text-blue-400' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                onClick={() => setIsDownloadOpen(false)}
                              >
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </nav>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center justify-end md:w-[30%] shrink-0 gap-2 md:gap-4">
          {/* Location Selector */}
          {mounted && (
            <div className="relative hidden sm:block" ref={dropdownRef}>
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
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-full px-4 md:px-8 h-8 md:h-10 text-xs md:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap">
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
          {/* Logo */}
          <div className="px-6 mb-8">
            <span className="font-bold text-xl tracking-tight flex items-center">
              <span className="text-white">ENTRY</span>
              <span className="text-blue-500 ml-1">CLUB</span>
            </span>
          </div>

          {/* Main Nav */}
          <nav className="flex flex-col gap-1 px-4">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-4 mb-2">Menu</p>
            {[
              { href: '/', label: 'Home' },
              { href: '/events', label: 'Events' },
              { href: '/about', label: 'About' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                  pathname === link.href
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="h-px bg-white/5 mx-6 my-4" />

          {/* Mobile Location Selector */}
          <div className="px-4 mb-4">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-4 mb-2">Location</p>
            <MobileLocationSelector />
          </div>

          {/* Explore Section */}
          <nav className="flex flex-col gap-1 px-4">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-4 mb-2">Explore</p>
            {[
              { href: '/features', label: 'Features' },
              { href: '/contact', label: 'Contact' },
              { href: '/download', label: 'Download App' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                  pathname === link.href
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom Auth Button */}
          <div className="mt-auto px-6">
            <MobileAuthButtons onClose={() => setIsOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { isAuthenticated, logout } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" onClick={onClose}>
          <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
            Dashboard
          </button>
        </Link>
        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-600/20 transition-colors"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" onClick={onClose}>
      <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">
        Log In
      </button>
    </Link>
  );
}

function MobileLocationSelector() {
  const { city, setCity, setLocation } = useLocationStore();
  const [isLocating, setIsLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
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
          setIsOpen(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div className="px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="truncate max-w-[150px]">{city}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : 'opacity-50'}`} />
      </button>

      {isOpen && (
        <div className="mt-2 rounded-xl bg-[#18181b] border border-white/10 overflow-hidden shadow-lg animate-in fade-in duration-200">
          <button
            onClick={detectLocation}
            disabled={isLocating}
            className="w-full flex items-center px-4 py-3 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-pulse' : ''}`} />
            {isLocating ? 'Locating...' : 'Detect my location'}
          </button>
          <div className="h-px bg-white/10 mx-2" />
          <button
            onClick={() => { setCity('All Cities'); setIsOpen(false); }}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
          >
            <span>All Cities</span>
            {city === 'All Cities' && <Check className="w-4 h-4 text-blue-500" />}
          </button>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); setIsOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
            >
              <span>{c}</span>
              {city === c && <Check className="w-4 h-4 text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
