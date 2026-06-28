import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173,
    proxy: {
      "/report": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/compare": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/platforms": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/coach": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/solution": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/ai": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/replay": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});