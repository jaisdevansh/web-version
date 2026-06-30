'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Users, Zap, CheckCircle2, Minus, Plus, ArrowRight, Shield, RefreshCw, Music } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';

interface Zone {
  _id: string;
  name: string;
  type?: string;
  price: number;
  capacity: number;
  bookedCount: number;
  description?: string;
  perks?: string[];
}

export default function SeatAllocationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'zone' | 'seats'>('zone');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const { data: event, isLoading, isFetching } = useQuery({
    queryKey: ['event-seats', eventId],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/events/' + eventId + '/full');
      return res.data?.data || null;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  const zones: Zone[] = useMemo(() => {
    if (!event) return [];
    const floors: any[] = event.floors || [];
    const tickets: any[] = event.tickets || [];
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
  }, [event]);

  // Generate continuous seat numbers 1 to capacity
  const seatsArray = useMemo(() => {
    if (!selectedZone) return [];
    const total = selectedZone.capacity;
    const arr = [];
    for (let i = 1; i <= total; i++) {
      // Deterministically mock sold seats for demo based on bookedCount
      const isSold = (i % Math.max(1, Math.floor(total / Math.max(1, selectedZone.bookedCount)))) === 0 && i <= (selectedZone.bookedCount * Math.max(1, Math.floor(total / Math.max(1, selectedZone.bookedCount))));
      arr.push({ id: String(i), isSold: isSold || false });
    }
    return arr;
  }, [selectedZone]);

  useEffect(() => {
    if (!selectedZone || zones.length === 0) return;
    const updated = zones.find(z => z._id === selectedZone._id || z.name === selectedZone.name);
    if (!updated) return;
    const available = updated.capacity - updated.bookedCount;
    if (available <= 0) {
      toast.error(updated.name + ' just sold out! Please select another zone.');
      setSelectedZone(null); setQuantity(1); setStep('zone');
    } else if (quantity > available) {
      setQuantity(available);
      toast.warning('Only ' + available + ' spot' + (available > 1 ? 's' : '') + ' left!');
      setSelectedZone(updated);
    } else { setSelectedZone(updated); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const commissionRate = Number(event?.hostId?.commissionRate ?? 10);
  const basePrice = selectedZone ? selectedZone.price * quantity : 0;
  const platformFee = Math.round(basePrice * (commissionRate / 100));
  const totalPrice = basePrice + platformFee;

  const handleSelectZone = useCallback((zone: Zone) => {
    if (zone.capacity - zone.bookedCount <= 0) return;
    setSelectedZone(zone); setQuantity(1); setSelectedSeats([]); setStep('zone');
  }, []);

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

  const handleProceedToPayment = () => {
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

  if (isLoading) return (
    <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Loading availability...</p>
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#05050A] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <button onClick={() => router.back()} className="text-violet-400 underline">Go back</button>
      </div>
    </div>
  );

  const fd = new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  // -----------------------------------------------------
  // RENDER SEAT MAP (Match reference image exactly)
  // -----------------------------------------------------
  if (step === 'seats' && selectedZone) {
    const availableSpots = selectedZone.capacity - selectedZone.bookedCount;
    return (
      <div className="min-h-screen bg-[#05050A] text-white font-sans pb-24 relative">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#05050A]/90 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => setStep('zone')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
              <ChevronLeft className="w-4 h-4" />Back
            </button>
            <div className="text-center">
              <h1 className="text-sm font-semibold text-white truncate max-w-xs">{event.title}</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-0.5">STEP 2 OF 2</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center font-bold text-xs bg-blue-600 rounded-full text-white">
              2
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              
              <div className="flex items-center justify-between mb-4">
                <div>
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
                    <h3 className="text-xl font-bold text-white">{selectedZone.name}</h3>
                  </div>
                  <p className="text-sm text-white/40 ml-4 mt-1.5">Selected Range • {selectedZone.price > 0 ? "₹" + selectedZone.price.toLocaleString("en-IN") : "FREE"}</p>
                </div>
                <div className="text-sm font-medium text-white/40 bg-white/5 px-3 py-1.5 rounded-lg">{availableSpots} / {selectedZone.capacity} left</div>
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

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0A0A12] overflow-hidden shadow-2xl">
              <div className="bg-blue-600/10 border-b border-blue-500/20 px-6 py-5">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1.5">Order Summary</p>
                <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>
                <p className="text-sm text-blue-400 mt-1">{fd}</p>
              </div>
              
              <div className="px-6 py-6 space-y-6">
                
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Selected Zone</p>
                  <p className="font-bold text-lg text-white">{selectedZone.name}</p>
                  <p className="text-sm text-white/60 mt-1">{selectedZone.price > 0 ? ("Rs " + selectedZone.price.toLocaleString("en-IN") + " x " + quantity) : "Free Entry"}</p>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Selected Tables</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(id => (
                        <span key={id} className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm font-bold">{id}</span>
                      ))}
                    </div>
                  </div>
                )}

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

      </div>
    );
  }

  // -----------------------------------------------------
  // RENDER ZONE SELECTOR (Default Step)
  // -----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#05050A]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <div className="text-center">
            <h1 className="text-sm font-semibold text-white truncate max-w-xs">{event.title}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-0.5">STEP 1 OF 2</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center font-bold text-xs bg-blue-600 rounded-full text-white">
            1
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Selections */}
        <div className="lg:col-span-2 space-y-10">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            {/* Select Date & Guests Row (Desktop friendly) */}
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
                    <RefreshCw className={"w-3 h-3 " + (isFetching ? "animate-spin" : "")} /><span>Updates live</span>
                  </div>
                </div>
                <button className="text-sm text-blue-500 font-medium hover:text-blue-400 transition-colors">View Floor Map &rarr;</button>
              </div>
              
              {zones.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">No zones available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {zones.map((zone, idx) => {
                      const available = zone.capacity - zone.bookedCount;
                      const isFull = available <= 0;
                      const isSel = selectedZone?._id === zone._id || selectedZone?.name === zone.name;
                      
                      return (
                        <motion.div 
                          key={zone._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                          onClick={() => handleSelectZone(zone)}
                          className={"relative rounded-2xl p-5 transition-all duration-200 cursor-pointer border " + 
                            (isFull ? "border-white/5 bg-white/[0.02] opacity-50" : 
                            isSel ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]" : 
                            "border-white/10 bg-[#0F0F16] hover:border-white/20")}
                        >
                          {/* Card Content */}
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
                            ) : !isFull && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            )}
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
              <p className="text-sm text-blue-400 mt-1">{fd}</p>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              
              {selectedZone ? (
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Selected Zone</p>
                  <p className="font-bold text-lg text-white">{selectedZone.name}</p>
                  <p className="text-sm text-white/60 mt-1">{selectedZone.price > 0 ? ("Rs " + selectedZone.price.toLocaleString("en-IN") + " x " + quantity) : "Free Entry"}</p>
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
    </div>
  );
}