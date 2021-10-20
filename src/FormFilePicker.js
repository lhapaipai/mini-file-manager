import { createApp } from "vue";
import VFormFilePicker from "./components/FormFilePicker.vue";
import { formStringifier } from "./utils/mainHelper";

export default class FormFilePicker {
  constructor(inputElt, formPreviewOptions, fileManagerOptions, files) {
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

    this.app = createApp(VFormFilePicker, {
      formPreviewOptions,
      fileManagerOptions,
      originalSelection: files,
      input: inputElt,
    });
    this.inputElt = inputElt;

    this.onSelectionChange = this.onSelectionChange.bind(this);

    this.vm = this.app.mount(appElt);
    this.vm.$el.addEventListener("selectionChange", this.onSelectionChange);
  }

  onSelectionChange(e) {
    let files = e.detail;
    this.inputElt.value = formStringifier(files);
    console.log("files change !", this.inputElt.value);
  }

  destroy() {
    this.vm.$el.removeEventListener("selectionChange", this.onSelectionChange);
    this.app.unmount();
    this.vm.$el.remove();

    this.app = null;
    this.vm = null;
  }
}
