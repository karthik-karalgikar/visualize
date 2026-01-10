import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-remove-scroll"],
  },
  build: {
    commonjsOptions: {
      include: [/react-remove-scroll/, /node_modules/],
    },
  },
  // Remove the resolve.alias section completely
});
