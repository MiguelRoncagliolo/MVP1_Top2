import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/tesseract.js/**/*",
      "./node_modules/tesseract.js-core/**/*",
      "./node_modules/regenerator-runtime/**/*",
      "./node_modules/is-url/**/*",
      "./node_modules/node-fetch/**/*",
      "./node_modules/zlibjs/**/*",
    ],
  },
};

export default nextConfig;
