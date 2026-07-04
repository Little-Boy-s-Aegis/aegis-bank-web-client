import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/soc/:path*',
        destination: 'http://localhost:3001/soc/:path*',
      },
      {
        source: '/api-bank/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8082/api/:path*',
      },
    ];
  },
};

export default nextConfig;
