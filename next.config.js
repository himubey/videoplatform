/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/classvideo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/classvideo/' : '',
}

module.exports = nextConfig 