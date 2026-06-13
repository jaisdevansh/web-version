import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
