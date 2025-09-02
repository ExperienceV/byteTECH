const nextConfig = {
  output: 'standalone',

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:8000/api/:path*', // <-- backend local
      },
    ]
  },
}

export default nextConfig
