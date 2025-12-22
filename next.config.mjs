/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
    
  },
  output : 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable automatic CSS generation for layout and page files
  experimental: {
    // This will prevent Next.js from generating CSS files for layout and page components
    // when they don't need component-specific CSS
    disableOptimizedLoading: true,
  },
  // Configure webpack to handle ApexCharts properly (for server components)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      // Add other polyfills if needed
    };

    return config;
  },
  // Optimize CSS loading for specific paths
  async headers() {
    return [
      {
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Redirect missing CSS file requests to our empty placeholder
  async rewrites() {
    return [
      {
        source: "/_next/static/css/app/:path*",
        destination: "/empty.css",
      },
    ];
  },
};

export default nextConfig;
