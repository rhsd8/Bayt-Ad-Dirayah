/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect www to apex over HTTPS
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.harfproject.com' }],
        destination: 'https://harfproject.com/:path*',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
