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
      entry: "src/main.js",
      name: "miniFileManager",
    },
    rollupOptions: {
      // si on souhaite utiliser la manager comme ça, je suppose que ça ne nous
      // dérange pas de s'encombrer avec ces dépendances.
      // external: [
      //   "vue",
      //   "vuex",
      //   "pentatrion-lib",
      //   "mini-notifier",
      //   "scroll-blocker",
      // ],
      // output: {
      //   globals: {
      //     vue: "Vue",
      //     vuex: "Vuex",
      //     "pentatrion-lib": "pentatrionLib",
      //     "mini-notifier": "miniNotifier",
      //     "scroll-blocker": "scrollBlocker",
      //   },
      // },
    },
  },
});
