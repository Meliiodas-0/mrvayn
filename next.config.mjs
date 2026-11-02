/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/work/palm-jumeirah", destination: "/work/marina-terrace", permanent: true }];
  },
};

export default nextConfig;
