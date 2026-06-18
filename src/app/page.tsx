import { Metadata } from 'next';
import ClientHome from './ClientHome';

export const metadata: Metadata = {
  title: 'Entry Club | Premium Nightlife & Events',
  description: 'Discover, book, and experience the most exclusive nightlife events, guest lists, and table reservations with Entry Club.',
  alternates: {
    canonical: 'https://party.stayin.in',
  },
};

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Entry Club',
    url: 'https://party.stayin.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://party.stayin.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Entry Club',
    url: 'https://party.stayin.in',
    logo: 'https://party.stayin.in/icon.png',
    sameAs: [
      'https://instagram.com/entryclub',
      'https://twitter.com/entryclub',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <ClientHome />
    </>
  );
}
