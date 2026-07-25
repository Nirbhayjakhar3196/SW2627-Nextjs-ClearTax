import { fileURLToPath } from 'url';

const BACKEND_URL = process.env.BACKEND_URL || "https://sw2627-nextjs-cleartax-6.onrender.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    root: fileURLToPath(new URL('..', import.meta.url)),
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/avatars/:path*',
        destination: `${BACKEND_URL}/avatars/:path*`,
      },
    ];
  },
};

export default nextConfig;
