import { createApp } from "vue";
import VEntityFormFilePicker from "./components/EntityFormFilePicker.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { collectFormData, prepareOptions } from "./utils/mainHelper";
import vueLiipPlugin from "./utils/vueLiipPlugin";
import lazyloadDirective from "./utils/lazyloadDirective";
import createStoreWithOptions from "./store";
import { createI18n } from "vue-i18n-lite";
import localesData from "./locales";

export default function entityFormFilePicker(elt, options, uploadedFiles) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }
  options = prepareOptions(elt, options);
  console.log(options);

  if (!uploadedFiles) {
    uploadedFiles = collectFormData(elt, options.multiple);
  }
  const app = createApp(VEntityFormFilePicker, {
    initialUploadedFiles: uploadedFiles,
    name: elt.dataset.name,
  });

  app.directive("scroll-lock", scrollLockDirective);
  app.directive("lazy-load", lazyloadDirective);
  app.use(createStoreWithOptions(options, true));
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
