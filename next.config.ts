import type { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname ?? '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/properties',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/developers',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/pages/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms-conditions',
        destination: '/pages/terms-conditions',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/pages/cookie-policy',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/:slug((?:[a-z0-9]+(?:-[a-z0-9]+)*)-for-sale-in-(?:[a-z0-9]+(?:-[a-z0-9]+)*))',
        destination: '/programmatic/:slug',
      },
    ];
  },

  experimental: {
    globalNotFound: true,
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
