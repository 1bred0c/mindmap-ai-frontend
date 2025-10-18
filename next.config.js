/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // hoặc bỏ hẳn dòng này
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
};

module.exports = nextConfig;
