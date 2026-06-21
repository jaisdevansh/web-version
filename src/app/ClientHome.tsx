'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

import { ShieldCheck, Ticket, Users, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
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

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % heroEvents.length);
        setInnerImageIndex(0);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + heroEvents.length) % heroEvents.length);
        setInnerImageIndex(0);
    };

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
                                sizes="100vw"
                                className="object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>
                    {/* Performance Fix: Replaced backdrop-blur-[100px] with a more performant blur + higher opacity bg */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-10" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 lg:px-20 flex-1 flex items-center justify-center py-12">
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
                                    <div className="font-semibold text-gray-300 tracking-wide">
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

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
                        {heroEvents.map((_: any, idx: number) => (
                            <button
                                key={idx}
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => setCurrentIndex(idx)}
                                className={`p-2 transition-all duration-300 flex items-center justify-center`}
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

// --- Page Skeleton Component ---
function PageSkeleton() {
    return (
        <div className="w-full flex flex-col overflow-x-hidden animate-in fade-in duration-500 bg-black min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] w-full flex-col items-center justify-center overflow-hidden bg-black px-4 md:px-12 lg:px-20 py-12">
                <div className="flex flex-col lg:flex-row items-center w-full max-w-7xl mx-auto gap-10 lg:gap-24 relative z-10">
                    <div className="w-full lg:w-[60%] flex justify-center lg:justify-end">
                        <Skeleton className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[750px] aspect-[16/9] md:aspect-[3/2] lg:aspect-[16/9] rounded-3xl bg-white/5" />
                    </div>
                    <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                        <Skeleton className="h-6 w-32 bg-white/5" />
                        <Skeleton className="h-16 w-full max-w-md bg-white/5" />
                        <Skeleton className="h-16 w-3/4 max-w-sm bg-white/5" />
                        <Skeleton className="h-8 w-48 bg-white/5" />
                        <Skeleton className="h-8 w-32 bg-white/5" />
                        <Skeleton className="h-14 w-40 rounded-2xl bg-white/5 mt-6" />
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="bg-[#080b12] py-16 px-6 lg:px-12 xl:px-20 border-t border-white/5">
                <div className="max-w-[1400px] mx-auto">
                    <Skeleton className="h-10 w-48 bg-white/5 mb-6" />
                    <div className="flex space-x-3 mb-6 overflow-x-hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-full bg-white/5 shrink-0" />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10 mt-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="w-full aspect-[3/4] rounded-2xl bg-white/5" />
                                <Skeleton className="h-6 w-3/4 bg-white/5" />
                                <Skeleton className="h-4 w-1/2 bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                images: ["https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"],
                city: "Mumbai"
            },
            {
                _id: "demo-2",
                title: "Sundance Open Air Festival",
                date: new Date(new Date().setDate(new Date().getDate() + 5)),
                startTime: "16:00",
                venueName: "Delhi Golf Club Grounds",
                displayPrice: 999,
                coverImage: "https://images.unsplash.com/photo-1533174000273-e1f4ceb66150?q=80&w=2940&auto=format&fit=crop",
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
                coverImage: "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=2832&auto=format&fit=crop",
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
    const FILTERS = ['All', 'Today', 'Tomorrow', 'This Weekend', 'Under 10 km', 'Live Gigs', 'Music'];
    const [activeFilter, setActiveFilter] = useState('All');
    
    // Use the global location store
    const { city: selectedCity, setCity: setSelectedCity, lat: userLat, lng: userLng, setLocation } = useLocationStore();
    const [isLocating, setIsLocating] = useState(false);

    const requestLocation = () => {
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
    };

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

    if (!isMounted || isLoading) {
        return <PageSkeleton />;
    }

    return (
        <div className="w-full flex flex-col overflow-x-hidden">
            {/* Render Optimized Hero Carousel */}
            {heroEvents.length > 0 && <HeroCarousel heroEvents={heroEvents} />}

            {/* All Events Section */}
            <div className="relative z-20 bg-[#080b12] py-16 px-6 lg:px-12 xl:px-20">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-section text-white mb-0">All events</h2>
                        
                        <div className="flex items-center gap-3">
                            {/* Filter Dropdown */}
                            <div className="relative flex items-center">
                                <svg className="w-3.5 h-3.5 text-white/70 absolute left-3.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                                <select 
                                    value={activeFilter} 
                                    onChange={(e) => setActiveFilter(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-1.5 text-white text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 appearance-none"
                                >
                                    {FILTERS.map((filter) => (
                                        <option key={filter} value={filter} className="bg-[#080b12] text-white">
                                            Filter ({filter})
                                        </option>
                                    ))}
                                </select>
                                <svg className="w-3.5 h-3.5 text-white/70 absolute right-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>

                            <button 
                                onClick={requestLocation}
                                disabled={isLocating}
                                className="flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 rounded-full px-4 py-2 text-sm transition-colors whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                {isLocating ? "Locating..." : userLat ? "Location Access On" : "Location Access"}
                            </button>
                        </div>
                    </div>

                    {/* City Chips */}
                    <div className="flex items-center space-x-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {['All Cities', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai'].map((cityOption) => (
                            <button
                                key={cityOption}
                                onClick={() => setSelectedCity(cityOption)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all border flex items-center ${
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10 mt-2">
                            {allGridEvents.map((ev: any) => (
                                <Link href={`/events/${ev.id}`} key={ev.id} className="group block cursor-pointer">
                                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a1f2e] mb-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-white/20 transition-all duration-300">
                                        <Image
                                            src={ev.image} 
                                            alt={ev.title} 
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <h3 className="text-card-heading text-white group-hover:text-blue-400 transition-colors line-clamp-1">{ev.title}</h3>
                                    <p className="text-white/60 text-small mt-1">{ev.date}</p>
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

            {/* How It Works Section - Premium */}
            <div className="relative z-20 bg-black py-16 lg:py-20 px-6 overflow-hidden">
                {/* Animated Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm mb-6">
                            The Entry Club Experience
                        </div>
                        <h2 className="text-hero text-white tracking-tight drop-shadow-xl">
                            Unlock The City's <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Best Events</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
                        
                        {[
                            { num: "1", title: "Curated Experiences", desc: "Explore hand-picked VIP events, exclusive raves, and premium club nights." },
                            { num: "2", title: "Instant Access", desc: "Skip the lines. Secure your passes and VIP tables instantly from your phone." },
                            { num: "3", title: "Own The Night", desc: "Flash your digital pass and walk right in. Unforgettable memories await." }
                        ].map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative z-10 group"
                            >
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col items-center text-center h-full">
                                    <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 mb-8 relative group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-light text-white relative z-10">
                                            {step.num}
                                        </div>
                                    </div>
                                    <h3 className="text-card-heading text-white mb-4 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                                    <p className="text-white/70 text-body leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Event Organiser CTA Section */}
            <div className="relative z-20 w-full py-16 overflow-hidden bg-black border-y border-white/[0.02]">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop" 
                        alt="Crowd cheering at a concert" 
                        fill 
                        sizes="100vw"
                        className="object-cover opacity-35 object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-black/75 to-purple-950/30" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-section text-white tracking-tight">
                            Are You An <span className="text-[#e879f9]">Event</span> <span className="text-[#818cf8]">Organiser?</span>
                        </h2>
                        <p className="text-body text-white/80">
                            Get Your Event Live in Less Than 3 Minutes
                        </p>
                        <div className="pt-2">
                            <Link href="/dashboard">
                                <button className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-md">
                                    List Event
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* App Promo Section - Premium */}
            <div className="relative z-20 bg-[#020202] py-16 lg:py-20 px-6 overflow-hidden border-t border-white/[0.02]">
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-hero text-white mb-10 leading-tight">
                            The Entire City, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">In Your Pocket.</span>
                        </h2>

                        <div className="space-y-8 mb-16">
                            {[
                                { title: "Real-Time Updates", desc: "Never miss out. Get instant notifications for secret parties, ticket drops, and exclusive events." },
                                { title: "Join The Community", desc: "See where your friends are heading. Coordinate plans and share your night out." },
                                { title: "Your Personal Concierge", desc: "Save your favorite venues, set reminders, and let us recommend the perfect spot for your vibe." }
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="flex items-start group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mt-1 mr-6 shrink-0 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors shadow-lg">
                                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-card-heading text-white mb-2 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                                        <p className="text-white/70 text-body leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <h3 className="text-subheading text-white mb-8">Ready To Party Smarter?</h3>

                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-white/30 transition-all transform hover:-translate-y-1 group backdrop-blur-md shadow-xl">
                                <svg viewBox="0 0 512 512" className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform">
                                    <defs>
                                        <linearGradient id="google-play-gradient-promo" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4285F4" />
                                            <stop offset="30%" stopColor="#34A853" />
                                            <stop offset="70%" stopColor="#FBBC05" />
                                            <stop offset="100%" stopColor="#EA4335" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#google-play-gradient-promo)" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Get it on</div>
                                    <div className="text-lg font-semibold text-white">Google Play</div>
                                </div>
                            </button>
                            <button className="flex items-center px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-white/30 transition-all transform hover:-translate-y-1 group backdrop-blur-md shadow-xl">
                                <svg viewBox="0 0 384 512" className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform">
                                    <defs>
                                        <linearGradient id="apple-gradient-promo" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#FFFFFF" />
                                            <stop offset="100%" stopColor="#B0B5B9" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#apple-gradient-promo)" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                    </svg>
                                <div className="text-left">
                                    <div className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Download on the</div>
                                    <div className="text-lg font-semibold text-white">App Store</div>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Side Visual (Floating Glass Cards) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] hidden lg:flex items-center justify-center"
                    >
                        <motion.div 
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute z-20 w-[300px] h-[400px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 transform -rotate-6 -translate-x-10"
                        >
                            <div className="w-full h-40 bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600')] bg-cover opacity-50 blend-overlay" />
                            </div>
                            <div className="w-3/4 h-6 bg-white/10 rounded-full mt-2" />
                            <div className="w-1/2 h-4 bg-white/5 rounded-full" />
                            <div className="mt-auto w-full h-12 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 font-bold text-sm">
                                Get Ticket
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [10, -10, 10] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                            className="absolute z-10 w-[300px] h-[400px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 transform rotate-12 translate-x-20 translate-y-20"
                        >
                            <div className="w-full h-40 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600')] bg-cover opacity-50 blend-overlay" />
                            </div>
                            <div className="w-3/4 h-6 bg-white/10 rounded-full mt-2" />
                            <div className="w-1/2 h-4 bg-white/5 rounded-full" />
                            <div className="mt-auto w-full flex gap-2">
                                 <div className="w-10 h-10 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-xs">+3</div>
                                 <div className="w-10 h-10 rounded-full bg-blue-500/30 -ml-4 border border-white/10 backdrop-blur-md" />
                                 <div className="w-10 h-10 rounded-full bg-purple-500/30 -ml-4 border border-white/10 backdrop-blur-md" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Contact Form Preview */}
            <div id="host-contact" className="relative z-20 bg-black py-32 px-6 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-section text-white mb-6 tracking-tight">Want to be the host?</h2>
                                <p className="text-white/70 text-body leading-relaxed">Just fill this form and our team will connect with you within 24 hrs.</p>
                            </div>
                            
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-10 md:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <form className="relative z-10 space-y-8" onSubmit={(e) => { e.preventDefault(); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label htmlFor="host-name" className="text-xs font-bold tracking-widest text-white/70 uppercase pl-2">Name</label>
                                        <input id="host-name" type="text" placeholder="John Doe" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="host-email" className="text-xs font-bold tracking-widest text-white/70 uppercase pl-2">Email</label>
                                        <input id="host-email" type="email" placeholder="john@example.com" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="host-message" className="text-xs font-bold tracking-widest text-white/70 uppercase pl-2">Message</label>
                                    <textarea id="host-message" placeholder="Tell us about your venue..." rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all resize-none"></textarea>
                                </div>
                                <button type="submit" className="w-full relative overflow-hidden bg-white text-black font-bold text-lg py-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] group/btn mt-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Send Transmission</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
