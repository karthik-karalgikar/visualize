import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-remove-scroll": "react-remove-scroll/dist/es2015/index.js",
    },
  },

  optimizeDeps: {
    include: ["react-remove-scroll"],
  },
});
