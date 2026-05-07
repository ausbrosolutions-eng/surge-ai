/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: true },
      { source: "/faq", destination: "/", permanent: true },
      { source: "/how-it-works", destination: "/", permanent: true },
      { source: "/pricing", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
