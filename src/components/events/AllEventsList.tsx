'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Ticket, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useLocationStore } from '@/store/useLocationStore';
import { toast } from 'sonner';

export default function AllEventsList() {
    const { data: fetchedEvents, isLoading } = useQuery({
        queryKey: ['publicEvents'],
        queryFn: async () => {
            const res = await axiosInstance.get('/user/events?limit=20');
            return res.data?.data || [];
        }
    });

    const activeEvents = useMemo(() => {
        const eventsList = fetchedEvents || [];

        return eventsList.map((ev: any) => ({
            id: ev._id,
            title: ev.title,
            date: new Date(ev.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ', ' + ev.startTime,
            rawDate: ev.date,
            location: ev.venueName || 'Secret Location',
            price: ev.displayPrice !== null && ev.displayPrice !== undefined ? `₹${ev.displayPrice} onwards` : 'Free',
            image: ev.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
            images: ev.images?.length > 0 ? ev.images : [ev.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'],
            city: ev.city
        }));
    }, [fetchedEvents]);

    const FILTERS = useMemo(() => ['All', 'Today', 'Tomorrow', 'This Weekend', 'Under 10 km', 'Live Gigs', 'Music'], []);
    const [activeFilter, setActiveFilter] = useState('All');
    
    const { city: selectedCity, setCity: setSelectedCity, lat: userLat, lng: userLng, setLocation } = useLocationStore();
    const [isLocating, setIsLocating] = useState(false);

    const requestLocation = useCallback(() => {
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
            }, (error) => {
                console.error("Error getting location:", error);
                toast.error('Location Access Denied', {
                    description: 'Please enable location access in your browser settings to use distance filters.',
                    action: {
                        label: 'Retry',
                        onClick: () => requestLocation()
                    }
                });
                setIsLocating(false);
            });
        } else {
            toast.error('Geolocation is not supported by your browser.');
            setIsLocating(false);
        }
    }, [setLocation]);

    const allGridEvents = useMemo(() => {
        if (!activeEvents || activeEvents.length === 0) return [];
        let filtered = [...activeEvents];

        if (selectedCity !== 'All Cities') {
            filtered = filtered.filter((ev: any) => 
                ev.location.toLowerCase().includes(selectedCity.toLowerCase()) || 
                ev.city?.toLowerCase() === selectedCity.toLowerCase() ||
                (fetchedEvents?.find((f: any) => f._id === ev.id)?.city?.toLowerCase() === selectedCity.toLowerCase())
            );
        }

        if (activeFilter === 'All') return filtered;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (activeFilter === 'Today') {
            filtered = filtered.filter((ev: any) => {
                const rawEvent = fetchedEvents?.find((f: any) => f._id === ev.id) || { date: ev.rawDate }; 
                if (!rawEvent || !rawEvent.date) return false;
                const eventDate = new Date(rawEvent.date);
                eventDate.setHours(0,0,0,0);
                return eventDate.getTime() === today.getTime();
            });
        } else if (activeFilter === 'Tomorrow') {
            filtered = filtered.filter((ev: any) => {
                const rawEvent = fetchedEvents?.find((f: any) => f._id === ev.id) || { date: ev.rawDate };
                if (!rawEvent || !rawEvent.date) return false;
                const eventDate = new Date(rawEvent.date);
                eventDate.setHours(0,0,0,0);
                return eventDate.getTime() === tomorrow.getTime();
            });
        } else if (activeFilter === 'This Weekend') {
            filtered = filtered.filter((ev: any) => {
                const rawEvent = fetchedEvents?.find((f: any) => f._id === ev.id) || { date: ev.rawDate };
                if (!rawEvent || !rawEvent.date) return false;
                const eventDate = new Date(rawEvent.date);
                const day = eventDate.getDay();
                return day === 0 || day === 6;
            });
        } else if (activeFilter === 'Under 10 km') {
            // Under 10 km filtering logic
        } else if (activeFilter === 'Live Gigs' || activeFilter === 'Music') {
            filtered = filtered.filter((ev: any) => {
                const rawEvent = fetchedEvents?.find((f: any) => f._id === ev.id);
                const searchStr = `${ev.title} ${rawEvent?.category || ''} ${rawEvent?.description || ''}`.toLowerCase();
                return searchStr.includes('live') || searchStr.includes('gig') || searchStr.includes('music');
            });
        }

        return filtered;
    }, [activeEvents, selectedCity, activeFilter, fetchedEvents]);

    return (
        <div className="relative z-20 bg-[#080b12] py-10 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-20 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-section text-white mb-0">All events</h2>
                        <button 
                            onClick={requestLocation}
                            disabled={isLocating}
                            aria-label="Request Location"
                            className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 rounded-full px-3 py-2 sm:px-4 text-xs sm:text-sm transition-colors shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span suppressHydrationWarning className="hidden xs:inline">{isLocating ? "Locating..." : userLat ? "Location On" : "Location"}</span>
                            <span suppressHydrationWarning className="xs:hidden">{isLocating ? "..." : userLat ? "On" : null}</span>
                        </button>
                    </div>
                    <div className="relative flex items-center w-full sm:w-auto">
                        <svg className="w-3.5 h-3.5 text-white/70 absolute left-3.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <select 
                            value={activeFilter} 
                            aria-label="Filter events"
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2 text-white text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all duration-300 appearance-none"
                        >
                            {FILTERS.map((filter) => (
                                <option key={filter} value={filter} className="bg-[#080b12] text-white">
                                    Filter: {filter}
                                </option>
                            ))}
                        </select>
                        <svg className="w-3.5 h-3.5 text-white/70 absolute right-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                {/* City Chips */}
                <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-3 sm:pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {['All Cities', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai'].map((cityOption) => (
                        <button
                            key={cityOption}
                            onClick={() => setSelectedCity(cityOption)}
                            className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-2.5 rounded-full min-h-[44px] text-xs sm:text-sm font-semibold transition-all border flex items-center ${
                                selectedCity === cityOption 
                                ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                                : 'bg-white/5 text-white/80 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {cityOption === 'All Cities' && (
                                <MapPin className="w-4 h-4 mr-2 opacity-80" />
                            )}
                            {cityOption}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 gap-y-6 sm:gap-y-10 mt-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="group block">
                                <div className="relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 mb-2 sm:mb-4 animate-pulse"></div>
                                <div className="h-4 sm:h-5 bg-white/5 rounded-md w-3/4 mb-1 sm:mb-2 animate-pulse"></div>
                                <div className="h-3 sm:h-4 bg-white/5 rounded-md w-1/2 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                ) : allGridEvents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 gap-y-6 sm:gap-y-10 mt-2">
                        {allGridEvents.map((ev: any) => (
                            <Link href={`/events/${ev.id}`} key={ev.id} className="group block cursor-pointer">
                                <div className="relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-[#1a1f2e] mb-2 sm:mb-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-white/20 transition-all duration-300">
                                    <Image
                                        src={ev.image} 
                                        alt={ev.title} 
                                        fill
                                        loading="lazy"
                                        quality={60}
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <h3 className="text-xs sm:text-card-heading text-white group-hover:text-blue-400 transition-colors line-clamp-1 font-semibold">{ev.title}</h3>
                                <p suppressHydrationWarning className="text-white/60 text-[10px] sm:text-small mt-0.5 sm:mt-1">{ev.date}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                            <Ticket className="w-8 h-8 text-white/30" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Live Events Currently</h3>
                        <p className="text-white/60">Check back later for exciting upcoming events in your city!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
