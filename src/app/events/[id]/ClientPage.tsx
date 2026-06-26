'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight, Minus, Plus, Diamond, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('@/components/shared/LoginModal').then(mod => mod.LoginModal), { ssr: false });
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

const DEMO_EVENTS: Record<string, any> = {
    'demo-1': {
        _id: "demo-1",
        title: "Neon Nights: Cyberpunk Rave",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        startTime: "22:00",
        venueName: "Mumbai Secret Warehouse, Andheri",
        displayPrice: 1500,
        coverImage: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2958&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop"],
        description: "Experience the ultimate cyberpunk rave with cutting-edge visual mapping and underground techno.",
        tickets: [
            { id: "t1", name: "Early Bird", price: 999, description: "Entry before 11 PM" },
            { id: "t2", name: "VIP Pass", price: 2500, description: "Skip the line + 2 free drinks" }
        ],
        houseRules: ["21+ Only", "No flash photography", "Rave attire encouraged"]
    },
    'demo-2': {
        _id: "demo-2",
        title: "Sundance Open Air Festival",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        startTime: "16:00",
        venueName: "Delhi Golf Club Grounds",
        displayPrice: 999,
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop",
        images: [],
        description: "A massive open-air festival featuring top electronic acts, food trucks, and art installations.",
        tickets: [
            { id: "t1", name: "General Access", price: 999, description: "Full day access" },
            { id: "t2", name: "Backstage Pass", price: 4999, description: "Access to artist area and premium bar" }
        ],
        houseRules: ["No outside food/drinks", "Re-entry allowed with wristband"]
    },
    'demo-3': {
        _id: "demo-3",
        title: "Velvet Lounge: Jazz & Wine",
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        startTime: "19:00",
        venueName: "The Ritz-Carlton, Bengaluru",
        displayPrice: 2500,
        coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2832&auto=format&fit=crop",
        images: [],
        description: "An elegant evening of smooth jazz, premium wine tasting, and gourmet hors d'oeuvres.",
        tickets: [
            { id: "t1", name: "Standard Pairing", price: 2500, description: "Includes 3 wine glasses" },
            { id: "t2", name: "Premium Pairing", price: 5000, description: "Includes 5 vintage wine glasses + cheese platter" }
        ],
        houseRules: ["Smart casual attire required", "18+ Only"]
    },
    'demo-4': {
        _id: "demo-4",
        title: "Tech-House Boiler Room",
        date: new Date(new Date().setDate(new Date().getDate() + 14)),
        startTime: "23:00",
        venueName: "Koregaon Park Industrial Area, Pune",
        displayPrice: 500,
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2832&auto=format&fit=crop",
        images: [],
        description: "Intimate boiler room style gig featuring upcoming tech-house producers. 360-degree stage.",
        tickets: [
            { id: "t1", name: "Entry Ticket", price: 500, description: "Valid for one person" }
        ],
        houseRules: ["Camera lenses will be taped", "Respect the dancefloor"]
    },
    'demo-5': {
        _id: "demo-5",
        title: "Rooftop Sundowner: Tropical Vibes",
        date: new Date(new Date().setDate(new Date().getDate() + 7)),
        startTime: "17:00",
        venueName: "Banjara Hills Rooftop, Hyderabad",
        displayPrice: 1200,
        coverImage: "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2960&auto=format&fit=crop",
        images: [],
        description: "Catch the sunset with tropical house music, exotic cocktails, and a stunning view of the city skyline.",
        tickets: [
            { id: "t1", name: "Phase 1", price: 1200, description: "Early bird access" },
            { id: "t2", name: "Phase 2", price: 1500, description: "Regular access" },
            { id: "t3", name: "VIP Cabana", price: 10000, description: "Reserved seating for 6 + 1 Bottle" }
        ],
        houseRules: ["Beachwear/Casual chic", "Right of admission reserved"]
    },
    'movie-screening': {
        _id: "movie-screening",
        title: "MOVIE SCREENING",
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        startTime: "20:00",
        venueName: "Open Air Theatre, Mumbai",
        displayPrice: 499,
        coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop",
        images: [],
        description: "Experience classic cinema under the stars with great food and friends.",
        tickets: [{ id: "t1", name: "General Access", price: 499, description: "Includes one popcorn" }]
    },
    'shakira-delhi': {
        _id: "shakira-delhi",
        title: "SHAKIRA",
        date: new Date(new Date().setDate(new Date().getDate() + 10)),
        startTime: "19:00",
        venueName: "JLN Stadium, Delhi",
        displayPrice: 3500,
        coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2800&auto=format&fit=crop",
        images: [],
        description: "The global superstar brings her world tour to Delhi. Expect all the hits and incredible choreography.",
        tickets: [{ id: "t1", name: "Gold Circle", price: 3500, description: "Standing area close to stage" }, { id: "t2", name: "VIP", price: 10000, description: "Lounge access and fast track entry" }]
    },
    'fun-day-out': {
        _id: "fun-day-out",
        title: "FUN DAY-OUT",
        date: new Date(new Date().setDate(new Date().getDate() + 4)),
        startTime: "10:00",
        venueName: "Adventure Park, Bengaluru",
        displayPrice: 1500,
        coverImage: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=2800&auto=format&fit=crop",
        images: [],
        description: "A full day of thrilling rides, games, and outdoor activities for the whole family.",
        tickets: [{ id: "t1", name: "Day Pass", price: 1500, description: "Access to all rides" }]
    },
    'gaurav-gupta': {
        _id: "gaurav-gupta",
        title: "GAURAV GUPTA",
        date: new Date(new Date().setDate(new Date().getDate() + 6)),
        startTime: "21:00",
        venueName: "Comedy Club, Pune",
        displayPrice: 999,
        coverImage: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2800&auto=format&fit=crop",
        images: [],
        description: "Get ready to laugh out loud with one of India's top stand-up comedians.",
        tickets: [{ id: "t1", name: "Standard", price: 999, description: "First come first serve seating" }]
    },
    'honey-singh': {
        _id: "honey-singh",
        title: "Yo Yo! Honey Singh",
        date: new Date(new Date().setDate(new Date().getDate() + 15)),
        startTime: "20:00",
        venueName: "NSCI Dome, Mumbai",
        displayPrice: 2000,
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2800&auto=format&fit=crop",
        images: [],
        description: "The desi hip hop king is back with a massive arena show. Don't miss this high energy performance.",
        tickets: [{ id: "t1", name: "Fan Pit", price: 2000, description: "Closest to the action" }, { id: "t2", name: "VIP Lounge", price: 8000, description: "Premium views and unlimited drinks" }]
    }
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const { data: fetchedEvent, isLoading } = useQuery({
    queryKey: ['eventFull', eventId],
    queryFn: async () => {
      if (DEMO_EVENTS[eventId]) {
          return DEMO_EVENTS[eventId];
      }
      const res = await axiosInstance.get(`/user/events/${eventId}/full`);
      return res.data?.data || null;
    },
    staleTime: 60000,
  });

  const event = React.useMemo(() => {
    if (!fetchedEvent) return null;
    
    // Combine tickets and floors into one array for the UI selection
    const rawTickets = fetchedEvent.tickets || [];
    const rawFloors = fetchedEvent.floors || [];
    
    const uiTickets = [
      ...rawTickets.map((t: any) => ({
        id: t._id || t.id || Math.random().toString(),
        name: t.name || t.type || 'Ticket',
        price: t.price || 0,
        desc: t.description ? [t.description] : ['General Admission']
      })),
      ...rawFloors.map((f: any) => ({
        id: f._id || f.id || Math.random().toString(),
        name: f.name || f.type || 'Table',
        price: f.price || 0,
        desc: ['Reserved Table', `Capacity: ${f.capacity || 4}`]
      }))
    ];

    let minPrice = 0;
    if (uiTickets.length > 0) {
        const prices = uiTickets.map(t => t.price).filter(p => p > 0);
        minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    }

    return {
      id: fetchedEvent._id,
      title: fetchedEvent.title,
      date: new Date(fetchedEvent.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: fetchedEvent.startTime,
      location: fetchedEvent.locationData?.address || fetchedEvent.venueName || 'Secret Location',
      distance: '',
      price: minPrice > 0 ? `₹${minPrice}` : 'Free',
      image: fetchedEvent.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
      images: fetchedEvent.images?.length > 0 ? fetchedEvent.images : [fetchedEvent.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'],
      about: fetchedEvent.description || 'Join us for an amazing event.',
      highlights: fetchedEvent.houseRules?.length > 0 
        ? fetchedEvent.houseRules.map((rule: string) => ({ title: 'House Rule', desc: rule })) 
        : [{ title: "What you'll experience", desc: 'An amazing night with great music and vibes.' }],
      tickets: uiTickets
    };
  }, [fetchedEvent]);
  
  const { isAuthenticated } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  
  const eventImages = React.useMemo(() => event?.images || [event?.image], [event?.images, event?.image]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!eventImages || eventImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % eventImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [eventImages]);

  const ticketsRef = useRef<HTMLDivElement>(null);

  const bookEventMutation = useMutation({
    mutationFn: async (payload: any) => {
      // If it's a demo event, simulate a successful backend booking response
      if (payload.eventId?.toString().startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
      }
      // For REAL events, connect to the actual backend API
      const res = await axiosInstance.post('/user/events/book', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully booked tickets!');
      router.push('/dashboard/tickets');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to book event.');
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-medium text-white/60">Loading Event Details...</h1>
    </div>;
  }

  if (!event) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
      <h1 className="text-2xl font-bold">Event not found</h1>
      <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
    </div>;
  }

  const scrollToTickets = () => {
    ticketsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuantityChange = (ticketId: string, delta: number) => {
    setTicketQuantities(prev => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [ticketId]: next };
    });
  };

  const totalTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
  const totalPrice = event?.tickets?.reduce((sum: number, ticket: any) => sum + (ticket.price * (ticketQuantities[ticket.id] || 0)), 0) || 0;

  const handleAddToCart = () => {
    if (totalTickets === 0) return;
    
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    const selectedTicketNames = event?.tickets
      ?.filter((t: any) => (ticketQuantities[t.id] || 0) > 0)
      .map((t: any) => `${t.name} x${ticketQuantities[t.id]}`)
      .join(', ') || 'General Admission';

    bookEventMutation.mutate({
      eventId: event?.id,
      ticketType: selectedTicketNames,
      totalAmount: totalPrice,
      guestCount: totalTickets
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
      {/* Header Banner */}
      <div className="w-full max-w-6xl mx-auto pt-24 md:pt-28 px-4 md:px-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">{event.title}</h1>
          <div className="flex flex-wrap items-center text-sm md:text-base font-semibold text-blue-400 space-x-2">
            <span>{event.date}</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60">{event.location.split(' | ')[0]}</span>
          </div>
        </div>

        <div className="w-full aspect-[21/9] md:aspect-[3/1] relative rounded-3xl overflow-hidden shadow-2xl bg-black group">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
              >
                {/* Edge Blur Background */}
                <Image 
                  src={eventImages[currentImageIndex] || ''}
                  alt="Background Blur"
                  fill
                  priority
                  className="object-cover opacity-40 blur-xl scale-110"
                />
                {/* Main Poster */}
                <Image 
                  src={eventImages[currentImageIndex] || ''} 
                  alt={event.title} 
                  fill
                  priority
                  className="object-cover md:object-contain drop-shadow-2xl z-10" 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {eventImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {eventImages.map((_: string, idx: number) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">About</h2>
            <div className="text-white/60 leading-relaxed font-light">
              <p className="mb-4 text-white/80 font-medium">An evening with {event.title.split(' ')[0]} -</p>
              <p>{event.about}</p>
            </div>
            <button className="text-blue-400 font-bold text-sm hover:underline mt-2">Read more</button>
          </section>

          {/* Highlights Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.highlights.map((hi: { title: string; desc: string }, i: number) => (
                <div key={i} className="border border-white/10 rounded-2xl p-5 bg-[#111111] shadow-xl hover:bg-white/5 transition-all">
                  <div className="flex items-center space-x-2 mb-2">
                    {i === 0 ? <Diamond className="w-5 h-5 text-blue-400" /> : <Sparkles className="w-5 h-5 text-blue-400" />}
                    <h3 className="font-bold text-white">{hi.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed font-light">{hi.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-28 bg-[#111111] border border-white/10 shadow-2xl rounded-3xl p-6 space-y-6">
            
            <div className="space-y-4">
              <div 
                className="flex items-start space-x-4 cursor-pointer group hover:bg-white/[0.03] p-3 -m-3 rounded-2xl transition-all"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank')}
                title="View on Google Maps"
              >
                <div className="p-2 bg-white/5 rounded-full shrink-0 border border-white/10 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all">
                  <MapPin className="w-5 h-5 text-white/60 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{event.location.split(' | ')[0]}</h4>
                  <p className="text-sm text-white/50">{event.location.split(' | ')[1] || event.distance}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 ml-auto mt-1 transition-colors group-hover:translate-x-1" />
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/5 rounded-full shrink-0 border border-white/10">
                  <Calendar className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Gates open at {event.time || 'TBA'}</h4>
                  <p className="text-sm text-blue-400 hover:underline cursor-pointer">View full schedule & timeline</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto mt-1" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-black text-white">
                {event.price} <span className="text-sm font-medium text-white/40 line-through tracking-normal ml-1"></span>
                <span className="text-sm font-medium text-white/40 block -mt-1">{event.price !== 'Free' ? 'onwards' : ''}</span>
              </div>
              <Button onClick={scrollToTickets} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
                Book Tickets
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div ref={ticketsRef} className="w-full bg-[#0A0A0A] border-t border-white/10 pt-16 pb-32 mt-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-8 pl-2">Choose Tickets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.tickets.map(ticket => (
              <div key={ticket.id} className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/[0.03] transition-all flex flex-col h-full group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex-1">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{ticket.name}</h3>
                    <div className="text-3xl font-black text-blue-400">₹{ticket.price}</div>
                  </div>

                  <ul className="space-y-3 mt-4 text-sm text-white/50 font-light">
                    {ticket.desc.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/50 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm font-medium text-white/40">Select quantity</span>
                  <div className="flex items-center border border-white/10 rounded-xl bg-black/40 text-white overflow-hidden shadow-inner h-11 w-32">
                    <button 
                      onClick={() => handleQuantityChange(ticket.id, -1)}
                      className="flex-1 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-white/70 hover:text-white" />
                    </button>
                    <div className="w-10 h-full flex items-center justify-center font-bold text-sm bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                      {ticketQuantities[ticket.id] || 0}
                    </div>
                    <button 
                      onClick={() => handleQuantityChange(ticket.id, 1)}
                      className="flex-1 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white/70 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Floating Bar for Checkout */}
      <AnimatePresence>
        {totalTickets > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-3xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-40"
          >
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-white">₹{totalPrice}</div>
                <div className="text-sm font-light text-white/50">{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</div>
              </div>
              <Button 
                onClick={handleAddToCart} 
                disabled={bookEventMutation.isPending}
                className="h-14 px-8 md:px-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {bookEventMutation.isPending ? 'BOOKING...' : 'ADD TO BOOKING'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={() => alert(`Logged in successfully! Added ${totalTickets} tickets to booking.`)}
      />
    </div>
  );
}
