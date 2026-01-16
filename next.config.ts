import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        pathname: '**',
        port: '3000',
        protocol: 'http',
      },
      {
        hostname: 'github.com',
        protocol: 'https',
      },
      {
        hostname: 'res.cloudinary.com',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'images.unsplash.com',
        protocol: 'https',
      },
      {
        hostname: 'www.shutterstock.com',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'imageio.forbes.com',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'm.media-amazon.com',
        protocol: 'https',
        pathname: '/**',
      },
      { hostname: 'cdn.runrepeat.com', protocol: 'https', pathname: '/**' },
      { hostname: 'content.api.news', protocol: 'https', pathname: '/**' },
      {
        hostname: 'i2f9m2t2.rocketcdn.me',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'shoewash.ca',
        protocol: 'https',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
