/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  transpilePackages: ["@protest/tailwind", "@protest/shared", "funky"],
};

module.exports = nextConfig;
