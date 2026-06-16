import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VenuesPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Our Venues</h1>
      <p className="text-xl text-white/60 mb-8 max-w-lg text-center">
        We are currently curating a list of the most exclusive venues. Check back soon!
      </p>
      <Link href="/">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
