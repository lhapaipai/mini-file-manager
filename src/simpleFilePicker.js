import { createApp } from "vue";
import VSimpleFilePicker from "./components/SimpleFilePicker.vue";
import { formStringifier, prepareFormFilePickerOptions } from "./utils/mainHelper";

export default function simpleFilePicker(
  inputElt,
  formPreviewOptions,
  fileManagerOptions,
  files,
  selectionChangeCallback = undefined,
) {
  // ici l'élément est un input hidden contenant le nom des fichiers sélectionnés.
  if (typeof inputElt === "string") {
    inputElt = document.querySelector(inputElt);
  }
  if (!inputElt) {
    return;
  }
  if (!fileManagerOptions) {
    fileManagerOptions = JSON.parse(inputElt.dataset.minifilemanager);
  }
  if (!formPreviewOptions) {
    formPreviewOptions = JSON.parse(inputElt.dataset.formpreview);
  }
  if (!files) {
    files = JSON.parse(inputElt.dataset.files);
  }
  // console.log(files);

  let appElt = document.createElement("div");
  inputElt.after(appElt);

  const { i18n, themePrefix } = prepareFormFilePickerOptions(fileManagerOptions);

  const app = createApp(VSimpleFilePicker, {
    formPreviewOptions,
    fileManagerOptions,
    originalSelection: files,
    themePrefix,
  });
  app.use(i18n);

  const vm = app.mount(appElt);
  vm.$el.addEventListener("selectionChange", onSelectionChange);

  function onSelectionChange(e) {
    let files = e.detail;
    inputElt.value = formStringifier(files);
    // console.log("files change !", inputElt.value);
    if (selectionChangeCallback) {
      selectionChangeCallback(files);
    }
  }

  function destroy() {
    vm.$el.removeEventListener("selectionChange", onSelectionChange);
    app.unmount();
    vm.$el.remove();
  }

  return { destroy };
}
