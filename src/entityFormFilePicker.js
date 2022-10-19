import { createApp, toRaw } from "vue";
import VEntityFormFilePicker from "./components/EntityFormFilePicker.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { collectFormData, prepareOptions } from "./utils/mainHelper";
import vueLiipPlugin from "./utils/vueLiipPlugin";
import createStoreWithOptions from "./store";
import { createI18n } from "vue-i18n-lite";
import localesData from "./locales";
import { vueMiniTipDirective } from "./lib/mini-tip/mini-tip";
import { resolveLocale } from "./utils/complete";

export default function entityFormFilePicker(
  elt,
  options,
  uploadedFiles,
  onNewFormFiles = null,
) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }
  options = prepareOptions(elt, options);

  if (!uploadedFiles) {
    uploadedFiles = collectFormData(elt, options.multiple);
  } else if (!options.multiple && !(uploadedFiles instanceof Array)) {
    uploadedFiles = [uploadedFiles];
  }
  const app = createApp(VEntityFormFilePicker, {
    initialUploadedFiles: uploadedFiles,
    name: elt.dataset.name,
    withForm: onNewFormFiles === null,
  });

  app.directive("scroll-lock", scrollLockDirective);
  app.directive("tooltip", vueMiniTipDirective);

  app.use(createStoreWithOptions(options, true));
  app.use(
    createI18n({
      locale: resolveLocale(options),
      fallbackLocale: "en",
      messages: localesData,
    }),
  );
  app.use(vueLiipPlugin(app.config.globalProperties.$store.state));
  const vm = app.mount(elt);

  vm.$el.addEventListener("newFormFiles", handleNewSelection);

  function handleNewSelection(e) {
    let files = [];
    for (let index = 0; index < e.detail.length; index++) {
      files.push(toRaw(e.detail[index]));
    }
    if (onNewFormFiles) {
      if (options.multiple) {
        onNewFormFiles(toRaw(files));
      } else {
        onNewFormFiles(files.length > 0 ? files[0] : null);
      }
    }
  }

  function destroy() {
    vm.$el.removeEventListener("newFormFiles", handleNewSelection);

    app.unmount();
    vm.$el.remove();
  }

  function update(uploadedFiles) {
    vm.$data.uploadedFiles = uploadedFiles;
  }

  return { destroy, update };
}
