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
  // Add redirects for old topic URLs - redirect all to empty topics dashboard
  async redirects() {
    return [
      {
        source: '/topics/:slug*',
        destination: '/dashboard/topics',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
