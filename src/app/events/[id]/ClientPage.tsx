'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight, ChevronLeft, Minus, Plus, Diamond, Sparkles, Play, Square, Ticket, Users, Zap, CheckCircle2, ArrowRight, Shield, RefreshCw, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('@/components/shared/LoginModal').then(mod => mod.LoginModal), { ssr: false });
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const { data: fetchedEvent, isLoading } = useQuery({
    queryKey: ['eventFull', eventId],
    queryFn: async () => {
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
      endTime: fetchedEvent.endTime || 'TBA',
      ticketsLive: fetchedEvent.bookingOpenDate ? new Date(fetchedEvent.bookingOpenDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Available Now',
      location: fetchedEvent.locationData?.address || fetchedEvent.venueName || 'Indore',
      distance: '',
      price: minPrice > 0 ? `₹${minPrice}` : 'Free',
      image: fetchedEvent.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
      images: fetchedEvent.images?.length > 0 ? fetchedEvent.images : [fetchedEvent.coverImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop'],
      about: fetchedEvent.description || 'Join us for an amazing event.',
      hostName: fetchedEvent.hostId?.name || (fetchedEvent.hostId?.firstName ? `${fetchedEvent.hostId.firstName} ${fetchedEvent.hostId.lastName || ''}`.trim() : 'Event Organizer'),
      hostImage: fetchedEvent.hostId?.profileImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
      highlights: fetchedEvent.houseRules?.length > 0 
        ? fetchedEvent.houseRules.map((rule: any) => {
            // houseRules can be a plain string OR an object {title, detail, icon, _id}
            if (typeof rule === 'string') return { title: 'House Rule', desc: rule };
            return { title: rule.title || 'House Rule', desc: rule.detail || rule.desc || rule.description || '' };
          })
        : [{ title: "What you'll experience", desc: 'An amazing night with great music and vibes.' }],
      tickets: uiTickets
    };
  }, [fetchedEvent]);
  
  const { isAuthenticated } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'zone' | 'seats'>('zone');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [hostImageError, setHostImageError] = useState(false);

  const zones = React.useMemo(() => {
    if (!fetchedEvent) return [];
    const floors = fetchedEvent.floors || [];
    const tickets = fetchedEvent.tickets || [];
    const source = floors.length > 0 ? floors : tickets;
    return source.map((z: any) => ({
      _id: z._id || z.id || String(Math.random()),
      name: z.name || z.type || 'General Entry',
      type: z.type,
      price: Number(z.price) || 0,
      capacity: Number(z.capacity) || 50,
      bookedCount: Number(z.bookedCount) || Number(z.sold) || 0,
      description: z.description,
      perks: z.perks || [],
    }));
  }, [fetchedEvent]);

  const isCompletelySoldOut = React.useMemo(() => {
    if (zones.length === 0) return false;
    return zones.every((z: any) => (z.capacity - z.bookedCount) <= 0);
  }, [zones]);

  const seatsArray = React.useMemo(() => {
    if (!selectedZone) return [];
    const total = selectedZone.capacity;
    const arr = [];
    for (let i = 1; i <= total; i++) {
      const isSold = (i % Math.max(1, Math.floor(total / Math.max(1, selectedZone.bookedCount)))) === 0 && i <= (selectedZone.bookedCount * Math.max(1, Math.floor(total / Math.max(1, selectedZone.bookedCount))));
      arr.push({ id: String(i), isSold: isSold || false });
    }
    return arr;
  }, [selectedZone]);

  
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

  const handleSelectZone = React.useCallback((zone: any) => {
    const available = zone.capacity - zone.bookedCount;
    if (available <= 0) return;
    setSelectedZone(zone); 
    setSelectedSeats([]); 
    setQuantity(prev => Math.min(prev, available));
    setStep('zone');
  }, []);


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



  const handleSeatClick = (seatId: string, isSold: boolean) => {
    if (isSold) {
      toast.error('This table is already booked.');
      return;
    }
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) return prev.filter(id => id !== seatId);
      if (prev.length >= quantity) {
        toast.error('You have only chosen ' + quantity + ' guest' + (quantity > 1 ? 's' : '') + '.');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const commissionRate = Number(fetchedEvent?.hostId?.commissionRate ?? 10);
  const basePrice = selectedZone ? selectedZone.price * quantity : 0;
  const platformFee = Math.round(basePrice * (commissionRate / 100));
  const totalPrice = basePrice + platformFee;

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!selectedZone || !event) return;
    if (selectedSeats.length !== quantity) {
      toast.error('Please select exactly ' + quantity + ' table/seat' + (quantity > 1 ? 's' : '') + ' before proceeding.');
      return;
    }
    const params = new URLSearchParams({
      zone: selectedZone.name,
      zoneId: selectedZone._id,
      qty: String(quantity),
      price: String(selectedZone.price),
      commission: String(commissionRate),
      seats: selectedSeats.join(','),
    });
    router.push('/dashboard/events/' + eventId + '/payment?' + params.toString());
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
          {/* Host Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Hosted By</h2>
            <div className="flex items-center space-x-4 bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/30 shrink-0 bg-white/5 flex items-center justify-center">
                <Image 
                  src={hostImageError ? 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop' : event.hostImage} 
                  alt={event.hostName} 
                  fill 
                  className="object-cover" 
                  onError={() => setHostImageError(true)}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white">{event.hostName}</h3>
                <p className="text-sm text-white/50">Event Organizer</p>
              </div>
              <Button variant="outline" className="hidden sm:flex rounded-xl border-white/10 hover:bg-white/5 text-white">
                Follow
              </Button>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">About</h2>
            <div className="text-white/60 leading-relaxed font-light">
              <p className="mb-4 text-white/80 font-medium">Join us for {event.title}</p>
              <p className={isAboutExpanded ? "whitespace-pre-wrap" : "line-clamp-3"}>{event.about}</p>
            </div>
            {event.about?.length > 150 && (
              <button 
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="text-blue-400 font-bold text-sm hover:underline mt-2"
              >
                {isAboutExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </section>

          {/* Event Info Grid (Real Data) */}
          <section className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-white/40 mb-2 text-[10px] tracking-widest font-bold uppercase">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Event Date</span>
                </div>
                <div className="text-white font-bold text-lg">
                  {event.date}
                </div>
              </div>
              
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-white/40 mb-2 text-[10px] tracking-widest font-bold uppercase">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500 ml-0.5" />
                  </div>
                  <span>Starts</span>
                </div>
                <div className="text-white font-bold text-lg">
                  {event.time}
                </div>
              </div>

              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-white/40 mb-2 text-[10px] tracking-widest font-bold uppercase">
                  <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center">
                    <Square className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                  </div>
                  <span>Ends</span>
                </div>
                <div className="text-white font-bold text-lg">
                  {event.endTime}
                </div>
              </div>

              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-center">
                {isCompletelySoldOut ? (
                  <>
                    <div className="flex items-center space-x-2 text-red-400 mb-2 text-[10px] tracking-widest font-bold uppercase">
                      <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center">
                        <Ticket className="w-3 h-3 text-red-500" />
                      </div>
                      <span>Status</span>
                    </div>
                    <div className="text-red-500 font-black text-lg">
                      SOLD OUT
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 text-white/40 mb-2 text-[10px] tracking-widest font-bold uppercase">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                        <Ticket className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span>Tickets Live Since</span>
                    </div>
                    <div className="text-white font-bold text-sm md:text-base">
                      {event.ticketsLive}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Highlights Section */}
          <section className="space-y-4 pt-4">
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
              {isCompletelySoldOut ? (
                <Button disabled className="h-12 px-8 bg-white/10 text-white/40 font-bold rounded-xl cursor-not-allowed border border-white/5">
                  Sold Out
                </Button>
              ) : (
                <Button onClick={scrollToTickets} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
                  Book Tickets
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Zone / Seat Selection Section */}
      <div ref={ticketsRef} className="w-full bg-[#0A0A0A] border-t border-white/10 pt-16 pb-32 mt-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          
          {isCompletelySoldOut ? (
            <div className="w-full flex flex-col items-center justify-center py-24 bg-[#111111] border border-white/10 rounded-3xl shadow-2xl">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <Ticket className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">SOLD OUT</h2>
              <p className="text-white/50 text-lg">No more tickets or tables are available for this event.</p>
            </div>
          ) : step === 'zone' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: Main Selections */}
              <div className="lg:col-span-2 space-y-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  {/* Select Date & Guests Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-8">
                    {/* Select Date */}
                    <section>
                      <h2 className="text-lg font-medium mb-4 text-white/80">Select Date</h2>
                      <div className="w-24 rounded-2xl border border-blue-500/50 bg-blue-500/10 flex flex-col items-center justify-center py-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                        <span className="text-3xl font-black text-white my-1">{new Date(event.date).getDate()}</span>
                        <span className="text-sm text-blue-400/80">{new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                      </div>
                    </section>

                    {/* How many guests? */}
                    <section>
                      <h2 className="text-lg font-medium mb-4 text-white/80">How many guests?</h2>
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => { setQuantity(q => Math.max(1, q - 1)); setSelectedSeats([]); }} 
                          disabled={quantity <= 1} 
                          className="w-14 h-14 rounded-full bg-[#1A1A24] flex items-center justify-center disabled:opacity-50 transition-colors hover:bg-[#2A2A36]"
                        >
                          <Minus className="w-6 h-6 text-white/70" />
                        </button>
                        <span className="text-4xl font-light w-10 text-center">{quantity}</span>
                        <button 
                          onClick={() => { 
                            if (selectedZone) {
                              const available = selectedZone.capacity - selectedZone.bookedCount;
                              if (quantity >= available) {
                                toast.warning("Only " + available + " spots available in selected zone.");
                                return;
                              }
                            }
                            setQuantity(q => Math.min(20, q + 1)); 
                            setSelectedSeats([]); 
                          }} 
                          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        >
                          <Plus className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </section>
                  </div>

                  {/* Choose your table */}
                  <section>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold">Choose your table</h2>
                        <div className="flex items-center gap-1.5 text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">
                          <RefreshCw className="w-3 h-3" /><span>Updates live</span>
                        </div>
                      </div>
                      <button className="text-sm text-blue-500 font-medium hover:text-blue-400 transition-colors">View Floor Map &rarr;</button>
                    </div>
                    
                    {zones.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">No zones available.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AnimatePresence>
                          {zones.map((zone: any, idx: number) => {
                            const available = zone.capacity - zone.bookedCount;
                            const isFull = available <= 0;
                            const isSel = selectedZone?._id === zone._id || selectedZone?.name === zone.name;
                            
                            let hash = 0;
                            const idStr = String(zone._id || zone.name);
                            for (let i = 0; i < idStr.length; i++) hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
                            const fastFillingPercent = 20 + (Math.abs(hash * 31 + idx) % 26);
                            
                            return (
                              <motion.div 
                                key={zone._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                                onClick={() => handleSelectZone(zone)}
                                className={"relative rounded-2xl p-5 transition-all duration-200 cursor-pointer border " + 
                                  (isFull ? "border-white/5 bg-white/[0.02] opacity-50" : 
                                  isSel ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]" : 
                                  "border-white/10 bg-[#0F0F16] hover:border-white/20")}
                              >
                                <div className="flex justify-between items-start mb-5">
                                  <div className="grid grid-cols-3 gap-1 w-6 h-6 text-emerald-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                  </div>
                                  {isSel ? (
                                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                  ) : !isFull ? (
                                    <div className="flex items-center gap-1.5 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                      <span className="text-[9px] font-bold tracking-wider text-rose-400 uppercase">
                                        Fast Filling {fastFillingPercent}%
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-1.5">{zone.name}</h3>
                                <p className="text-sm text-white/50 mb-6">{zone.description || "Standard event access"}</p>
                                
                                <div className="flex items-center justify-between">
                                  <div className={"text-xl font-black " + (isFull ? "text-white/30" : isSel ? "text-blue-300" : "text-white")}>
                                    {zone.price > 0 ? ("Rs " + zone.price.toLocaleString("en-IN")) : "FREE"}
                                    <span className="text-xs font-normal text-white/40 ml-1">/ person</span>
                                  </div>
                                  <div className="inline-block px-3 py-1 rounded bg-white/10 text-white/70 text-[10px] font-bold tracking-wider uppercase">
                                    {isFull ? "SOLD OUT" : `${available} LEFT`}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}
                  </section>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0A0A12] overflow-hidden shadow-2xl">
                  <div className="bg-blue-600/10 border-b border-blue-500/20 px-6 py-5">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1.5">Order Summary</p>
                    <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>
                    <p className="text-sm text-blue-400 mt-1">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  
                  <div className="px-6 py-6 space-y-6">
                    {selectedZone ? (
                      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Selected Zone</p>
                            <p className="font-bold text-lg text-white leading-tight">{selectedZone.name}</p>
                            <p className="text-sm text-white/60 mt-1">{selectedZone.price > 0 ? ("Rs " + selectedZone.price.toLocaleString("en-IN") + " x " + quantity) : "Free Entry"}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => { setQuantity(q => Math.max(1, q - 1)); setSelectedSeats([]); }}
                              disabled={quantity <= 1}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-sm font-bold text-white w-6 text-center">{quantity}</span>
                            <button
                              onClick={() => {
                                const available = selectedZone.capacity - selectedZone.bookedCount;
                                if (quantity >= available) {
                                  toast.warning("Only " + available + " spots available in selected zone.");
                                  return;
                                }
                                setQuantity(q => Math.min(20, q + 1));
                                setSelectedSeats([]);
                              }}
                              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 text-center border-dashed">
                        <p className="text-sm text-white/40">Select a zone to continue</p>
                      </div>
                    )}

                    {selectedZone && (
                      <div className="space-y-3 text-sm border-t border-white/10 pt-6">
                        <div className="flex justify-between text-white/60">
                          <span>{selectedZone.name} x {quantity}</span>
                          <span>Rs {(selectedZone.price * quantity).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-white/60">
                          <span>Platform Fee ({commissionRate}%)</span>
                          <span>Rs {platformFee.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-2">
                          <div>
                            <span className="text-white font-bold text-base block">Total</span>
                            <span className="text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase mt-0.5 block">Incl. platform fee</span>
                          </div>
                          <span className="text-2xl font-black text-white leading-none">Rs {totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        onClick={() => setStep('seats')} 
                        disabled={!selectedZone}
                        className={"w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 " + 
                          (!selectedZone 
                            ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10" 
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]")}
                      >
                        Choose Seats <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/30 pt-2">
                      <Shield className="w-4 h-4" />
                      <span>Secured by Razorpay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: Seat Selection */}
              <div className="lg:col-span-2 space-y-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setStep('zone')} className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm font-medium">
                          <ChevronLeft className="w-4 h-4" />Back
                        </button>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">Select Your Table</h2>
                      <p className="text-white/50 text-sm">Choose {quantity} table(s) for your group.</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-lg bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                      {selectedSeats.length}/{quantity}
                    </div>
                  </div>

                  {/* DJ / STAGE */}
                  <div className="w-full bg-[#111116] border border-white/5 rounded-2xl py-4 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                    <Music className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold tracking-[0.2em] text-white/60">DJ • STAGE</span>
                  </div>

                  {/* Zone Subtitle */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <h3 className="text-xl font-bold text-white">{selectedZone?.name}</h3>
                      </div>
                      <p className="text-sm text-white/40 ml-4 mt-1.5">Selected Range • {selectedZone?.price > 0 ? "₹" + selectedZone?.price.toLocaleString("en-IN") : "FREE"}</p>
                    </div>
                    <div className="text-sm font-medium text-white/40 bg-white/5 px-3 py-1.5 rounded-lg">{selectedZone?.capacity - selectedZone?.bookedCount} / {selectedZone?.capacity} left</div>
                  </div>

                  {/* Seat Grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
                    {seatsArray.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button 
                          key={seat.id} 
                          onClick={() => handleSeatClick(seat.id, seat.isSold)} 
                          disabled={seat.isSold}
                          className={"aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all " + 
                            (seat.isSold 
                              ? "bg-transparent border border-white/5 text-white/10 cursor-not-allowed" 
                              : isSelected 
                              ? "bg-blue-600 text-white border border-blue-400 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                              : "bg-[#1A1A24] border border-white/5 text-white hover:border-blue-500/50 hover:bg-blue-500/10")}
                        >
                          {seat.id}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Seat Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0A0A12] overflow-hidden shadow-2xl">
                  <div className="bg-blue-600/10 border-b border-blue-500/20 px-6 py-5">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1.5">Order Summary</p>
                    <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>
                    <p className="text-sm text-blue-400 mt-1">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  
                  <div className="px-6 py-6 space-y-6">
                    <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Selected Zone</p>
                          <p className="font-bold text-lg text-white leading-tight">{selectedZone?.name}</p>
                          <p className="text-sm text-white/60 mt-1">{selectedZone?.price > 0 ? ("Rs " + selectedZone?.price.toLocaleString("en-IN") + " x " + quantity) : "Free Entry"}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => { setQuantity(q => Math.max(1, q - 1)); setSelectedSeats([]); }}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-sm font-bold text-white w-6 text-center">{quantity}</span>
                          <button
                            onClick={() => {
                              if (selectedZone) {
                                const available = selectedZone.capacity - selectedZone.bookedCount;
                                if (quantity >= available) {
                                  toast.warning("Only " + available + " spots available in selected zone.");
                                  return;
                                }
                              }
                              setQuantity(q => Math.min(20, q + 1));
                              setSelectedSeats([]);
                            }}
                            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {selectedSeats.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Selected Tables</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map(id => (
                            <span key={id} className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm font-bold">{id}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-sm border-t border-white/10 pt-6">
                      <div className="flex justify-between text-white/60">
                        <span>{selectedZone?.name} x {quantity}</span>
                        <span>Rs {(selectedZone?.price * quantity).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Platform Fee ({commissionRate}%)</span>
                        <span>Rs {platformFee.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-2">
                        <div>
                          <span className="text-white font-bold text-base block">Total</span>
                          <span className="text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase mt-0.5 block">Incl. platform fee</span>
                        </div>
                        <span className="text-2xl font-black text-white leading-none">Rs {totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={handleProceedToPayment} 
                        disabled={selectedSeats.length !== quantity}
                        className={"w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 " + 
                          (selectedSeats.length !== quantity 
                            ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10" 
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]")}
                      >
                        Complete Booking <ArrowRight className="w-5 h-5" />
                      </button>
                      {selectedSeats.length !== quantity && (
                        <p className="text-center text-xs text-red-400 mt-3 font-medium">Please select {quantity - selectedSeats.length} more table(s)</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/30 pt-2">
                      <Shield className="w-4 h-4" />
                      <span>Secured by Razorpay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      {/* Bottom Floating Bar for Checkout */}
      <AnimatePresence>
        
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={() => toast.success(`Logged in successfully! Added ${quantity} tickets to booking.`)}
      />
    </div>
  );
}
