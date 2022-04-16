module.exports = {
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: [
      'localhost',
      's3.us-west-2.amazonaws.com',
      'images.unsplash.com',
      'drive.google.com',
      'lh5.googleusercontent.com',
    ],
    path: '/_next/image',
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};
