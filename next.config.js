/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@booking/partner-sdk'],
};

// To enable PWA: npm install next-pwa, then wrap with withPWA(nextConfig)
module.exports = nextConfig;
