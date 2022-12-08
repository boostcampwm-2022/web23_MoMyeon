/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/room/:id",
        destination: "/",
        permanent: true,
      },
      {
        source: "/mypage/interview/:id",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
