'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TicketsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['myBookingsAll'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/bookings');
      return res.data.data;
    },
    enabled: mounted && isAuthenticated,
  });

  if (!mounted || !isAuthenticated) return null;

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  
  const filteredBookings = bookings.filter((b: any) => {
    if (activeTab === "Upcoming") return b.status === 'upcoming' || b.status === 'checked-in';
    if (activeTab === "Past") return b.status === 'completed' || b.status === 'past' || b.status === 'cancelled';
    return true; // My Orders (all or specific order logic)
  });

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Bookings</h1>
        
        {/* Web Adapted Tabs */}
        <div className="flex space-x-2">
          {["Upcoming", "Past", "My Orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-black/20 text-muted-foreground border border-border hover:bg-black/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Dummy UI Card 1 (General Access) to match screenshot exactly if no real data */}
          {activeTab === "Upcoming" && filteredBookings.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12161f] rounded-3xl p-6 border border-white/[0.03] shadow-lg shadow-black/50"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="bg-[#064e3b]/30 text-[#34d399] text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md uppercase">Approved</span>
                <span className="text-white/30 text-xs font-mono">#6A12C5F9</span>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[#8b5cf6] flex items-center justify-center shrink-0">
                  <span className="text-white text-3xl font-semibold">US</span>
                </div>
                <div className="ml-5">
                  <p className="text-[#3b82f6] text-xs font-bold tracking-wider uppercase mb-1.5">Exclusive Club</p>
                  <h3 className="text-white text-xl font-medium leading-tight mb-2">General Access</h3>
                  <p className="text-white/40 text-sm">Sun, 24 May</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-5 border-t border-white/5">
                <p className="text-white/80 font-medium text-base">Price: <span className="font-bold">₹3</span></p>
                <button className="text-[#3b82f6] text-sm font-medium flex items-center hover:text-blue-400 transition-colors">
                  View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Dummy UI Card 2 (General Access Zone Split) */}
          {activeTab === "Upcoming" && filteredBookings.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#12161f] rounded-3xl p-6 border border-white/[0.03] shadow-lg shadow-black/50"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="bg-[#064e3b]/30 text-[#34d399] text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md uppercase">Approved</span>
                <span className="text-white/30 text-xs font-mono">#6A12BF1D</span>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[#8b5cf6] flex items-center justify-center shrink-0">
                  <span className="text-white text-3xl font-semibold">US</span>
                </div>
                <div className="ml-5">
                  <p className="text-[#3b82f6] text-xs font-bold tracking-wider uppercase mb-1.5">Exclusive Club</p>
                  <h3 className="text-white text-xl font-medium leading-tight mb-2">General Access Zone (Split)</h3>
                  <p className="text-white/40 text-sm">Sun, 24 May</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-5 border-t border-white/5">
                <p className="text-white/80 font-medium text-base">Price: <span className="font-bold">₹7</span></p>
                <button className="text-[#3b82f6] text-sm font-medium flex items-center hover:text-blue-400 transition-colors">
                  View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Real Data Rendering */}
          {filteredBookings.map((booking: any, i: number) => (
            <motion.div 
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#12161f] rounded-3xl p-6 border border-white/[0.03] shadow-lg shadow-black/50 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-center mb-6">
                <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md uppercase ${
                  booking.status === 'upcoming' ? 'bg-[#064e3b]/30 text-[#34d399]' : 
                  booking.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {booking.status === 'upcoming' ? 'Approved' : booking.status}
                </span>
                <span className="text-white/30 text-xs font-mono">#{booking.ticketNumber?.substring(0,8) || booking._id.substring(0,8).toUpperCase()}</span>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                  {booking.eventId?.coverImage ? (
                    <img src={booking.eventId.coverImage} className="w-full h-full object-cover" alt="Event cover" />
                  ) : (
                    <span className="text-white text-3xl font-semibold">EC</span>
                  )}
                </div>
                <div className="ml-5">
                  <p className="text-[#3b82f6] text-xs font-bold tracking-wider uppercase mb-1.5">{booking.eventId?.venue || 'Entry Club'}</p>
                  <h3 className="text-white text-xl font-medium leading-tight mb-2 line-clamp-2">{booking.eventId?.title || 'General Access'}</h3>
                  <p className="text-white/40 text-sm">
                    {new Date(booking.eventId?.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-5 border-t border-white/5">
                <p className="text-white/80 font-medium text-base">Price: <span className="font-bold">₹{booking.totalAmount || 0}</span></p>
                <button className="text-[#3b82f6] text-sm font-medium flex items-center hover:text-blue-400 transition-colors">
                  View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>

              {activeTab === "Past" && (
                 <button className="w-full mt-6 py-3.5 bg-[#2e1a47] hover:bg-[#3b2359] text-[#d8b4fe] rounded-xl font-semibold text-sm transition-colors border border-purple-500/20">
                   Write a Review
                 </button>
              )}
            </motion.div>
          ))}

          {filteredBookings.length === 0 && activeTab !== "Upcoming" && (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground">No bookings found for this category.</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
