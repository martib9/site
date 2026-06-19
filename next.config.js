const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/budget', destination: '/budget/index.html' },
      { source: '/budget/', destination: '/budget/index.html' },
      { source: '/travel-2026', destination: '/travel-2026.html' },
      { source: '/travel-2026/', destination: '/travel-2026.html' }
    ];
  }
};
module.exports = nextConfig;
