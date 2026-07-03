const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      { source: '/budget', destination: '/budget/index.html' },
      { source: '/budget/', destination: '/budget/index.html' },
      { source: '/main/lera', destination: '/main/lera/index.html' },
      { source: '/main/lera/', destination: '/main/lera/index.html' }
    ];
  }
};
module.exports = nextConfig;
