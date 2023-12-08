/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["smooth-scrollbar/plugins/overscroll"],
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dnjlnj9dy/**",
      },
    ],
  },
};

module.exports = nextConfig;
