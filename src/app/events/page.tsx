import EventsCarousel from '@/components/shared/EventsCarousel';
import { FeaturedEventsCarousel } from '@/components/about/FeaturedEventsCarousel';

export const metadata = {
  title: 'Events',
  description: 'Explore the best events happening around you.',
};

export default function EventsPage() {
  return (
    <main className="w-full min-h-screen pt-24 bg-[#050B14]">
      {/* Happening Around You Carousel */}
      <EventsCarousel />
      
      {/* Featured 3D Circular Events */}
      <FeaturedEventsCarousel />
      
      {/* Add additional event sections here in the future if needed */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center text-white/50">
        <p>More events coming soon...</p>
      </div>
    </main>
  );
}
