"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share, Utensils } from "lucide-react";
import QRCode from "react-qr-code";
import axiosInstance from "@/lib/axios";

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleNextPass = () => {
        if (carouselRef.current) {
            // Check if we are at the end, then scroll back to start, else scroll to the next one
            if (carouselRef.current.scrollLeft + carouselRef.current.clientWidth >= carouselRef.current.scrollWidth - 10) {
                carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth, behavior: 'smooth' });
            }
        }
    };

    // Next.js 15 recommendation: use React.use() for params if needed, or simply unwrap them in a useEffect if they are a Promise
    useEffect(() => {
        // In Next.js 15, params might be a promise.
        Promise.resolve(params).then(setUnwrappedParams);
    }, [params]);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!unwrappedParams?.id) return;
            try {
                const res = await axiosInstance.get(`/user/bookings/${unwrappedParams.id}`);
                setBooking(res.data.data);
            } catch (error) {
                console.error("Error fetching booking details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [unwrappedParams?.id]);

    if (loading || !unwrappedParams) {
        return <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">Loading...</div>;
    }

    if (!booking) {
        return <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">Booking not found.</div>;
    }

    const event = booking.eventId;
    
    // Some formats to match the screenshot
    let statusText = booking.status?.toUpperCase() || "CONFIRMED";
    if (['UPCOMING', 'APPROVED'].includes(statusText)) {
        statusText = 'CONFIRMED';
    }
    
    const statusColor = ['upcoming', 'approved', 'confirmed'].includes(booking.status?.toLowerCase()) ? "text-[#34d399]" : "text-white";
    const statusBg = ['upcoming', 'approved', 'confirmed'].includes(booking.status?.toLowerCase()) ? "bg-[#064e3b]" : "bg-white/10";
    
    const amount = booking.pricePaid || 0;
    
    const numberOfPasses = (booking.seatIds && booking.seatIds.length > 0) 
        ? booking.seatIds.length 
        : (booking.guests || 1);
        
    const passes = Array.from({ length: numberOfPasses }, (_, i) => {
        let seatLabel = '';
        if (booking.seatIds && booking.seatIds.length > i) {
            seatLabel = booking.seatIds[i];
        }
        const isScanned = (booking.guestsEntered !== undefined) ? booking.guestsEntered > i : booking.status === 'checked_in';
        return {
            index: i + 1,
            seatLabel,
            isScanned,
            payload: `${booking.qrPayload || booking._id}-PASS-${i + 1}${seatLabel ? '-' + seatLabel : ''}`
        };
    });
    
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col relative min-h-screen pb-32">
            
            {/* Desktop-optimized Header */}
            <div className="flex items-center justify-between p-6 lg:px-10 lg:py-8 z-10 border-b border-white/5">
                <button 
                    onClick={() => router.back()}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white/80" />
                </button>
                <h1 className="text-xl font-bold tracking-widest text-white/90 uppercase">Reservation</h1>
                <button 
                    onClick={() => {
                        const url = window.location.href;
                        if (navigator.share) {
                            navigator.share({
                                title: 'My Reservation',
                                text: `Check out my reservation for ${event?.title || 'the event'}!`,
                                url: url,
                            }).catch(console.error);
                        } else {
                            navigator.clipboard.writeText(url);
                            alert("Link copied to clipboard!");
                        }
                    }}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <Share className="w-5 h-5 text-white/80" />
                </button>
            </div>

            <div className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto hide-scrollbar">
                {/* Main 2-Column Grid on Desktop */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column: Event & Booking Details */}
                    <div className="flex-1 w-full bg-[#1a0f2e]/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
                        {/* Event Banner */}
                        <div className="h-64 lg:h-[450px] w-full bg-gradient-to-br from-indigo-900 to-purple-900 relative">
                            {event?.coverImage ? (
                                <img src={event.coverImage} className="w-full h-full object-cover opacity-80" alt="Event" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-40">
                                    <span className="text-white text-5xl font-bold tracking-widest">EC</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f2e]/95 via-[#1a0f2e]/20 to-transparent" />
                            
                            {/* Badges Floating on Image */}
                            <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                                    <span className="text-[10px] lg:text-xs font-bold tracking-[0.2em] text-[#d8b4fe] uppercase">
                                        EXCLUSIVE ACCESS
                                    </span>
                                </div>
                                <div className={`px-4 py-2 rounded-full border border-white/20 ${statusBg}/50 flex items-center backdrop-blur-md`}>
                                    <div className={`w-2 h-2 rounded-full ${statusColor} mr-2 bg-current`} />
                                    <span className={`text-[10px] lg:text-xs font-bold tracking-widest ${statusColor}`}>{statusText}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Below Banner */}
                        <div className="p-8 lg:p-10 flex flex-col gap-8">
                            <div>
                                <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2 tracking-tight">{event?.venue || 'Exclusive Venue'}</h3>
                                <p className="text-white/60 text-lg lg:text-xl font-medium">{event?.title || 'Private Event'}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-white/40 mb-2 uppercase">Date</p>
                                    <p className="text-lg text-white font-semibold">
                                        {event?.date ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-white/40 mb-2 uppercase">Guest List</p>
                                    <p className="text-lg text-white font-semibold">{booking.guests || 1} Persons</p>
                                </div>
                                
                                {booking.seatIds && booking.seatIds.length > 0 && (
                                    <div className="col-span-2 pt-4 border-t border-white/5">
                                        <p className="text-xs font-bold tracking-widest text-white/40 mb-4 uppercase">Assigned Seats</p>
                                        <div className="flex flex-wrap gap-3">
                                            {booking.seatIds.map((seat: string, idx: number) => (
                                                <div key={idx} className="bg-indigo-500/20 text-indigo-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center border border-indigo-500/30">
                                                    <span className="mr-2 opacity-60">👤</span> Seat {seat}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Ticket / QR / Actions */}
                    <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6">
                        
                        {/* Ticket Passes (QR) */}
                        <div className="bg-[#1a0f2e]/40 rounded-[2rem] border border-white/10 p-8 flex flex-col items-center shadow-2xl backdrop-blur-md">
                            <h3 className="text-lg font-bold tracking-widest text-white/80 mb-6 uppercase w-full text-center border-b border-white/5 pb-6">Access Passes</h3>
                            
                            <div className="w-full overflow-hidden">
                                <div 
                                    ref={carouselRef}
                                    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full pb-4"
                                >
                                    {passes.map((pass) => (
                                        <div key={pass.index} className="flex-none w-full snap-center flex flex-col items-center justify-center">
                                            <div className={`bg-white p-5 rounded-2xl relative transition-opacity duration-300 ${pass.isScanned ? 'opacity-60' : 'shadow-[0_0_40px_rgba(255,255,255,0.1)]'}`}>
                                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#1a0f2e] rounded-tl-xl m-1" />
                                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#1a0f2e] rounded-tr-xl m-1" />
                                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#1a0f2e] rounded-bl-xl m-1" />
                                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#1a0f2e] rounded-br-xl m-1" />
                                                <QRCode 
                                                    value={pass.payload} 
                                                    size={220}
                                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                    viewBox={`0 0 256 256`}
                                                />
                                                {pass.isScanned && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm z-10">
                                                        <span className="text-white font-black text-3xl tracking-widest uppercase -rotate-12 border-4 border-white px-6 py-3 rounded-xl shadow-2xl shadow-black">Scanned</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-center mt-6">
                                                <p className="text-white/60 text-sm font-medium tracking-wide">Pass {pass.index} of {numberOfPasses}</p>
                                                {pass.seatLabel && (
                                                    <p className="text-[#d8b4fe] font-bold text-lg mt-1 tracking-widest">SEAT: {pass.seatLabel}</p>
                                                )}
                                                <p className="text-white/30 text-xs font-mono mt-2 uppercase tracking-widest">
                                                    STX-{booking.ticketNumber?.substring(0,8) || booking._id.substring(0,8)}-{pass.index}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {passes.length > 1 && (
                                <button 
                                    onClick={handleNextPass}
                                    className="mt-2 text-white/50 text-sm flex items-center bg-white/5 hover:bg-white/10 hover:text-white transition-all px-6 py-3 rounded-full cursor-pointer active:scale-95"
                                >
                                    <span className="mr-2 text-xl">⇄</span> Swipe to view all {passes.length} passes
                                </button>
                            )}
                        </div>

                        {/* Payment & User Info */}
                        <div className="bg-[#1a0f2e]/40 rounded-[2rem] border border-white/10 p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
                            {booking.userId && (
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden shrink-0 border-2 border-white/10">
                                        {booking.userId.profileImage ? (
                                            <img src={booking.userId.profileImage} className="w-full h-full object-cover" alt="User" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                                                {booking.userId.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-[10px] font-bold tracking-widest text-white/40 mb-1 uppercase">Booked By</p>
                                        <p className="text-white text-base font-semibold">{booking.userId.name || 'User'}</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                <span className="text-white/50 font-medium tracking-wide">Amount Paid</span>
                                <span className="text-3xl font-black text-white">₹{amount}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Floating Bottom Button */}
            <div className="fixed lg:absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-20 z-20 pointer-events-none">
                <div className="max-w-6xl mx-auto w-full flex justify-end">
                    <button 
                        onClick={() => event?._id && router.push(`/dashboard/events/live/${event._id}`)}
                        className="w-full lg:w-auto lg:px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg tracking-wide transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] pointer-events-auto flex items-center justify-center lg:justify-start"
                    >
                        <Utensils className="w-5 h-5 mr-3" /> View Event Menu
                    </button>
                </div>
            </div>

        </div>
        </div>
    );
}
