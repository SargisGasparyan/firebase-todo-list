import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseio.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.gstatic.com wss://*.firebaseio.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // Ensure API routes use Node.js runtime for Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ["firebase"],
  },
};

export default nextConfig;
