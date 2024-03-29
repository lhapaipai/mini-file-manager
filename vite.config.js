import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 1024,
    lib: {
      entry: "src/index.js",
      name: "miniFileManager",
    },
  },
});
