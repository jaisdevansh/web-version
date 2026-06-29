'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Users, Zap, CheckCircle2, Minus, Plus, ArrowRight, Shield, RefreshCw, Armchair } from 'lucide-react';
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

  // Generate a mock seat map layout based on the zone capacity
  const seatLayout = useMemo(() => {
    if (!selectedZone) return [];
    const total = selectedZone.capacity;
    const cols = 10;
    const rows = Math.ceil(total / cols);
    const layout = [];
    let seatIndex = 1;
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + (r % 26)) + (r >= 26 ? Math.floor(r/26) : '');
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        if (seatIndex > total) break;
        const seatId = rowLabel + c;
        // Deterministically mock some sold seats based on bookedCount
        // (Since backend doesn't tell us WHICH specific seats are sold, we scatter them)
        const isSold = (seatIndex % Math.max(1, Math.floor(total / Math.max(1, selectedZone.bookedCount)))) === 0 && seatIndex <= (selectedZone.bookedCount * Math.max(1, Math.floor(total / Math.max(1, selectedZone.bookedCount))));
        rowSeats.push({ id: seatId, isSold: isSold || false });
        seatIndex++;
      }
      layout.push({ row: rowLabel, seats: rowSeats });
    }
    return layout;
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
      toast.error('This seat is already booked.');
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
      toast.error('Please select exactly ' + quantity + ' seat' + (quantity > 1 ? 's' : '') + ' before proceeding.');
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

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans">
      <div className="sticky top-0 z-50 bg-[#05050A]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => step === 'seats' ? setStep('zone') : router.back()} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />{step === 'seats' ? 'Back to Zones' : 'Back'}
          </button>
          <div className="text-center">
            <h1 className="text-sm font-semibold text-white truncate max-w-xs">{event.title}</h1>
            <p className="text-xs text-white/40">{fd}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className={"w-2 h-2 rounded-full animate-pulse " + (isFetching ? "bg-amber-400" : "bg-emerald-400")} />
            <span className="hidden sm:block">{isFetching ? "Syncing..." : "Live"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          
          {step === 'zone' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">1. Select Zone / Ticket</h2>
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <RefreshCw className={"w-3 h-3 " + (isFetching ? "animate-spin" : "")} /><span>Updates every 5s</span>
                </div>
              </div>
              {zones.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">No zones available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {zones.map((zone, idx) => {
                      const available = zone.capacity - zone.bookedCount;
                      const pct = Math.min(100, Math.round((zone.bookedCount / Math.max(zone.capacity, 1)) * 100));
                      const isFull = available <= 0;
                      const isSel = selectedZone?._id === zone._id || selectedZone?.name === zone.name;
                      const almostFull = !isFull && available <= 5;
                      return (
                        <motion.div key={zone._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                          onClick={() => handleSelectZone(zone)}
                          className={"relative rounded-2xl border-2 p-5 transition-all duration-200 select-none " + (isFull ? "border-white/10 bg-white/[0.02] opacity-50 cursor-not-allowed" : isSel ? "border-violet-500 bg-violet-500/10 cursor-pointer" : "border-white/10 bg-white/[0.03] hover:border-white/25 cursor-pointer")}
                        >
                          {isSel && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3"><CheckCircle2 className="w-5 h-5 text-violet-400" /></motion.div>)}
                          {isFull && !isSel && (<span className="absolute top-3 right-3 text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5">FULL</span>)}
                          {almostFull && !isSel && (<span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">{available} left</span>)}
                          <h3 className={"font-bold text-lg mb-1 " + (isFull ? "text-white/40" : "text-white")}>{zone.name}</h3>
                          {zone.description && <p className="text-xs text-white/40 mb-3">{zone.description}</p>}
                          {zone.perks && zone.perks.length > 0 && (
                            <ul className="mb-3 space-y-1">
                              {zone.perks.slice(0, 3).map((p: string, i: number) => <li key={i} className="flex items-center gap-1.5 text-xs text-white/50"><Zap className="w-3 h-3 text-violet-400 shrink-0" />{p}</li>)}
                            </ul>
                          )}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-white/30 mb-1">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{zone.bookedCount} / {zone.capacity}</span><span>{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: pct + "%" }} transition={{ duration: 0.6 }} className={"h-full rounded-full " + (pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500")} />
                            </div>
                          </div>
                          <div className={"text-2xl font-black " + (isFull ? "text-white/30" : isSel ? "text-violet-300" : "text-white")}>
                            {zone.price > 0 ? ("Rs " + zone.price.toLocaleString("en-IN")) : "FREE"}
                            <span className="text-xs font-normal text-white/30 ml-1">/ person</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {step === 'seats' && selectedZone && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">2. Select Your Seats</h2>
                <div className="text-sm font-semibold text-violet-400">
                  {selectedSeats.length} / {quantity} Selected
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mb-8 text-xs font-semibold uppercase tracking-wider text-white/50">
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded border border-white/20 bg-white/5" />Available</div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-violet-600 border border-violet-500" />Selected</div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-red-500/20 border border-red-500/30" />Booked</div>
                </div>

                {/* Stage Indicator */}
                <div className="w-3/4 mx-auto h-8 border-b-2 border-white/20 rounded-[100%] shadow-[0_20px_20px_-15px_rgba(255,255,255,0.1)] flex items-end justify-center pb-2 mb-10 text-xs font-bold text-white/30 tracking-[0.2em] uppercase">STAGE / DJ</div>

                {/* Seat Grid */}
                <div className="overflow-x-auto pb-4">
                  <div className="min-w-max flex flex-col gap-3 mx-auto items-center">
                    {seatLayout.map((row) => (
                      <div key={row.row} className="flex items-center gap-3">
                        <div className="w-6 text-center text-xs font-bold text-white/30">{row.row}</div>
                        <div className="flex gap-2">
                          {row.seats.map(seat => {
                            const isSelected = selectedSeats.includes(seat.id);
                            return (
                              <button key={seat.id} onClick={() => handleSeatClick(seat.id, seat.isSold)} disabled={seat.isSold}
                                className={"relative w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all " + 
                                  (seat.isSold ? "bg-red-500/10 border border-red-500/20 text-red-500/50 cursor-not-allowed" : 
                                  isSelected ? "bg-violet-600 border border-violet-500 text-white shadow-lg shadow-violet-600/30 -translate-y-1" : 
                                  "bg-white/[0.03] border border-white/10 text-white/60 hover:border-white/30 hover:text-white")}
                              >
                                {seat.isSold ? '✕' : seat.id.replace(/[A-Z]/, '')}
                              </button>
                            );
                          })}
                        </div>
                        <div className="w-6 text-center text-xs font-bold text-white/30">{row.row}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="bg-violet-600/10 border-b border-violet-500/20 px-6 py-4">
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Order Summary</p>
              <h3 className="font-bold text-white truncate">{event.title}</h3>
              <p className="text-xs text-white/40 mt-0.5">{fd}</p>
            </div>
            <div className="px-6 py-5 space-y-6">
              
              {selectedZone ? (
                <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-violet-400 font-semibold mb-0.5 uppercase tracking-wider">Selected Zone</p>
                      <p className="font-bold text-white">{selectedZone.name}</p>
                    </div>
                    {step === 'seats' && <button onClick={() => setStep('zone')} className="text-xs font-semibold text-violet-400 hover:text-violet-300 underline">Change</button>}
                  </div>
                  <p className="text-sm text-white/50 mt-1">{selectedZone.price > 0 ? ("Rs " + selectedZone.price.toLocaleString("en-IN") + " x " + quantity) : "Free Entry"}</p>
                </div>
              ) : (
                <div className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-4 text-center">
                  <p className="text-sm text-white/30">Select a zone to continue</p>
                </div>
              )}

              {selectedZone && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">Guests</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setQuantity(q => Math.max(1, q - 1)); setSelectedSeats([]); }} disabled={quantity <= 1} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-violet-500 hover:text-violet-400 transition disabled:opacity-30 disabled:cursor-not-allowed"><Minus className="w-4 h-4" /></button>
                    <span className="text-3xl font-light w-10 text-center">{quantity}</span>
                    <button onClick={() => { const a = selectedZone.capacity - selectedZone.bookedCount; if (quantity >= a) { toast.warning("Only " + a + " spots available."); return; } setQuantity(q => Math.min(20, q + 1)); setSelectedSeats([]); }} className="w-10 h-10 rounded-full border border-violet-500 text-violet-400 flex items-center justify-center hover:bg-violet-500 hover:text-white transition"><Plus className="w-4 h-4" /></button>
                  </div>
                  <p className="text-xs text-white/30 mt-2">{selectedZone.capacity - selectedZone.bookedCount} spots remaining</p>
                </div>
              )}

              {selectedZone && step === 'seats' && (
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Seat Numbers</p>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(id => (
                        <div key={id} className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">{id}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/30">Please select {quantity} seat{quantity > 1 ? 's' : ''} on the map.</p>
                  )}
                </div>
              )}

              {selectedZone && (
                <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/50"><span>{selectedZone.name} x {quantity}</span><span>Rs {(selectedZone.price * quantity).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-white/50"><span>Platform Fee ({commissionRate}%)</span><span>Rs {platformFee.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/10"><span>Total</span><span className="text-violet-300">Rs {totalPrice.toLocaleString("en-IN")}</span></div>
                </div>
              )}

              {step === 'zone' ? (
                <button id="choose-seats-btn" onClick={() => setStep('seats')} disabled={!selectedZone}
                  className={"w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 " + (!selectedZone ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 active:scale-[0.98]")}>
                  Choose Seats <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button id="confirm-selection-btn" onClick={handleProceedToPayment} disabled={selectedSeats.length !== quantity}
                  className={"w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 " + (selectedSeats.length !== quantity ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 active:scale-[0.98]")}>
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
              )}
              
              <p className="flex items-center justify-center gap-1.5 text-xs text-white/20"><Shield className="w-3.5 h-3.5" />Secured by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}