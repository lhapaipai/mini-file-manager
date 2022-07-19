import { createApp } from "vue";
import VFileManager from "./components/FileManager.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { prepareOptions } from "./utils/mainHelper";
import { createI18n } from "vue-i18n-lite";
import localesData from "./locales";
import createStoreWithOptions from "./store";
import vueLiipPlugin from "./utils/vueLiipPlugin";

export default function fileManager(elt, options) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }

  options = prepareOptions(elt, options);

  const app = createApp(VFileManager);
  app.directive("scroll-lock", scrollLockDirective);
  app.use(createStoreWithOptions(options, false));
  app.use(
    createI18n({
      locale: options.locale,
      fallbackLocale: "en",
      messages: localesData,
    }),
  );
  app.use(vueLiipPlugin(app.config.globalProperties.$store.state));

  const vm = app.mount(elt);

  function destroy() {
    app.unmount();
    vm.$el.remove();
  }

  return { destroy };
}
