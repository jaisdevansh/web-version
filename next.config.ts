import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  output: 'standalone', // Drastically reduces deployment size and startup time
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api1/:path*',
        destination: 'https://party.stayin.in/api1/:path*', // Proxy to AWS Backend
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@components/ui'],
  },
};

export default nextConfig;
