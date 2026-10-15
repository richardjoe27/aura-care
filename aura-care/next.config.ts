import type { NextConfig } from "next";

// NEXT_PUBLIC_BASE_PATH can be passed at build time (e.g. in GitHub Actions) for GitHub Pages
const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/|\/$/g, "")}`
  : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

