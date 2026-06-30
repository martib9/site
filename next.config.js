const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/budget', destination: '/budget/index.html' },
      { source: '/budget/', destination: '/budget/index.html' }
    ];
  }
};
module.exports = nextConfig;
