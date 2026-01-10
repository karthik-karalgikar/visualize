import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    // Force Vite to pre-bundle these packages
    include: ["react", "react-dom", "@mantine/core", "@mantine/hooks"],
  },

  build: {
    // Increase the warning limit to suppress chunk size warnings
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          "react-vendor": ["react", "react-dom"],
          "mantine-vendor": ["@mantine/core", "@mantine/hooks"],
        },
      },
    },

    commonjsOptions: {
      // Include all node_modules for CommonJS transformation
      include: [/node_modules/],
      // Transform mixed ES modules and CommonJS
      transformMixedEsModules: true,
    },
  },

  // Force resolution to use package.json exports field
  resolve: {
    dedupe: ["react", "react-dom"],
    mainFields: ["module", "jsnext:main", "jsnext", "main"],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
