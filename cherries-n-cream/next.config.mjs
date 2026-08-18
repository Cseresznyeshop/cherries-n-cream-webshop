/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "bossoftoys.pl" },
      { protocol: "https", hostname: "bossoftoys.pl" },
    ],
  },
};

export default nextConfig;
