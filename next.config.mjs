/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.pfst.hr",
      },
    ],
  },
};

export default nextConfig;
