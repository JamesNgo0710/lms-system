/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress hydration warnings in development
  reactStrictMode: false,
  // Add webpack configuration to handle potential module issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  // Add redirects for old topic URLs to prevent 404s
  async redirects() {
    return [
      {
        source: '/topics/blockchain',
        destination: '/dashboard/topics/2',
        permanent: true,
      },
      {
        source: '/topics/cryptocurrency',
        destination: '/dashboard/topics/3',
        permanent: true,
      },
      {
        source: '/topics/metamask',
        destination: '/dashboard/topics/4',
        permanent: true,
      },
      {
        source: '/topics/defi',
        destination: '/dashboard/topics/5',
        permanent: true,
      },
      {
        source: '/topics/nft',
        destination: '/dashboard/topics/6',
        permanent: true,
      },
      {
        source: '/topics/:slug',
        destination: '/dashboard/topics',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
