/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/students/:path*",
        destination: "http://localhost:8080/students/:path*",
      },
    ]
  },
}

export default nextConfig
