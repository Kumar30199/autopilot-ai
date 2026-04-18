import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/plan": "http://localhost:8000",
      "/research": "http://localhost:8000",
      "/analyze": "http://localhost:8000",
      "/execute": "http://localhost:8000",
      "/build": "http://localhost:8000",
      "/status": "http://localhost:8000",
      "/history": "http://localhost:8000",
    },
  },
});
