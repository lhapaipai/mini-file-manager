import { createApp, toRaw } from "vue";
import VFileManagerModal from "./components/FileManagerModal.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { prepareOptions } from "./utils/mainHelper";
import { createI18n } from "vue-i18n-lite";
import createStoreWithOptions from "./store";
import localesData from "./locales";
import vueLiipPlugin from "./utils/vueLiipPlugin";

export default function fileManagerModal(
  options,
  onSuccess = () => {},
  onAbort = () => {},
) {
  let elt = document.createElement("div");
  document.body.appendChild(elt);

  options = prepareOptions(elt, options);

  const app = createApp(VFileManagerModal);
  app.directive("scroll-lock", scrollLockDirective);
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
  vm.$el.addEventListener("selectFiles", onSelectFiles);
  vm.$el.addEventListener("abortSelect", onAbortSelect);

  function onSelectFiles(e) {
    let files = [];
    for (let index = 0; index < e.detail.length; index++) {
      files.push(toRaw(e.detail[index]));
    }
    onSuccess(toRaw(files));

    destroy();
  }

  function onAbortSelect() {
    onAbort();
    destroy();
  }

  function destroy() {
    vm.$el.removeEventListener("selectFiles", onSelectFiles);
    vm.$el.removeEventListener("abortSelect", onAbortSelect);
    app.unmount();
    vm.$el.remove();
    elt.remove();
  }

  return { destroy };
}
