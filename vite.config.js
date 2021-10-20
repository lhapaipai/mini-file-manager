import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcssConfig from "./postcss.config.js";

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: postcssConfig,
  },
  build: {
    lib: {
      entry: "src/index.js",
      name: "miniFileManager",
    },
  },
});
