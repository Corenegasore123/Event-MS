const nextConfig = {
  webpack: (config: import('webpack').Configuration) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
