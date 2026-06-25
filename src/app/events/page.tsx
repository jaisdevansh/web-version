import EventsCarousel from '@/components/shared/EventsCarousel';
import { FeaturedEventsCarousel } from '@/components/about/FeaturedEventsCarousel';
import SmoothScroll from '@/components/shared/SmoothScroll';

export const metadata = {
  title: 'Events',
  description: 'Explore the best events happening around you.',
};

export default function EventsPage() {
  return (
    <SmoothScroll>
      <main className="w-full min-h-screen pt-24 bg-[#050B14]">
        {/* Happening Around You Carousel */}
        <EventsCarousel />
        
        {/* Featured 3D Circular Events */}
        <FeaturedEventsCarousel />
        
      </main>
    </SmoothScroll>
  );
}
