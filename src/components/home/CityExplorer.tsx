'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, MapPin } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';

const CITIES_DATA = [
  { name: 'Mumbai', image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600&h=400&auto=format&fit=crop", events: '240+ events' },
  { name: 'Delhi', image: "https://images.unsplash.com/photo-1587474260580-50b38c2306d8?q=80&w=600&h=400&auto=format&fit=crop", events: '180+ events' },
  { name: 'Bengaluru', image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=600&h=400&auto=format&fit=crop", events: '150+ events' },
  { name: 'Pune', image: "https://images.unsplash.com/photo-1560053608-13721e0d69e8?q=80&w=600&h=400&auto=format&fit=crop", events: '90+ events' },
  { name: 'Hyderabad', image: "https://images.unsplash.com/photo-1534995606-4d72a54dae50?q=80&w=600&h=400&auto=format&fit=crop", events: '120+ events' },
  { name: 'Goa', image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&h=400&auto=format&fit=crop", events: '60+ events' },
  { name: 'Kolkata', image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&h=400&auto=format&fit=crop", events: '80+ events' },
  { name: 'Chennai', image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&h=400&auto=format&fit=crop", events: '70+ events' },
  { name: 'Jaipur', image: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=600&h=400&auto=format&fit=crop", events: '50+ events' },
  { name: 'Ahmedabad', image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=600&h=400&auto=format&fit=crop", events: '40+ events' },
];

const CITIES = CITIES_DATA.map(c => c.name);

const CITY_IMAGES = CITIES_DATA.map(c => c.image);

export function CityExplorer() {
  const { city, setCity } = useLocationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectCity = (selected: string) => {
    setCity(selected);
    setSearchTerm('');
    setIsDropdownOpen(false);
    // Smooth scroll down to events grid
    window.scrollBy({ top: 500, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#050505] py-24 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* BACKGROUND SCROLLING STAMPS */}
      <style dangerouslySetInnerHTML={{__html: `
        .stamp-cutout-small {
          mask: 
            linear-gradient(#000 0 0), 
            radial-gradient(circle at 0 8px, #000 4px, transparent 4.5px), 
            radial-gradient(circle at 100% 8px, #000 4px, transparent 4.5px), 
            radial-gradient(circle at 8px 0, #000 4px, transparent 4.5px), 
            radial-gradient(circle at 8px 100%, #000 4px, transparent 4.5px);
          mask-size: 100% 100%, 8px 24px, 8px 24px, 24px 8px, 24px 8px;
          mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
          mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
          mask-composite: subtract;
          -webkit-mask: 
            linear-gradient(#000 0 0), 
            radial-gradient(circle at 0 8px, #000 4px, transparent 4.5px), 
            radial-gradient(circle at 100% 8px, #000 4px, transparent 4.5px), 
            radial-gradient(circle at 8px 0, #000 4px, transparent 4.5px), 
            radial-gradient(circle at 8px 100%, #000 4px, transparent 4.5px);
          -webkit-mask-size: 100% 100%, 8px 24px, 8px 24px, 24px 8px, 24px 8px;
          -webkit-mask-position: 0 0, 0 0, 100% 0, 0 0, 0 100%;
          -webkit-mask-repeat: no-repeat, repeat-y, repeat-y, repeat-x, repeat-x;
          -webkit-mask-composite: destination-out;
        }
      `}} />

      <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none flex flex-col justify-start gap-4 pt-4">
        {/* Row 1 - Left */}
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-4 min-w-max"
        >
          {[...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES].map((img, i) => (
            <div key={`r1-${i}`} className="stamp-cutout-small w-[120px] h-[120px] bg-gray-800 relative shrink-0">
              <Image src={img} alt="City" fill className="object-cover grayscale" />
            </div>
          ))}
        </motion.div>
        {/* Row 2 - Right */}
        <motion.div 
          animate={{ x: [-1000, 0] }} 
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-4 min-w-max"
        >
          {[...CITY_IMAGES, ...CITY_IMAGES, ...CITY_IMAGES].map((img, i) => (
            <div key={`r2-${i}`} className="stamp-cutout-small w-[120px] h-[120px] bg-gray-800 relative shrink-0">
              <Image src={img} alt="City" fill className="object-cover grayscale" />
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
          <div className="flex items-center w-full bg-[#0a0a0a] border border-[#8B5CF6]/40 rounded-full px-6 py-4 shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all focus-within:shadow-[0_0_30px_rgba(139,92,246,0.3)] focus-within:border-[#8B5CF6]">
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
            <Search className="w-6 h-6 text-[#8B5CF6]" />
          </div>

          {/* Custom Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#11111b] border border-[#2a2a3b] rounded-2xl overflow-hidden shadow-2xl z-50">
              <div className="max-h-60 overflow-y-auto">
                <button 
                  onClick={() => handleSelectCity('All Cities')}
                  className="w-full text-left px-6 py-3 text-white hover:bg-[#8B5CF6]/20 transition-colors border-b border-[#2a2a3b]"
                >
                  All Cities
                </button>
                {filteredCities.map(c => (
                  <button 
                    key={c}
                    onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-6 py-3 text-white hover:bg-[#8B5CF6]/20 transition-colors"
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
          <p className="text-[#8B5CF6] mt-4 font-medium">Currently viewing events in: {city}</p>
        )}
      </div>

      {/* CITY CARDS GRID */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CITIES_DATA.map((cityData, idx) => (
            <motion.button
              key={cityData.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleSelectCity(cityData.name)}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer border transition-all duration-300 ${
                city === cityData.name 
                  ? 'border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.5)]' 
                  : 'border-white/10 hover:border-[#8B5CF6]/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
              }`}
            >
              <Image
                src={cityData.image}
                alt={cityData.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Active ring */}
              {city === cityData.name && (
                <div className="absolute inset-0 ring-2 ring-[#8B5CF6] rounded-2xl" />
              )}
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight">{cityData.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#8B5CF6]" />
                  <p className="text-gray-300 text-xs">{cityData.events}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

    </section>
  );
}
