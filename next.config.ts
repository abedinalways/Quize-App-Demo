/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4004',
        pathname: '/public/storage/avatars/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.7.42', // Add this entry
        port: '4004',
        pathname: '/public/storage/avatars/**',
      },
    ],
  },
};

module.exports = nextConfig;
