import { Metadata } from 'next';
import { EVENTS } from '@/lib/data';
import ClientPage from './ClientPage';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const event = EVENTS.find((e) => e.id === params.id);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  const title = `${event.title} - ${event.location.split(' | ')[0]}`;
  const description = event.about || `Experience ${event.title} live at ${event.location}. Book your tickets now on Entry Club.`;
  const image = (event as any).coverImage || event.image || event.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `https://party.stayin.in/events/${params.id}`,
    },
  };
}

export async function generateStaticParams() {
  return EVENTS.map((event) => ({
    id: event.id,
  }));
}

export default async function Page(props: Props) {
  const params = await props.params;
  const event = EVENTS.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  const image = (event as any).coverImage || event.image || event.images?.[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date, // In a real app, this should be ISO 8601 format
    location: {
      '@type': 'Place',
      name: event.location.split(' | ')[0],
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.split(' | ')[1] || event.location,
        addressCountry: 'IN',
      },
    },
    image: image ? [image] : [],
    description: event.about,
    offers: {
      '@type': 'Offer',
      url: `https://party.stayin.in/events/${params.id}`,
      price: event.price.replace(/[^0-9]/g, ''),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    organizer: {
      '@type': 'Organization',
      name: 'Entry Club',
      url: 'https://party.stayin.in',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientPage />
    </>
  );
}
