'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { initiateRazorpayPayment, loadRazorpayScript, PaymentOptions, BookingData } from '@/services/razorpay';
import { Loader2, Plus, Minus, CreditCard, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [guests, setGuests] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch event full details to get tickets and floors
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/events/${eventId}/full`);
      return res.data.data;
    },
  });

  useEffect(() => {
    // Preload Razorpay script to make payment process faster
    loadRazorpayScript();
    
    if (event?.tickets?.length > 0 && !selectedTicket) {
      setSelectedTicket(event.tickets[0]);
    } else if (event?.floors?.length > 0 && !selectedTicket) {
      setSelectedTicket(event.floors[0]);
    }
  }, [event, selectedTicket]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <p className="text-destructive mb-4">Failed to load checkout details.</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const commissionRate = event.hostId?.commissionRate || 10;
  const items = event.tickets?.length > 0 ? event.tickets : event.floors || [];

  const handleCheckout = async () => {
    if (!selectedTicket) return;
    
    setIsProcessing(true);
    
    const basePrice = selectedTicket.price * guests;
    const serviceFee = Math.round(basePrice * (commissionRate / 100));
    const totalPrice = basePrice + serviceFee;
    
    // Convert to paise for Razorpay (actually razorpay service handles creating order on backend, we just send amount)
    // Wait, backend create-order expects amount in INR usually.
    const paymentOptions: PaymentOptions = {
      amount: totalPrice,
      receipt: `rcpt_${eventId}_${Date.now()}`,
      description: `Booking for ${event.title}`,
    };

    const bookingData: BookingData = {
      eventId: event._id,
      ticketType: selectedTicket.type || selectedTicket.name,
      zone: selectedTicket.name || selectedTicket.type,
      pricePaid: totalPrice,
      guestCount: guests,
      hostId: event.hostId?._id,
    };

    const result = await initiateRazorpayPayment(paymentOptions, bookingData);

    setIsProcessing(false);

    if (result.success) {
      toast.success('Booking confirmed successfully!');
      router.push('/dashboard/bookings');
    } else {
      toast.error(result.error || 'Payment failed. Please try again.');
    }
  };

  const currentPrice = selectedTicket ? selectedTicket.price * guests : 0;
  const serviceFee = Math.round(currentPrice * (commissionRate / 100));
  const total = currentPrice + serviceFee;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-4xl min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col - Selection */}
        <div className="md:col-span-2 space-y-8">
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Select Ticket / Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item: any, idx: number) => {
                  const isSelected = selectedTicket?._id === item._id || selectedTicket?.name === item.name;
                  const isSoldOut = (item.bookedCount || item.sold || 0) >= (item.capacity || 0);

                  return (
                    <div
                      key={idx}
                      onClick={() => !isSoldOut && setSelectedTicket(item)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : isSoldOut 
                            ? 'border-border/50 opacity-50 cursor-not-allowed' 
                            : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <Ticket className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className="font-semibold text-lg">{item.name || item.type}</h3>
                        </div>
                        {isSoldOut && <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-1 rounded">SOLD OUT</span>}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {item.description || 'Standard access'}
                      </p>
                      
                      <div className="text-xl font-bold">
                        {item.price > 0 ? `₹${item.price}` : 'Free'}
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-3xl font-light w-12 text-center">{guests}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => setGuests(Math.min(20, guests + 1))}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Col - Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 border-primary/20 bg-card shadow-lg shadow-primary/5">
            <CardHeader className="bg-secondary/30 border-b border-border/50">
              <CardTitle className="text-lg flex flex-col">
                <span className="text-sm text-muted-foreground font-normal">Order Summary</span>
                <span className="truncate mt-1">{event.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{selectedTicket?.name || 'Selection'} x {guests}</span>
                  <span className="font-medium">₹{currentPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">₹{serviceFee}</span>
                </div>
                
                <div className="pt-3 border-t border-border flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout} 
                disabled={isProcessing || !selectedTicket || (selectedTicket.capacity <= selectedTicket.bookedCount)}
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                {isProcessing ? 'Processing...' : `Pay ₹${total}`}
              </Button>
              
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
