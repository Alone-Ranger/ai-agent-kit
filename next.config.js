/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Silence optional deps pulled in by wallet/web3 libraries (WalletConnect etc.).
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // MetaMask SDK references a React-Native-only storage module; not used on web.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
};

module.exports = nextConfig;
