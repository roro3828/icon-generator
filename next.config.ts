import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.roro.ro',
        port: '',
        pathname: '**',
      }
    ]
  },
  output: "export"
};

export default nextConfig;
