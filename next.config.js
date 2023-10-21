/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["smooth-scrollbar/plugins/overscroll"],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
