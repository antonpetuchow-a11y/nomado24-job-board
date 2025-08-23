/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com'],
  },
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig 