const nextConfig = {
  output: 'standalone',

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.bytetechedu.com/api', // <-- backend production
      },
    ]
  },
}

export default nextConfig
