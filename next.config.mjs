/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
};

export default nextConfig;
