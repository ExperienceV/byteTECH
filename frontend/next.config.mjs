const nextConfig = {
  output: 'standalone',  // <--- agregar esta línea

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.bytetechedu.com/api/:path*', // Proxy to backend (mantiene el prefijo /api)
      },
    ]
  },
}

export default nextConfig
