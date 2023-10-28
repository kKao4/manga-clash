/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["smooth-scrollbar/plugins/overscroll"],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
