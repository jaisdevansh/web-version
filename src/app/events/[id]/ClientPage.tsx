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
import { EVENTS } from '@/lib/data';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const event = EVENTS.find(e => e.id === eventId);
  
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
  const totalPrice = event.tickets.reduce((sum, ticket) => sum + (ticket.price * (ticketQuantities[ticket.id] || 0)), 0);

  const handleAddToCart = () => {
    if (totalTickets === 0) return;
    
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      // Proceed to checkout
      alert(`Added ${totalTickets} tickets to booking! Total: ₹${totalPrice}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
      {/* Header Banner */}
      <div className="w-full max-w-6xl mx-auto pt-10 px-4 md:px-8">
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
              {eventImages.map((_, idx) => (
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
              {event.highlights.map((hi, i) => (
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
                  <h4 className="font-bold text-white">Gates open at {event.date.split(',')[2]?.trim() || event.date}</h4>
                  <p className="text-sm text-blue-400 hover:underline cursor-pointer">View full schedule & timeline</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto mt-1" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-2xl font-black text-white">
                {event.price.split(' ')[0]} <span className="text-sm font-medium text-white/40 line-through tracking-normal ml-1"></span>
                <span className="text-sm font-medium text-white/40 block -mt-1">onwards</span>
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
                    {ticket.desc.map((item, idx) => (
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
              <Button onClick={handleAddToCart} className="h-14 px-8 md:px-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
                ADD TO BOOKING
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
