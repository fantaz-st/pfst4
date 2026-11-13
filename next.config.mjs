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

  // The old site had category and goal archives under /novosti/. Taxonomies
  // are now query filters on the one news archive (CLAUDE.md § News).
  async redirects() {
    return [
      {
        source: "/novosti/kategorije/:slug",
        destination: "/novosti?kategorija=:slug",
        permanent: true,
      },
      {
        source: "/novosti/ciljevi/:slug",
        destination: "/novosti?cilj=:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
