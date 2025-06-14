/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during builds (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Your existing image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;