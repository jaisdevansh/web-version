'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface EventData {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  coverImage: string;
  displayPrice: number | null;
  occupancy: string;
  venueName?: string;
}

const fetchEvents = async (page: number = 1) => {
  const response = await axiosInstance.get(`/user/events?page=${page}&limit=20`);
  return response.data;
};

export default function EventsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', page],
    queryFn: () => fetchEvents(page),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-destructive">Failed to load events.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  const events: EventData[] = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col justify-between space-y-4 md:flex-row md:items-end md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Discover Events</h1>
          <p className="text-muted-foreground mt-2">Find the best nightlife experiences near you.</p>
        </div>
      </div>

      {/* Featured Slides / Banners */}
      <div className="mb-10 flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {[ '/slide2.png', '/slide3.png' ].map((src, idx) => (
          <div key={idx} className="shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] xl:w-[35vw] aspect-[2/1] snap-center rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-muted/30">
            <img src={src} alt={`Featured Slide ${idx + 2}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="flex h-[30vh] items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
          <p className="text-muted-foreground">No events found at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex h-full flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/20">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  <div className="absolute right-2 top-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    {event.occupancy} Full
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                  {event.venueName && (
                    <CardDescription className="flex items-center text-xs mt-1">
                      <MapPin className="mr-1 h-3 w-3" />
                      {event.venueName}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="flex-1 p-4 pt-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' • '}
                      {event.startTime}
                    </div>
                    {event.displayPrice !== null && (
                      <div className="flex items-center font-medium text-foreground">
                        From ₹{event.displayPrice}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Link href={`/events/${event._id}`} className="w-full">
                    <Button className="w-full bg-primary/90 hover:bg-primary">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
