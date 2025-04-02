/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL || 'https://ammcpserver.vercel.app',
  },
}

module.exports = nextConfig 