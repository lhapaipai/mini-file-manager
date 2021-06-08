import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "miniFileManager",
    },
    rollupOptions: {
      external: [
        "vue",
        "vuex",
        "pentatrion-lib",
        "mini-notifier",
        "scroll-blocker",
      ],
      output: {
        globals: {
          vue: "Vue",
          vuex: "Vuex",
          "pentatrion-lib": "pentatrionLib",
          "mini-notifier": "miniNotifier",
          "scroll-blocker": "scrollBlocker",
        },
      },
    },
  },
});
