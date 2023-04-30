/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["tailwind-config", "@protest/ui"],
};

module.exports = nextConfig;
