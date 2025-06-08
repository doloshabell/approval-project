import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'build'
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://62.72.21.8:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\//, ''),
      },
    },
  },  
});
