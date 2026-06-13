'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, Calendar, ArrowRight, Loader2, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/bookings');
      return res.data.data;
    },
    enabled: mounted && isAuthenticated,
  });

  const { data: activeEvent, isLoading: isLoadingActiveEvent } = useQuery({
    queryKey: ['activeEvent'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/active-event');
      return res.data.data; // will be null if no active event
    },
    enabled: mounted && isAuthenticated,
  });

  if (!mounted || !isAuthenticated) return null;

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  const upcomingBookings = bookings.filter((b: any) => b.status === 'upcoming' || b.status === 'checked-in');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>

      {activeEvent && (
        <Card className="border-primary/50 bg-primary/5 shadow-lg shadow-primary/10">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg">You are checked in!</h3>
                <p className="text-sm text-muted-foreground">Access the live hub for {activeEvent.title}</p>
              </div>
            </div>
            <Link href={`/events/live/${activeEvent._id}`}>
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                <PlayCircle className="w-5 h-5 mr-2" />
                Enter Live Hub
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                <p className="text-xs text-muted-foreground">Ready for entry</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passes</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground">Lifetime bookings</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>
              Your recent event reservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoadingBookings ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
              ) : upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming bookings. <Link href="/events" className="text-primary hover:underline">Discover events</Link></p>
              ) : (
                upcomingBookings.slice(0, 3).map((booking: any) => (
                  <div key={booking._id} className="flex items-center">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {booking.eventId?.coverImage ? (
                        <img src={booking.eventId.coverImage} className="w-full h-full object-cover" alt="Event" />
                      ) : (
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{booking.eventId?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.eventId?.date).toLocaleDateString()} • {booking.ticketType} x {booking.guestCount}
                      </p>
                      <div className="inline-block mt-1 bg-secondary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-muted-foreground">
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {bookings.length > 0 && (
              <Button variant="ghost" className="w-full mt-6" onClick={() => router.push('/dashboard/tickets')}>
                View All Bookings <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your profile and orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between border-border" variant="outline" onClick={() => router.push('/events')}>
              Discover Events <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between border-border" variant="outline" onClick={() => router.push('/dashboard/tickets')}>
              My Tickets <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between border-border" variant="outline" onClick={() => router.push('/dashboard/orders')}>
              Food & Drink Orders <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between border-border" variant="outline" onClick={() => router.push('/profile')}>
              Account Settings <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
