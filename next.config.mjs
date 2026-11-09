/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      // Sneha Town (static, self-contained) is the homepage. The previous homepage lives at /classic.
      beforeFiles: [{ source: "/", destination: "/town.html" }],
    };
  },
};

export default nextConfig;
