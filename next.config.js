const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/travel-2026', destination: '/travel-2026.html' },
      { source: '/travel-2026/', destination: '/travel-2026.html' }
    ];
  }
};
module.exports = nextConfig;
