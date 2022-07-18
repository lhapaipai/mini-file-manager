import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcssConfig from "./postcss.config.js";

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: postcssConfig,
  },
  build: {
    assetsInlineLimit: 1024,
    lib: {
      entry: "src/index.js",
      name: "miniFileManager",
    },
  },
});
