'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Ticket, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myBookingsFull'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/bookings');
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="text-destructive text-center p-8">Failed to load bookings.</div>;
  }

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage your event reservations and table passes.</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="bg-card/50 border-dashed border-border p-12 text-center">
          <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
          <p className="text-sm text-muted-foreground mb-6">You haven't reserved any tickets or tables.</p>
          <Link href="/events">
            <Button className="bg-primary hover:bg-primary/90">Discover Events</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking: any) => (
            <Card key={booking._id} className="bg-card hover:border-primary/50 transition-colors flex flex-col overflow-hidden relative">
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                  ['upcoming', 'approved', 'confirmed'].includes(booking.status?.toLowerCase()) ? 'bg-primary/20 text-primary' :
                  booking.status === 'checked-in' ? 'bg-green-500/20 text-green-500' :
                  booking.status === 'completed' ? 'bg-secondary text-muted-foreground' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {['upcoming', 'approved', 'confirmed'].includes(booking.status?.toLowerCase()) ? 'Approved' : booking.status}
                </span>
              </div>
              <div className="h-32 w-full bg-muted relative">
                {booking.eventId?.coverImage ? (
                  <img src={booking.eventId.coverImage} className="w-full h-full object-cover" alt="Event Cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Calendar className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between -mt-6 relative z-10">
                <div>
                  <h3 className="font-bold text-xl mb-1">{booking.eventId?.title}</h3>
                  <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(booking.eventId?.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {booking.eventId?.startTime}
                    </div>
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 mr-2" />
                      {booking.ticketType} • {booking.guestCount} Guest(s)
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                  <div className="font-bold text-lg">
                    ₹{booking.pricePaid}
                  </div>
                  {['upcoming', 'approved', 'confirmed', 'checked-in'].includes(booking.status?.toLowerCase()) && (
                    <Link href={`/events/live/${booking.eventId?._id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/10">
                        Live Hub <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
