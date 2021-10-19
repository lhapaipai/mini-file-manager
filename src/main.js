import { createApp, toRaw } from "vue";

import { prepareContainer } from "mini-notifier";
import "mini-notifier/dist/style.css";

import { prepareOptions, formStringifier } from "./utils/mainHelper";

import FilePicker from "./components/FilePicker.vue";
import FileManager from "./components/FileManager.vue";
import FileManagerModal from "./components/FileManagerModal.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";

import "./css/index.css";

export function createFormFilePicker(
  elt,
  formFilePickerOptions,
  fileManagerOptions,
  selection,
) {
  // ici l'élément est un input hidden contenant le nom des fichiers sélectionnés.
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }
  if (!elt) {
    return;
  }
  if (!fileManagerOptions) {
    fileManagerOptions = JSON.parse(elt.dataset.filemanager);
  }
  if (!formFilePickerOptions) {
    formFilePickerOptions = JSON.parse(elt.dataset.formfilepicker);
  }
  // assign same theme to mini-notifier
  prepareContainer(document.body, fileManagerOptions.theme || "mini-file-manager-theme");

  if (!selection) {
    selection = JSON.parse(elt.dataset.selection);
  }
  console.log(selection);

  let appElt = document.createElement("div");
  elt.after(appElt);

  const app = createApp(FilePicker, {
    formFilePickerOptions,
    fileManagerOptions,
    originalSelection: selection,
    input: elt,
  });

  const vm = app.mount(appElt);
  vm.$el.addEventListener("updateSelection", (e) => {
    let selection = e.detail;
    elt.value = formStringifier(selection);
    console.log("selection change !", elt.value);
  });
  return app;
}

export function createFileManager(elt, options) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }

  let { i18n, store } = prepareOptions(elt, options);

  const app = createApp(FileManager);

  app.directive("scroll-lock", scrollLockDirective);
  app.use(store);
  app.use(i18n);

  app.mount(elt);

  return app;
}

export function openFileManager(options, onSuccess, onAbort) {
  let elt = document.createElement("div");
  document.body.appendChild(elt);

  let { i18n, store } = prepareOptions(elt, options);

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
  app.use(store);
  app.use(i18n);

  const vm = app.mount(elt);
  vm.$el.addEventListener("selectFiles", onSelectFiles);
  vm.$el.addEventListener("abortSelect", onAbortSelect);
}
