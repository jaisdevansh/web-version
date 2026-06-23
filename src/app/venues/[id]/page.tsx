'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Star, MapPin, Navigation, Calendar, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || 'e6f13848c19246eab1bef2662e18ebd0';

export default function VenueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: venueData, isLoading: isLoadingVenue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/venues/host/${venueId}`);
      return res.data.data || res.data;
    },
    enabled: !!venueId,
  });

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/events');
      return res.data.data || res.data;
    },
  });

  if (isLoadingVenue || isLoadingEvents) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const events = eventsData?.filter((ev: any) => {
    const evHostId = ev.hostId?._id || ev.hostId;
    return evHostId && String(evHostId) === String(venueId);
  }) || [];

  const displayImage = venueData?.heroImage || venueData?.image || venueData?.coverImage || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=800';
  const displayName = venueData?.name || venueData?.businessName || venueData?.venueName || 'Exclusive Venue';
  const displayType = venueData?.venueType || venueData?.type || venueData?.category || 'Nightclub';
  const displayRules = venueData?.rules || venueData?.dressCode || 'Smart Elegant';
  const displayCapacity = venueData?.capacity || venueData?.maxCapacity;
  const displayDesc = venueData?.description || venueData?.about || venueData?.bio || "Experience the pinnacle of nightlife. Monochromatic luxury interior with architectural lighting and world-class acoustics.";
  const displayAddress = venueData?.address || venueData?.location?.address || venueData?.fullAddress || 'Premium Lounge & Nightclub';

  const realLat = parseFloat(venueData?.coordinates?.lat || venueData?.location?.coordinates?.lat || venueData?.lat);
  const realLng = parseFloat(venueData?.coordinates?.lng || venueData?.location?.coordinates?.lng || venueData?.lng);
  const safeLat = realLat || 28.6139;
  const safeLng = realLng || 77.2090;
  const staticMapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=320&center=lonlat:${safeLng},${safeLat}&zoom=15.5&marker=lonlat:${safeLng},${safeLat};color:%237c4dff;size:large&apiKey=${GEOAPIFY_KEY}`;

  const venueMedia = venueData?.media || [];
  const allImages = [displayImage];
  if (venueMedia.length > 0) {
    const interiorImages = venueMedia
      .filter((m: any) => (m.category === 'interior' || !m.category) && m.type !== 'video')
      .map((m: any) => m.url);
    allImages.push(...interiorImages);
  }

  const interior = venueMedia.filter((m: any) => m.category === 'interior' || !m.category);
  const pastEvents = venueMedia.filter((m: any) => m.category === 'events');

  return (
    <div className="min-h-screen bg-[#050505] text-white -mx-4 sm:mx-0">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full">
        <img 
          src={displayImage} 
          alt={displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">{displayName}</h1>
          <div className="flex items-center text-yellow-500 mb-4">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <span className="text-white/50 text-sm ml-2">4.9 (124 reviews)</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 py-4 border-y border-white/10 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-white/40 mb-1">TYPE</p>
            <p className="font-medium">{displayType}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-white/40 mb-1">DRESS CODE</p>
            <p className="font-medium">{displayRules}</p>
          </div>
          {displayCapacity && (
            <div>
              <p className="text-xs font-bold tracking-widest text-white/40 mb-1">CAPACITY</p>
              <p className="font-medium">{displayCapacity} PAX</p>
            </div>
          )}
        </div>

        <p className="text-white/70 leading-relaxed mb-10">
          {displayDesc}
        </p>

        {/* Location Section */}
        <h3 className="text-xl font-bold mb-4">Location</h3>
        <div className="bg-[#0a0a14] rounded-2xl overflow-hidden mb-10 border border-white/5">
          <div className="h-40 w-full relative">
            <img src={staticMapUrl} alt="Map" className="w-full h-full object-cover" />
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold">{displayName}</h4>
              <p className="text-sm text-white/40 mt-1">{displayAddress}</p>
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white">
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </Button>
            </a>
          </div>
        </div>

        {/* Media Gallery */}
        {venueMedia.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">Gallery</h3>
            
            {interior.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white/70 mb-3 flex items-center">
                  Club Interior
                  <span className="ml-2 bg-white/10 px-2 py-0.5 rounded text-xs">{interior.length}</span>
                </h4>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {interior.map((m: any, i: number) => (
                    <img key={i} src={m.url} alt="Interior" className="w-40 h-28 object-cover rounded-xl shrink-0 snap-start border border-white/10" />
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white/70 mb-3 flex items-center">
                  Past Events
                  <span className="ml-2 bg-white/10 px-2 py-0.5 rounded text-xs">{pastEvents.length}</span>
                </h4>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {pastEvents.map((m: any, i: number) => (
                    <div key={i} className="w-40 h-28 shrink-0 snap-start relative rounded-xl overflow-hidden border border-white/10">
                      <img src={m.url} alt="Past Event" className="w-full h-full object-cover" />
                      {m.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <PlayCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exclusive Events */}
        <div className="mb-24">
          <h3 className="text-xl font-bold mb-4">Exclusive Events</h3>
          {events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any) => {
                const dateObj = new Date(event.date);
                const price = event.tickets?.length > 0 ? event.tickets[0].price : 2000;
                
                return (
                  <Link href={`/dashboard/events/${event._id}`} key={event._id}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-primary/50 transition-colors">
                      <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xs font-bold text-primary uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-xl font-black">{dateObj.getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 line-clamp-1">{event.title}</h4>
                        <p className="text-sm text-white/50">{event.time || '10:00 PM'} • ₹{price} onwards</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#111] rounded-2xl p-8 text-center border border-white/5">
              <Calendar className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No upcoming events scheduled right now.</p>
            </div>
          )}
        </div>
      </div>

      {events.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-50">
          <Link href={`/dashboard/events/${events[0]._id}`}>
            <Button className="w-full max-w-md mx-auto flex h-14 text-lg font-bold bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20">
              Book Next Event
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
