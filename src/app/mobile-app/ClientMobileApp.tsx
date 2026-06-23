'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, 
    Search, 
    SlidersHorizontal, 
    Home, 
    Ticket, 
    User,
    ChevronDown,
    ArrowRight,
    ChevronLeft,
    Eye,
    Star,
    Sparkles,
    Users,
    Music,
    Flame
} from "lucide-react";

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    // UI State
    const [activeTab, setActiveTab] = useState("Bookings"); // Keeping Bookings active for development ease, change to Home later if needed
    const [activeFilter, setActiveFilter] = useState("All");
    const [bookingTab, setBookingTab] = useState("Past"); // Set to Past to show the review button
    const [reviewingEvent, setReviewingEvent] = useState<any>(null); // State to hold the event being reviewed
    const [isAnon, setIsAnon] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login');
        }
    }, [mounted, isAuthenticated, router]);

    const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
        queryKey: ['myBookings'],
        queryFn: async () => {
            const res = await axiosInstance.get('/user/bookings');
            return res.data.data;
        },
        enabled: mounted && isAuthenticated,
    });

    if (!mounted || !isAuthenticated) return null;

    const bookings = Array.isArray(bookingsData) ? bookingsData : [];
    const upcomingBookings = bookings.filter((b: any) => b.status === 'upcoming' || b.status === 'checked-in');
    const pastBookings = bookings.filter((b: any) => b.status === 'completed' || b.status === 'past');

    const renderHomeTab = () => {
        const filters = ["All", "Delhi", "Mumbai", "Bengaluru", "Goa", "Pune"];
        
        return (
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col flex-1 h-full"
            >
                {/* Header */}
                <header className="px-5 pt-12 pb-4 flex items-center justify-between z-10 relative">
                    <div className="flex flex-col">
                        <div className="flex items-center text-blue-400 text-[10px] font-bold tracking-wider mb-1 uppercase">
                            Location <ChevronDown className="w-3 h-3 ml-1" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
                            Varanasi, IN
                        </h1>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative">
                            <Bell className="w-5 h-5 text-white/80" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f1523]" />
                        </button>
                        <button className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-blue-500 transition-colors">
                            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                                <img src="/slide2.png" className="w-full h-full object-cover" alt="Avatar" />
                            </div>
                        </button>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="px-5 mt-2 z-10 relative">
                    <div className="relative flex items-center w-full h-14 rounded-full bg-[#1a1f2b] border border-white/5 overflow-hidden shadow-inner">
                        <Search className="w-5 h-5 text-white/40 ml-5 absolute left-0" />
                        <input 
                            type="text" 
                            placeholder="Search by city, state or event..." 
                            className="w-full h-full bg-transparent pl-12 pr-14 text-[15px] text-white placeholder-white/40 focus:outline-none"
                        />
                        <button className="absolute right-2 w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">
                            <SlidersHorizontal className="w-4 h-4 text-white/60" />
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="mt-6 px-5 overflow-x-auto hide-scrollbar flex space-x-3 pb-2 z-10 relative">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] transition-all ${
                                activeFilter === filter 
                                ? 'bg-[#1e3a8a] text-white border border-[#2563eb]' 
                                : 'bg-[#1a1f2b] text-white/60 border border-transparent hover:bg-white/10'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Explore Events Section */}
                <div className="mt-8 px-5 flex-1 z-10 relative">
                    <h2 className="text-[22px] font-bold text-white mb-6 tracking-tight">Explore Events</h2>
                    
                    <div className="w-full h-48 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/[0.02] flex items-center justify-center">
                        <p className="text-white/20 text-sm font-medium">No events found nearby.</p>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderBookingsTab = () => {
        return (
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col flex-1 h-full"
            >
                <header className="px-5 pt-12 pb-4 z-10 relative">
                    <h1 className="text-[32px] font-bold tracking-tight text-white mb-6">
                        My Bookings
                    </h1>
                    
                    {/* Booking Tabs */}
                    <div className="flex space-x-2">
                        {["Upcoming", "Past", "My Orders"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setBookingTab(tab)}
                                className={`px-6 py-2.5 rounded-full text-[15px] transition-all font-medium ${
                                    bookingTab === tab 
                                    ? 'bg-[#3b82f6] text-white' 
                                    : 'bg-[#1a1f2b] text-white/50 border border-white/5 hover:bg-white/10'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="mt-4 px-5 flex-1 overflow-y-auto pb-32 z-10 relative space-y-4 hide-scrollbar">
                    
                    {/* Dummy Past Event Card matching screenshot */}
                    {bookingTab === "Past" && (
                        <div className="bg-[#12161f] rounded-3xl p-5 border border-white/[0.03]">
                            <div className="flex justify-between items-center mb-5">
                                <span className="bg-[#064e3b]/30 text-[#34d399] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">Approved</span>
                                <span className="text-white/30 text-xs font-mono">#6A17DF22</span>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img src="/flawless.png" className="w-full h-full object-cover" alt="Event Cover" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-[#3b82f6] text-xs font-semibold tracking-wider uppercase mb-1">Exclusive Club</p>
                                    <h3 className="text-white text-[20px] font-medium leading-tight mb-1">aujlaaa</h3>
                                    <p className="text-white/40 text-sm">Sat, 30 May</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-white/5 mb-4">
                                <p className="text-white/80 font-medium text-[15px]">Price: <span className="font-bold">₹25</span></p>
                                <button className="text-[#3b82f6] text-[14px] font-medium flex items-center">
                                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>

                            <button 
                                onClick={() => setReviewingEvent({ title: "aujlaaa", date: "Sat, 30 May", image: "/flawless.png" })}
                                className="w-full py-4 bg-[#2e1a47] hover:bg-[#3b2359] text-[#d8b4fe] rounded-2xl font-semibold text-[15px] transition-colors"
                            >
                                Write a Review
                            </button>
                        </div>
                    )}

                    {/* Dummy Upcoming Booking Cards */}
                    {bookingTab === "Upcoming" && (
                        <>
                            <div className="bg-[#12161f] rounded-3xl p-5 border border-white/[0.03]">
                                <div className="flex justify-between items-center mb-5">
                                    <span className="bg-[#064e3b]/30 text-[#34d399] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">Approved</span>
                                    <span className="text-white/30 text-xs font-mono">#6A12C5F9</span>
                                </div>
                                
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[#3B82F6] flex items-center justify-center shrink-0">
                                        <span className="text-white text-2xl font-semibold">US</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-[#3b82f6] text-xs font-semibold tracking-wider uppercase mb-1">Exclusive Club</p>
                                        <h3 className="text-white text-[20px] font-medium leading-tight mb-1">General Access</h3>
                                        <p className="text-white/40 text-sm">Sun, 24 May</p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <p className="text-white/80 font-medium text-[15px]">Price: <span className="font-bold">₹3</span></p>
                                    <button className="text-[#3b82f6] text-[14px] font-medium flex items-center">
                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actual Fetched Bookings */}
                    {bookingTab === "Upcoming" && upcomingBookings.length > 0 && upcomingBookings.map((booking: any) => (
                        <div key={booking._id} className="bg-[#12161f] rounded-3xl p-5 border border-white/[0.03]">
                            <div className="flex justify-between items-center mb-5">
                                <span className="bg-[#064e3b]/30 text-[#34d399] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">
                                    {booking.status}
                                </span>
                                <span className="text-white/30 text-xs font-mono">#{booking.ticketNumber?.substring(0,8) || booking._id.substring(0,8).toUpperCase()}</span>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 overflow-hidden">
                                    {booking.eventId?.coverImage ? (
                                        <img src={booking.eventId.coverImage} className="w-full h-full object-cover" alt="Event Cover" />
                                    ) : (
                                        <span className="text-white text-2xl font-semibold">EC</span>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <p className="text-[#3b82f6] text-xs font-semibold tracking-wider uppercase mb-1">{booking.eventId?.venue || 'Entry Club'}</p>
                                    <h3 className="text-white text-[20px] font-medium leading-tight mb-1">{booking.eventId?.title || 'General Access'}</h3>
                                    <p className="text-white/40 text-sm">
                                        {new Date(booking.eventId?.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <p className="text-white/80 font-medium text-[15px]">Price: <span className="font-bold">₹{booking.totalAmount || 0}</span></p>
                                <button className="text-[#3b82f6] text-[14px] font-medium flex items-center">
                                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {bookingTab === "Past" && pastBookings.length > 0 && pastBookings.map((booking: any) => (
                         <div key={booking._id} className="bg-[#12161f] rounded-3xl p-5 border border-white/[0.03]">
                            <div className="flex justify-between items-center mb-5">
                                <span className="bg-[#064e3b]/30 text-[#34d399] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">
                                    {booking.status}
                                </span>
                                <span className="text-white/30 text-xs font-mono">#{booking.ticketNumber?.substring(0,8) || booking._id.substring(0,8).toUpperCase()}</span>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 overflow-hidden">
                                    {booking.eventId?.coverImage ? (
                                        <img src={booking.eventId.coverImage} className="w-full h-full object-cover" alt="Event Cover" />
                                    ) : (
                                        <span className="text-white text-2xl font-semibold">EC</span>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <p className="text-[#3b82f6] text-xs font-semibold tracking-wider uppercase mb-1">{booking.eventId?.venue || 'Entry Club'}</p>
                                    <h3 className="text-white text-[20px] font-medium leading-tight mb-1">{booking.eventId?.title || 'General Access'}</h3>
                                    <p className="text-white/40 text-sm">
                                        {new Date(booking.eventId?.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-white/5 mb-4">
                                <p className="text-white/80 font-medium text-[15px]">Price: <span className="font-bold">₹{booking.totalAmount || 0}</span></p>
                                <button className="text-[#3b82f6] text-[14px] font-medium flex items-center">
                                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setReviewingEvent(booking.eventId)}
                                className="w-full py-4 bg-[#2e1a47] hover:bg-[#3b2359] text-[#d8b4fe] rounded-2xl font-semibold text-[15px] transition-colors"
                            >
                                Write a Review
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    };

    const renderReviewTab = () => {
        if (!reviewingEvent) return null;

        return (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="flex flex-col flex-1 h-full bg-[#03060c] z-50 absolute inset-0"
            >
                {/* Header */}
                <header className="px-5 pt-12 pb-4 flex items-center justify-between z-10 relative">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setReviewingEvent(null)}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <h1 className="text-[20px] font-bold text-white tracking-wide">
                            Write a Review
                        </h1>
                    </div>
                    
                    <button 
                        onClick={() => setIsAnon(!isAnon)}
                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isAnon ? 'bg-white/10 text-white/80' : 'bg-blue-600/20 text-blue-400'
                        }`}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Anon
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-5 pb-32 hide-scrollbar">
                    {/* Event Banner */}
                    <div className="bg-gradient-to-br from-[#2e1a47] to-[#1a102b] rounded-3xl p-5 mb-8 flex items-center">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                            <img src={reviewingEvent.image || "/flawless.png"} className="w-full h-full object-cover" alt="Event Review" />
                        </div>
                        <div className="ml-5">
                            <h2 className="text-white font-bold text-xl mb-1">{reviewingEvent.title || 'aujlaaa'}</h2>
                            <p className="text-white/60 text-[15px] leading-tight">How was your elite experience? ✨</p>
                        </div>
                    </div>

                    {/* Overall Rating */}
                    <div className="mb-10">
                        <h3 className="text-white/40 text-xs font-bold tracking-[0.2em] mb-4 uppercase">Overall Rating</h3>
                        <div className="flex justify-between px-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-10 h-10 text-white/20 hover:text-yellow-400 transition-colors cursor-pointer" />
                            ))}
                        </div>
                        <p className="text-center text-white/30 text-xs font-bold tracking-widest uppercase">Tap to rate</p>
                    </div>

                    {/* Rate The Details */}
                    <div className="mb-10">
                        <h3 className="text-white/40 text-xs font-bold tracking-[0.2em] mb-4 uppercase">Rate the Details</h3>
                        <div className="bg-[#12161f] border border-white/[0.03] rounded-3xl p-6 space-y-6">
                            
                            {/* Vibe */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center text-white font-medium text-lg">
                                        <Sparkles className="w-5 h-5 mr-3 text-white/80" /> Vibe
                                    </div>
                                    <span className="text-white/20">-</span>
                                </div>
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map((circle) => (
                                        <div key={circle} className="w-10 h-10 rounded-full border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors" />
                                    ))}
                                </div>
                            </div>

                            <div className="h-px w-full bg-white/5" />

                            {/* Service */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center text-white font-medium text-lg">
                                        <Users className="w-5 h-5 mr-3 text-white/80" /> Service
                                    </div>
                                    <span className="text-white/20">-</span>
                                </div>
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map((circle) => (
                                        <div key={circle} className="w-10 h-10 rounded-full border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors" />
                                    ))}
                                </div>
                            </div>

                            <div className="h-px w-full bg-white/5" />

                            {/* Music */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center text-white font-medium text-lg">
                                        <Music className="w-5 h-5 mr-3 text-white/80" /> Music
                                    </div>
                                    <span className="text-white/20">-</span>
                                </div>
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map((circle) => (
                                        <div key={circle} className="w-10 h-10 rounded-full border-2 border-white/10 cursor-pointer hover:bg-white/5 transition-colors" />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* What Stood Out */}
                    <div>
                        <h3 className="text-white/40 text-xs font-bold tracking-[0.2em] mb-4 uppercase">What Stood Out?</h3>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center px-4 py-3 bg-[#12161f] border border-white/5 hover:bg-white/5 rounded-2xl text-white/80 text-[15px] font-medium transition-colors">
                                <Flame className="w-4 h-4 mr-2 text-orange-500" /> Fire Night
                            </button>
                            <button className="flex items-center px-4 py-3 bg-[#12161f] border border-white/5 hover:bg-white/5 rounded-2xl text-white/80 text-[15px] font-medium transition-colors">
                                <Music className="w-4 h-4 mr-2 text-blue-400" /> Banging Music
                            </button>
                            <button className="flex items-center px-4 py-3 bg-[#12161f] border border-white/5 hover:bg-white/5 rounded-2xl text-white/80 text-[15px] font-medium transition-colors">
                                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" /> Great Crowd
                            </button>
                        </div>
                    </div>

                    <button 
                        className="w-full mt-10 py-5 bg-[#3b82f6] text-white rounded-2xl font-bold text-[16px] shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-colors"
                        onClick={() => setReviewingEvent(null)}
                    >
                        Submit Review
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#03060c] min-h-screen relative shadow-2xl shadow-blue-900/5 flex flex-col overflow-hidden text-white font-sans selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1e3a8a]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/4 left-0 w-[200px] h-[200px] bg-[#4c1d95]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                    {!reviewingEvent && activeTab === "Home" && <div key="home" className="h-full">{renderHomeTab()}</div>}
                    {!reviewingEvent && activeTab === "Bookings" && <div key="bookings" className="h-full">{renderBookingsTab()}</div>}
                    {!reviewingEvent && activeTab === "Profile" && (
                        <div key="profile" className="flex items-center justify-center h-full text-white/50">
                            Profile Coming Soon
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Review Tab overlay */}
            <AnimatePresence>
                {reviewingEvent && renderReviewTab()}
            </AnimatePresence>

            {/* Bottom Navigation */}
            {!reviewingEvent && (
                <nav className="absolute bottom-0 left-0 right-0 h-[85px] bg-[#03060c]/90 backdrop-blur-2xl border-t border-white/5 px-4 flex justify-between items-start pt-3 z-20">
                    {[
                        { id: "Home", icon: Home, label: "Home" },
                        { id: "Bookings", icon: Ticket, label: "My Bookings" },
                        { id: "Profile", icon: User, label: "Profile" }
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center justify-center w-[72px] transition-all duration-300 ${isActive ? 'text-[#3b82f6]' : 'text-white/40 hover:text-white/70'}`}
                            >
                                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[#3b82f6]/10' : ''} transition-colors duration-300`}>
                                    <item.icon 
                                        className={`w-[22px] h-[22px] ${isActive ? 'fill-[#3b82f6]/20' : ''}`} 
                                        strokeWidth={isActive ? 2.5 : 2} 
                                    />
                                </div>
                                <span className={`text-[10px] mt-1 transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            )}
            
            {/* Global style to hide scrollbar for horizontal and vertical lists in the app view */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
