import { createApp, toRaw } from "vue";
import VFileManagerModal from "./components/FileManagerModal.vue";
import { prepareOptions } from "./utils/mainHelper";
import { prepareApp } from "./appHelper";

export default function fileManagerModal(
  options,
  onSuccess = () => {},
  onAbort = () => {},
) {
  let elt = document.createElement("div");
  document.body.appendChild(elt);

  const app = createApp(VFileManagerModal);
  prepareApp(app, prepareOptions(elt, options, true));
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
