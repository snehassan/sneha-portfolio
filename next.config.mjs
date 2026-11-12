/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      // Stack Overfit (static, self-contained) is the homepage. Sneha Town lives at /town, the original homepage at /classic.
      beforeFiles: [
        { source: "/", destination: "/stack-overfit.html" },
        { source: "/town", destination: "/town.html" },
      ],
    };
  },
};

export default nextConfig;
