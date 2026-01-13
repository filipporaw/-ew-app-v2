/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@react-pdf/renderer',
    '@react-pdf/layout',
    '@react-pdf/pdfkit',
    '@react-pdf/render',
    '@react-pdf/types',
    '@react-pdf/reconciler',
    '@react-pdf/fns',
    '@react-pdf/font',
    '@react-pdf/primitives',
    'pdfjs-dist',
    'pdf-lib'
  ],
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
