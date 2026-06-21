'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VenuesPage() {
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/venues');
      return res.data?.data || [];
    },
    staleTime: 60000,
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Exclusive Venues</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Discover and book the most premium clubs, lounges, and event spaces.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#111111] border border-white/5 rounded-3xl p-4 h-[400px]">
                <Skeleton className="w-full h-48 rounded-2xl bg-white/5 mb-6" />
                <Skeleton className="w-3/4 h-8 bg-white/5 mb-3" />
                <Skeleton className="w-1/2 h-4 bg-white/5 mb-6" />
                <Skeleton className="w-full h-12 rounded-xl bg-white/5 mt-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Failed to load venues</h2>
            <p className="text-white/60 mb-8">Please try again later.</p>
            <Button className="bg-blue-600 text-white rounded-full px-8" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-20 bg-[#111111] rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-4">No Venues Found</h2>
            <p className="text-white/60">We are currently onboarding exclusive venues. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={venue._id || i} 
                className="bg-[#111111] border border-white/5 hover:border-white/20 transition-all rounded-3xl p-4 flex flex-col group shadow-xl"
              >
                <div className="w-full h-48 rounded-2xl overflow-hidden relative mb-6">
                  <img 
                    src={venue.coverImage || venue.images?.[0] || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop'} 
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1.5" />
                    <span className="text-xs font-bold text-white">{venue.rating || '4.8'}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{venue.name}</h3>
                
                <div className="flex items-center text-white/50 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {venue.locationData?.address || venue.city || 'Secret Location'}
                </div>
                
                <div className="flex items-center text-white/50 text-sm mb-6">
                  <Users className="w-4 h-4 mr-2" />
                  Capacity: {venue.capacity || 'TBA'}
                </div>

                <Link href={`/venues/${venue._id}`} className="mt-auto">
                  <Button className="w-full h-12 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-transparent rounded-xl transition-all font-semibold">
                    View Details
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
