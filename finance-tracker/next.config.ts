import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      { source: "/transactions", destination: "/dashboard/transactions" },
      { source: "/analytics", destination: "/dashboard/analytics" },
      { source: "/goals", destination: "/dashboard/goals" },
      { source: "/settings", destination: "/dashboard/settings" },
    ];
  },
};

export default nextConfig;
