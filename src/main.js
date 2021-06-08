import { createApp, toRaw } from "vue";
import FileManager from "./components/FileManager.vue";
import FileManagerModal from "./components/FileManagerModal.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import createStoreWithOptions from "./store";

import "./css/index.scss";
import "mini-notifier/dist/style.css";

export function createFileManager(elt, options) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }
  if (!options) {
    options = JSON.parse(elt.dataset.props);
  }

  const app = createApp(FileManager);

  app.directive("scroll-lock", scrollLockDirective);

  app.use(createStoreWithOptions(options));
  app.mount(elt);

  return app;
}

export function openFileManager(options, onSuccess, onAbort) {
  let elt = document.createElement("div");
  document.body.appendChild(elt);

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
  function onAbortSelect(e) {
    if (onAbort) {
      onAbort();
    }
    destroyFileManager();
  }

  const app = createApp(FileManagerModal);
  app.directive("scroll-lock", scrollLockDirective);
  app.use(createStoreWithOptions(options));
  const vm = app.mount(elt);
  vm.$el.addEventListener("selectFiles", onSelectFiles);
  vm.$el.addEventListener("abortSelect", onAbortSelect);
}
