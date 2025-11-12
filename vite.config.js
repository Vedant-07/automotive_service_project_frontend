import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the mechanic service to avoid CORS in dev
      "/api": {
        target: "http://localhost:9007",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          // so cookies/auth headers can pass through if needed
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("Origin", "http://localhost:5175");
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
