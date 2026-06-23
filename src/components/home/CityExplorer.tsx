'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';

const CITIES_DATA = [
  { name: 'Mumbai', image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&h=400&auto=format&fit=crop", events: '240+ events' },
  { name: 'Delhi', image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&h=400&auto=format&fit=crop", events: '180+ events' },
  { name: 'Bengaluru', image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=600&h=400&auto=format&fit=crop", events: '150+ events' },
  { name: 'Pune', image: "https://images.unsplash.com/photo-1560053608-13721e0d69e8?q=80&w=600&h=400&auto=format&fit=crop", events: '90+ events' },
  { name: 'Hyderabad', image: "https://images.unsplash.com/photo-1741545979534-02f59c742730?q=80&w=600&h=400&auto=format&fit=crop", events: '120+ events' },
  { name: 'Goa', image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&h=400&auto=format&fit=crop", events: '60+ events' },
  { name: 'Kolkata', image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&h=400&auto=format&fit=crop", events: '80+ events' },
  { name: 'Chennai', image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&h=400&auto=format&fit=crop", events: '70+ events' },
  { name: 'Jaipur', image: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=600&h=400&auto=format&fit=crop", events: '50+ events' },
  { name: 'Ahmedabad', image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=600&h=400&auto=format&fit=crop", events: '40+ events' },
];

const CITIES = CITIES_DATA.map(c => c.name);

const CITY_IMAGES = CITIES_DATA.map(c => c.image);

export const CityExplorer = memo(function CityExplorer() {
  const { city, setCity } = useLocationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCities = useMemo(() => CITIES.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

  const handleSelectCity = useCallback((selected: string) => {
    setCity(selected);
    setSearchTerm('');
    setIsDropdownOpen(false);
    // Smooth scroll down to events grid
    window.scrollBy({ top: 500, behavior: 'smooth' });
  }, [setCity]);

  return (
    <section className="w-full bg-[#050505] py-24 relative overflow-hidden flex flex-col items-center justify-center">
      
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-center gap-3 md:gap-4 overflow-hidden" style={{ opacity: 0.4, maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)' }}>
        {/* Row 1 - Moving Left */}
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex gap-3 md:gap-4 min-w-max"
        >
          {[...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES].map((img, i) => (
            <div key={`r1-${i}`} className="w-[180px] h-[120px] md:w-[220px] md:h-[140px] rounded-2xl relative shrink-0 overflow-hidden">
              <Image src={img} alt="City Background" fill className="object-cover" />
            </div>
          ))}
        </motion.div>
        
        {/* Row 2 - Moving Right */}
        <motion.div 
          animate={{ x: [-2000, 0] }} 
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
          className="flex gap-3 md:gap-4 min-w-max"
        >
          {[...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES].reverse().map((img, i) => (
            <div key={`r2-${i}`} className="w-[200px] h-[130px] md:w-[260px] md:h-[160px] rounded-2xl relative shrink-0 overflow-hidden">
              <Image src={img} alt="City Background" fill className="object-cover" />
            </div>
          ))}
        </motion.div>

        {/* Row 3 - Moving Left */}
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="flex gap-3 md:gap-4 min-w-max"
        >
          {[...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES].map((img, i) => (
            <div key={`r3-${i}`} className="w-[190px] h-[125px] md:w-[240px] md:h-[150px] rounded-2xl relative shrink-0 overflow-hidden">
              <Image src={img} alt="City Background" fill className="object-cover" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
          Explore What's Happening In Your City
        </h2>

        <div className="relative max-w-xl mx-auto">
          <div className="flex items-center w-full bg-[#0a0a0a] border border-[#3B82F6]/40 rounded-full px-6 py-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all focus-within:shadow-[0_0_30px_rgba(59,130,246,0.3)] focus-within:border-[#3B82F6]">
            <input 
              type="text" 
              placeholder="Select city" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg"
            />
            <Search className="w-6 h-6 text-[#3B82F6]" />
          </div>

          {/* Custom Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#11111b] border border-[#2a2a3b] rounded-2xl overflow-hidden shadow-2xl z-50">
              <div className="max-h-60 overflow-y-auto">
                <button 
                  onClick={() => handleSelectCity('All Cities')}
                  className="w-full text-left px-6 py-3 text-white hover:bg-[#3B82F6]/20 transition-colors border-b border-[#2a2a3b]"
                >
                  All Cities
                </button>
                {filteredCities.map(c => (
                  <button 
                    key={c}
                    onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-6 py-3 text-white hover:bg-[#3B82F6]/20 transition-colors"
                  >
                    {c}
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <div className="px-6 py-4 text-gray-500 text-center">No cities found</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {city && city !== 'All Cities' && (
          <p className="text-[#3B82F6] mt-4 font-medium">Currently viewing events in: {city}</p>
        )}
      </div>

    </section>
  );
});
