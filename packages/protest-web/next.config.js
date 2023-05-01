/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@protest/tailwind", "@protest/ui"],
};

module.exports = nextConfig;
