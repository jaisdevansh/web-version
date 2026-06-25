'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const BottomSections = dynamic(() => import('@/components/home/BottomSections').then(mod => mod.BottomSections), { ssr: true });
import { Ticket, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useLocationStore } from '@/store/useLocationStore';

// Mock data removed in favor of live API

// --- Hero Carousel Component (Isolated to prevent full-page re-renders) ---
const HeroCarousel = memo(({ heroEvents }: { heroEvents: any[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [innerImageIndex, setInnerImageIndex] = useState(0);

    const safeIndex = currentIndex < heroEvents.length ? currentIndex : 0;
    const event = heroEvents[safeIndex];
    const eventImages = useMemo(() => event?.images || [event?.image], [event?.images, event?.image]);
    const safeInnerImageIndex = innerImageIndex < eventImages.length ? innerImageIndex : 0;

    useEffect(() => {
        setInnerImageIndex(0);
    }, [currentIndex]);

    useEffect(() => {
        if (!heroEvents.length) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroEvents.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroEvents.length]);

    useEffect(() => {
        if (!eventImages || eventImages.length <= 1) return;
        const interval = setInterval(() => {
            setInnerImageIndex((prev) => (prev + 1) % eventImages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [currentIndex, eventImages]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % heroEvents.length);
        setInnerImageIndex(0);
    }, [heroEvents.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + heroEvents.length) % heroEvents.length);
        setInnerImageIndex(0);
    }, [heroEvents.length]);

    if (!event) return null;

    return (
        <div className="w-full flex flex-col overflow-x-hidden">
            <div className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
                {/* Blurred Background Image Carousel - Optimized Blur */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence>
                        <motion.div
                            key={`${currentIndex}-${safeInnerImageIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 h-full w-full"
                        >
                            <Image
                                src={eventImages[safeInnerImageIndex]}
                                alt="Background"
                                fill
                                priority
                                quality={50}
                                sizes="100vw"
                                className="object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                    {/* Performance Fix: Removed backdrop-blur-3xl which crushes GPU when covering the whole screen */}
                    <div className="absolute inset-0 bg-black/85 z-10" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 lg:px-20 flex-1 flex items-center justify-center pt-28 pb-12 md:pt-32">
                    <div className="flex flex-col lg:flex-row items-center w-full gap-10 lg:gap-24">
                        
                        {/* Left: Poster */}
                        <div className="w-full lg:w-[60%] flex justify-center lg:justify-end">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, scale: 0.95, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[750px] aspect-[16/9] md:aspect-[3/2] lg:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl relative bg-[#111] flex items-center justify-center cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
                                >
                                    <Link href={`/events/${event.id}`} className="absolute inset-0 z-20">
                                        <span className="sr-only">View event details</span>
                                    </Link>
                                    <AnimatePresence>
                                        <motion.div
                                            key={safeInnerImageIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 w-full h-full"
                                        >
                                            <Image
                                                src={eventImages[safeInnerImageIndex]}
                                                alt={event.title}
                                                fill
                                                priority
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Image dots for multiple images */}
                                    {eventImages.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 px-3 py-2 rounded-full backdrop-blur-md">
                                            {eventImages.map((_: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        idx === safeInnerImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right: Details */}
                        <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-6 text-gray-100"
                                >
                                    <div suppressHydrationWarning className="font-semibold text-gray-300 tracking-wide">
                                        {event.date}
                                    </div>
                                    <h1 className="text-hero leading-[1.1] text-white">
                                        {event.title}
                                    </h1>
                                    <div className="text-lg lg:text-xl font-medium text-gray-300">
                                        {event.location}
                                    </div>
                                    <div className="text-xl font-bold">
                                        {event.price}
                                    </div>
                                    
                                    <div className="pt-6">
                                        <Link href={`/events/${event.id}`}>
                                            <Button className="h-14 px-10 text-button bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                                                Book tickets
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-20">
                        {heroEvents.map((_: any, idx: number) => (
                            <button
                                key={idx}
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => setCurrentIndex(idx)}
                                className={`p-3 sm:p-4 transition-all duration-300 flex items-center justify-center`}
                            >
                                <div className={`h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Left/Right Navigation Arrows - Positioned relative to viewport to prevent image overlapping */}
                <button 
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all z-30 text-white hidden sm:flex shadow-sm"
                >
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <button 
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all z-30 text-white hidden sm:flex shadow-sm"
                >
                    <ChevronRight className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
});
HeroCarousel.displayName = 'HeroCarousel';

// --- Main Page Component ---
export default function WelcomeScreen() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: fetchedEvents, isLoading } = useQuery({
        queryKey: ['publicEvents'],
        queryFn: async () => {
            const res = await axiosInstance.get('/user/events?limit=20');
            return res.data?.data || [];
        },
        enabled: typeof window !== 'undefined',
    });

    const activeEvents = useMemo(() => {
        const eventsList = (fetchedEvents && fetchedEvents.length > 0) ? fetchedEvents : [
            {
                _id: "demo-1",
                title: "Neon Nights: Cyberpunk Rave",
                date: new Date(new Date().setDate(new Date().getDate() + 2)),
                startTime: "22:00",
                venueName: "Mumbai Secret Warehouse, Andheri",
                displayPrice: 1500,
                coverImage: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2958&auto=format&fit=crop",
                images: ["https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop"],
                city: "Mumbai"
            },
            {
                _id: "demo-2",
                title: "Sundance Open Air Festival",
                date: new Date(new Date().setDate(new Date().getDate() + 5)),
                startTime: "16:00",
                venueName: "Delhi Golf Club Grounds",
                displayPrice: 999,
                coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop",
                images: [],
                city: "Delhi"
            },
            {
                _id: "demo-3",
                title: "Velvet Lounge: Jazz & Wine",
                date: new Date(new Date().setDate(new Date().getDate() + 1)),
                startTime: "19:00",
                venueName: "The Ritz-Carlton",
                displayPrice: 2500,
                coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2832&auto=format&fit=crop",
                images: [],
                city: "Bengaluru"
            },
            {
                _id: "demo-4",
                title: "Tech-House Boiler Room",
                date: new Date(new Date().setDate(new Date().getDate() + 14)),
                startTime: "23:00",
                venueName: "Koregaon Park Industrial Area",
                displayPrice: 500,
                coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2832&auto=format&fit=crop",
                images: [],
                city: "Pune"
            },
            {
                _id: "demo-5",
                title: "Rooftop Sundowner: Tropical Vibes",
                date: new Date(new Date().setDate(new Date().getDate() + 7)),
                startTime: "17:00",
                venueName: "Banjara Hills Rooftop",
                displayPrice: 1200,
                coverImage: "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2960&auto=format&fit=crop",
                images: [],
                city: "Hyderabad"
            }
        ];

        return eventsList.map((ev: any) => ({
            id: ev._id,
            title: ev.title,
            date: new Date(ev.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ', ' + ev.startTime,
            rawDate: ev.date, // Preserve raw date for filtering
            location: ev.venueName || 'Secret Location',
            price: ev.displayPrice !== null && ev.displayPrice !== undefined ? `₹${ev.displayPrice} onwards` : 'Free',
            image: ev.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
            images: ev.images?.length > 0 ? ev.images : [ev.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'],
            city: ev.city // Pass down city for filtering
        }));
    }, [fetchedEvents]);

    const heroEvents = useMemo(() => activeEvents.slice(0, 5), [activeEvents]);
    const FILTERS = useMemo(() => ['All', 'Today', 'Tomorrow', 'This Weekend', 'Under 10 km', 'Live Gigs', 'Music'], []);
    const [activeFilter, setActiveFilter] = useState('All');
    
    // Use the global location store
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
                alert("Please enable location access to use distance filters.");
                setIsLocating(false);
            });
        } else {
            alert("Geolocation is not supported by your browser.");
            setIsLocating(false);
        }
    }, [setLocation]);

    const allGridEvents = useMemo(() => {
        if (!activeEvents || activeEvents.length === 0) return [];
        let filtered = [...activeEvents];

        // City filter
        if (selectedCity !== 'All Cities') {
            filtered = filtered.filter((ev: any) => 
                ev.location.toLowerCase().includes(selectedCity.toLowerCase()) || 
                ev.city?.toLowerCase() === selectedCity.toLowerCase() ||
                (fetchedEvents?.find((f: any) => f._id === ev.id)?.city?.toLowerCase() === selectedCity.toLowerCase())
            );
        }

        // Active Filter
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
                return day === 0 || day === 6; // Sunday or Saturday
            });
        } else if (activeFilter === 'Under 10 km') {
            if (!userLat || !userLng) {
                // Return empty if no location
            }
        } else if (activeFilter === 'Live Gigs' || activeFilter === 'Music') {
            filtered = filtered.filter((ev: any) => {
                const rawEvent = fetchedEvents?.find((f: any) => f._id === ev.id);
                const searchStr = `${ev.title} ${rawEvent?.category || ''} ${rawEvent?.description || ''}`.toLowerCase();
                return searchStr.includes('live') || searchStr.includes('gig') || searchStr.includes('music');
            });
        }

        return filtered;
    }, [activeEvents, selectedCity, activeFilter, fetchedEvents, userLat, userLng]);

    // Removed isMounted check to allow SSR and improve LCP

    return (
        <div className="w-full flex flex-col overflow-x-hidden">

            {/* Render Optimized Hero Carousel */}
            {heroEvents.length > 0 && <HeroCarousel heroEvents={heroEvents} />}

            {/* All Events Section */}
            <div className="relative z-20 bg-[#080b12] py-10 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-20">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-section text-white mb-0">All events</h2>
                            {/* Location button - icon only on mobile, full text on sm+ */}
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
                        {/* Filter Dropdown - full width on mobile */}
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
                    {allGridEvents.length > 0 ? (
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

            <BottomSections />
        </div>
    );
}
