import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://api.cc.seekhcode.me/api/:path*",
      },
    ];
  },
};

export default nextConfig;
