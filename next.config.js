const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qrmy1hdghljc85ym.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'flowerschap-prod.s3.ap-southeast-1.amazonaws.com',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@paypal/react-paypal-js', 'bootstrap'],
  },
};

module.exports = nextConfig;
