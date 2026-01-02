import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  // React Compiler is enabled by default in Next.js 16.1.1
  // with the NEXT_REACT_COMPILER=true environment variable
  
  // Turbopack is enabled via CLI flag: --turbo
  // Server components are enabled by default in App Router
};

export default nextConfig;
