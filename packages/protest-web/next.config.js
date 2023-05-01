/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@protest/tailwind", "@protest/shared"],
};

module.exports = nextConfig;
