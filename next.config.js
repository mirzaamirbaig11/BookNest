/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  webpack: (config) => {
    // pdfjs-dist (used by react-pdf) optionally requires the Node "canvas"
    // package for server-side rendering, which isn't needed in the browser
    // and isn't installed here. Tell webpack to ignore it.
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
