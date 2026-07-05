import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const beBackendUrl = process.env.BE_BACKEND_URL || 'http://localhost:8080';
    const dashboardBackendUrl = process.env.DASHBOARD_BACKEND_URL || 'http://localhost:8082';
    const dashboardFrontendUrl = process.env.DASHBOARD_FRONTEND_URL || 'http://localhost:3001';

    return [
      {
        source: '/soc/:path*',
        destination: `${dashboardFrontendUrl}/soc/:path*`,
      },
      {
        source: '/api-bank/:path*',
        destination: `${beBackendUrl}/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${dashboardBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
