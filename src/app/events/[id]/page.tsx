'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Loader2, Calendar, MapPin, Users, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Host {
  _id: string;
  name: string;
  profileImage: string;
}

interface EventFull {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  coverImage: string;
  images: string[];
  status: string;
  hostId: Host;
  description: string;
  houseRules: string[];
  tickets: any[];
  floors: any[];
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/events/${eventId}/full`);
      return res.data.data as EventFull;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <p className="text-xl text-destructive">Event not found or failed to load.</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const event = data;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full md:h-[50vh]">
        <div className="absolute inset-0">
          <img
            src={event.coverImage || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200'}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container relative mx-auto flex h-full items-end px-4 pb-8 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl space-y-4"
          >
            <div className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md">
              {event.status === 'LIVE' ? 'Live Now' : 'Upcoming'}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-200">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                {event.startTime} - {event.endTime || 'Late'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto mt-8 px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">About the Event</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="whitespace-pre-wrap">{event.description || 'Join us for an unforgettable night of music and vibes.'}</p>
              </div>
            </section>

            {/* House Rules */}
            {event.houseRules && event.houseRules.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">House Rules</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {event.houseRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start rounded-md bg-secondary/50 p-3 text-sm">
                      <ShieldCheck className="mr-3 h-5 w-5 shrink-0 text-primary" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Host Card */}
              <Card className="border-border/50 bg-secondary/20 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={event.hostId?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                      alt="Host" 
                      className="h-12 w-12 rounded-full border border-primary/20 object-cover" 
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Hosted by</p>
                      <p className="font-semibold text-foreground">{event.hostId?.name || 'Collective Underground'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Card */}
              <Card className="border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Reserve Your Spot</h3>
                    <p className="text-sm text-muted-foreground">
                      Tickets and VIP tables are selling fast.
                    </p>
                  </div>
                  
                  <Link href={`/events/${eventId}/checkout`} className="block w-full">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
