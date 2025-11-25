import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      // Proxy API requests to the mechanic service to avoid CORS in dev
      "/api": {
        target: "http://localhost:9007",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          // Ensure Authorization header and cookies pass through
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("Origin", "http://localhost:5174");
            // Preserve Authorization header from the original request
            if (req.headers.authorization) {
              proxyReq.setHeader("Authorization", req.headers.authorization);
            }
            // Log the request for debugging
            console.log(`[Proxy] ${req.method} ${req.url}`);
            console.log(`[Proxy] Authorization: ${req.headers.authorization ? '✅ Present' : '❌ Missing'}`);
          });
        },
      },
      // Proxy auth service (login/signup) so cookies are same-origin in dev
      "/auth": {
        target: "http://localhost:9002",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ""),
      },
    },
  },
})
