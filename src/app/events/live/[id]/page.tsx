'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Loader2, Utensils, Radar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Subcomponents for tabs
import MenuTab from './components/MenuTab';
import RadarTab from './components/RadarTab';
import ChatTab from './components/ChatTab';

export default function LiveEventHubPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [activeTab, setActiveTab] = useState<'menu' | 'radar' | 'chat'>('menu');

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
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <img src={event.coverImage || 'https://via.placeholder.com/150'} alt="Event" className="w-full h-full object-cover" />
          </div>
          <div>
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

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border/50 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'menu' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Utensils className="h-4 w-4 mr-2" />
          Menu & Drinks
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'radar' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Radar className="h-4 w-4 mr-2" />
          Nearby Users
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chats
        </button>
      </div>

      <div className="min-h-[50vh]">
        {activeTab === 'menu' && <MenuTab eventId={eventId} hostId={event.hostId?._id || event.hostId} />}
        {activeTab === 'radar' && <RadarTab eventId={eventId} />}
        {activeTab === 'chat' && <ChatTab />}
      </div>
    </div>
  );
}
