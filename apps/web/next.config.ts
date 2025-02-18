import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => {
    const proxyPath = "/api/:path*";
    const apiDestUrl = new URL(proxyPath, process.env.API_URL);
    return [
      {
        source: proxyPath,
        destination: apiDestUrl.toString(),
      },
    ];
  },
};

export default nextConfig;
