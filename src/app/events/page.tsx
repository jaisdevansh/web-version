import EventsCarousel from '@/components/shared/EventsCarousel';
import SmoothScroll from '@/components/shared/SmoothScroll';
import AllEventsList from '@/components/events/AllEventsList';

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
        
        {/* Filter and Grid of Events */}
        <AllEventsList />
        
      </main>
    </SmoothScroll>
  );
}
