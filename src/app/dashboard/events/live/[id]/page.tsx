'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Loader2, Utensils, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Subcomponents
import MenuTab from './components/MenuTab';

export default function LiveEventHubPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['activeEvent', eventId],
    queryFn: async () => {
      // In mobile, getActiveEvent checks if user has a booking and if event is live.
      // But we can also just fetch event basic details
      const res = await axiosInstance.get(`/user/events/${eventId}/basic`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <p className="text-destructive">Unable to join Live Event. Ensure you are checked in.</p>
        <Button onClick={() => router.back()} className="mt-4" variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-8 max-w-5xl min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-primary">
            <img src={event.coverImage || 'https://via.placeholder.com/150'} alt="Event" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-primary font-semibold text-sm flex items-center">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              LIVE HUB
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[50vh]">
        <MenuTab eventId={eventId} hostId={event.hostId?._id || event.hostId} />
      </div>
    </div>
  );
}
