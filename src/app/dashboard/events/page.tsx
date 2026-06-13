'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Search, SlidersHorizontal, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface EventData {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  coverImage: string;
  displayPrice: number | null;
  occupancy: string;
  venueName?: string;
}

const fetchEvents = async (page: number = 1) => {
  const response = await axiosInstance.get(`/user/events?page=${page}&limit=20`);
  return response.data;
};

const CITIES = ['All', 'Delhi', 'Mumbai', 'Bengaluru'];

export default function EventsPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [activeCity, setActiveCity] = useState('All');

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', page],
    queryFn: () => fetchEvents(page),
  });

  const events: EventData[] = data?.data || [];

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="container mx-auto px-4 py-8 md:px-8 max-w-7xl">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#3b82f6] text-xs font-bold tracking-widest uppercase flex items-center mb-1">
              Location <ChevronDown className="w-3 h-3 ml-1" />
            </p>
            <h1 className="text-[28px] font-serif font-bold tracking-wide">Varanasi, IN</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-[#12161f] border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white/80" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Felix'}`} 
                alt="Profile" 
                className="w-full h-full object-cover bg-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search by city, state or event..."
            className="w-full bg-[#12161f] border border-white/5 rounded-full py-4 pl-12 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner"
          />
          <button className="absolute inset-y-0 right-4 flex items-center">
            <SlidersHorizontal className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex space-x-3 overflow-x-auto pb-4 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCity === city
                  ? 'bg-blue-600/20 text-white border border-blue-500'
                  : 'bg-[#12161f] text-white/60 border border-white/5 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-6">Explore Events</h2>
          
          {/* Featured Slides */}
          <div className="mb-10 flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[ '/slide2.png', '/slide3.png' ].map((src, idx) => (
              <div key={idx} className="shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] xl:w-[35vw] aspect-[2/1] snap-center rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#12161f]">
                <img src={src} alt={`Featured Slide ${idx + 2}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540039155732-d674d6e3f0be?q=80&w=1000&auto=format&fit=crop' }} />
              </div>
            ))}
          </div>

          {/* Events Grid */}
          {error ? (
            <div className="flex h-[30vh] flex-col items-center justify-center space-y-4 bg-[#12161f] rounded-3xl border border-white/5">
              <p className="text-red-400">Failed to load events.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-white hover:bg-white/10">Try Again</Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#12161f] rounded-3xl overflow-hidden border border-white/5 h-[340px] flex flex-col">
                  <Skeleton className="h-48 w-full bg-white/5" />
                  <div className="p-5 flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                    <Skeleton className="h-4 w-full bg-white/5 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex h-[30vh] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#12161f]/50">
              <p className="text-white/40">No events found in {activeCity === 'All' ? 'any city' : activeCity}. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="flex h-full flex-col overflow-hidden transition-all bg-[#12161f] border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] rounded-3xl group">
                    <div className="relative h-48 w-full overflow-hidden bg-[#1a1f2e]">
                      {event.coverImage ? (
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-white/20 font-bold uppercase tracking-widest text-sm">No Image</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute right-3 top-3 rounded-full bg-black/60 border border-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md uppercase">
                        {event.occupancy} Full
                      </div>
                    </div>
                    
                    <CardHeader className="p-5 pb-2">
                      <CardTitle className="line-clamp-1 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{event.title}</CardTitle>
                      {event.venueName && (
                        <CardDescription className="flex items-center text-xs mt-1.5 text-white/50 font-medium">
                          <MapPin className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                          {event.venueName}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-5 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-white/70 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                          {new Date(event.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                          {' • '}
                          {event.startTime}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-5 pt-0 mt-auto">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          {event.displayPrice !== null ? (
                            <p className="text-white/40 text-xs font-medium mb-0.5">Starting from</p>
                          ) : null}
                          <p className="text-lg font-bold text-white">
                            {event.displayPrice !== null ? `₹${event.displayPrice}` : 'Free'}
                          </p>
                        </div>
                        <Link href={`/dashboard/events/${event._id}`}>
                          <Button className="bg-white/10 hover:bg-blue-600 text-white rounded-xl font-bold border border-white/5 hover:border-transparent transition-all shadow-none">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
