import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "@react-pdf/renderer",
      "unified",
      "rehype-katex",
      "react-syntax-highlighter",
      "remark-gfm",
      "remark-math",
      "lucide-react",
      "@radix-ui/react-tabs",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ],
  },
  
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  
  // Production-only optimizations
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
};

// Wrap with bundle analyzer in development/analysis mode
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
