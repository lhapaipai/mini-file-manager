import { createApp, toRaw } from "vue";
import { createI18n } from "vue-i18n-lite";
import FilePicker from "./components/FilePicker.vue";
import FileManager from "./components/FileManager.vue";
import FileManagerModal from "./components/FileManagerModal.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import createStoreWithOptions from "./store";
import localesData from "./locales";

import "mini-notifier/dist/style.css";
import "./css/index.css";

import "./css/theme.css";

export function createFilePicker(elt, fileManagerOptions, selection) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }
  if (!elt) {
    return;
  }
  if (!fileManagerOptions) {
    fileManagerOptions = JSON.parse(elt.dataset.filemanager);
  }
  if (!selection) {
    selection = JSON.parse(elt.dataset.selection);
  }
  let locale = fileManagerOptions.locale || "en";
  if (locale === "custom" && fileManagerOptions.localeData) {
    localesData["custom"] = locale;
    locale = "custom";
  }
  let appElt = document.createElement("div");
  elt.after(appElt);

  const app = createApp(FilePicker, {
    fileManagerOptions,
    originalSelection: selection,
    input: elt,
  });

  app.mount(appElt);
  return app;
}

export function createFileManager(elt, options) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }
  if (!options) {
    options = JSON.parse(elt.dataset.props);
  }
  let locale = options.locale || "en";
  if (locale === "custom" && options.localeData) {
    localesData["custom"] = locale;
    locale = "custom";
  }

  const app = createApp(FileManager);

  app.directive("scroll-lock", scrollLockDirective);

  app.use(createStoreWithOptions(options));
  app.use(
    createI18n({
      locale: locale,
      fallbackLocale: "en",
      messages: localesData,
    }),
  );

  app.mount(elt);

  return app;
}

export function openFileManager(options, onSuccess, onAbort) {
  let elt = document.createElement("div");
  document.body.appendChild(elt);

  let locale = options.locale || "en";
  if (locale === "custom" && options.localeData) {
    localesData["custom"] = locale;
    locale = "custom";
  }

  function destroyFileManager() {
    vm.$el.removeEventListener("selectFiles", onSelectFiles);
    vm.$el.removeEventListener("abortSelect", onAbortSelect);
    app.unmount();
    vm.$el.remove();
  }
  function onSelectFiles(e) {
    if (onSuccess) {
      let files = [];
      for (let index = 0; index < e.detail.length; index++) {
        files.push(toRaw(e.detail[index]));
      }
      onSuccess(toRaw(files));
    }
    destroyFileManager();
  }
  function onAbortSelect() {
    if (onAbort) {
      onAbort();
    }
    destroyFileManager();
  }

  const app = createApp(FileManagerModal);
  app.directive("scroll-lock", scrollLockDirective);
  app.use(createStoreWithOptions(options));
  app.use(
    createI18n({
      locale: locale,
      fallbackLocale: "en",
      messages: localesData,
    }),
  );

  const vm = app.mount(elt);
  vm.$el.addEventListener("selectFiles", onSelectFiles);
  vm.$el.addEventListener("abortSelect", onAbortSelect);
}
