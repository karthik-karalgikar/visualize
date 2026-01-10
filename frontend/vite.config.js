import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ["react", "react-dom", "@mantine/core", "@mantine/hooks"],
  },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "mantine-vendor": ["@mantine/core", "@mantine/hooks"],
        },
      },
    },

    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },

  resolve: {
    dedupe: ["react", "react-dom"],
    conditions: ["import", "module", "browser", "default"],
  },
});
