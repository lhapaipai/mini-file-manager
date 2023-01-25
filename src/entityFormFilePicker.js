import { createApp, toRaw } from "vue";
import VEntityFormFilePicker from "./components/EntityFormFilePicker.vue";
import { collectFormData, prepareOptions } from "./utils/mainHelper";
import { prepareApp } from "./appHelper";

export default function entityFormFilePicker(
  elt,
  options,
  uploadedFiles,
  onNewFormFiles = null,
) {
  elt = elt instanceof HTMLElement ? elt : document.querySelector(elt);

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
  prepareApp(app, options, true);
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
