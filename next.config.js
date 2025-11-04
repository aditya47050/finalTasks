/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "utfs.io",
      "oyiy4rgbc6.ufs.sh",
      "cdn-icons-png.flaticon.com",
      "example.com",
    ],
  },
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "aarogyaaadhar.com",
          },
        ],
        permanent: true,
        destination: "https://www.aarogyaaadhar.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
