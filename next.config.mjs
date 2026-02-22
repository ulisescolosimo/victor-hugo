/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbopackFileSystemCache: true, // (o el flag equivalente que estés usando)
  },
}

export default nextConfig
