import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { createApp } from "vue";
import VTextFormFilePicker from "./components/TextFormFilePicker.vue";
import createStoreWithOptions from "./store";
import { formStringifier, prepareOptions } from "./utils/mainHelper";
import vueLiipPlugin from "./utils/vueLiipPlugin";
import localesData from "./locales";
import { createI18n } from "vue-i18n-lite";
import { vueMiniTipDirective } from "./lib/mini-tip/mini-tip";
import { resolveLocale } from "./utils/complete";

export default function textFormFilePicker(
  inputElt,
  options,
  uploadedFiles,
  selectionChangeCallback = undefined,
) {
  // ici l'élément est un input hidden contenant le nom des fichiers sélectionnés.
  if (typeof inputElt === "string") {
    inputElt = document.querySelector(inputElt);
  }
  options = prepareOptions(inputElt, options);

  if (!inputElt) {
    return;
  }
  if (!uploadedFiles) {
    try {
      uploadedFiles = JSON.parse(inputElt.dataset.uploadedFiles);
    } catch (e) {}
  }

  let appElt = document.createElement("div");
  inputElt.after(appElt);
  console.log("uploadedFiles", uploadedFiles);
  const app = createApp(VTextFormFilePicker, {
    initialUploadedFiles: uploadedFiles,
    // name: elt.dataset.name,
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

  const vm = app.mount(appElt);
  vm.$el.addEventListener("selectionChange", onSelectionChange);

  function onSelectionChange(e) {
    let uploadedFiles = e.detail;
    console.log("onSelection Change", uploadedFiles);
    inputElt.value = formStringifier(uploadedFiles);
    inputElt.dataset.uploadedFiles = JSON.stringify(uploadedFiles);

    if (selectionChangeCallback) {
      selectionChangeCallback(uploadedFiles);
    }
  }

  function destroy() {
    vm.$el.removeEventListener("selectionChange", onSelectionChange);
    app.unmount();
    vm.$el.remove();
  }

  return { destroy };
}
