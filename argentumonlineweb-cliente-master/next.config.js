module.exports = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    // 'dev' | 'production' — ver config.js (api())
    backend_url: process.env.BACKEND_URL || 'dev'
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.plugins = config.plugins.filter(plugin => {
        return plugin.constructor.name !== 'ReactRefreshWebpackPlugin';
      });
    }
    return config;
  }
};
