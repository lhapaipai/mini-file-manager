import { createApp } from "vue";
import VFormFilePicker from "./components/FormFilePicker.vue";
import { formStringifier } from "./utils/mainHelper";

export default class FormFilePicker {
  constructor(inputElt, formFilePickerOptions, fileManagerOptions, selection) {
    // ici l'élément est un input hidden contenant le nom des fichiers sélectionnés.
    if (typeof inputElt === "string") {
      inputElt = document.querySelector(inputElt);
    }
    if (!inputElt) {
      return;
    }
    if (!fileManagerOptions) {
      fileManagerOptions = JSON.parse(inputElt.dataset.filemanager);
    }
    if (!formFilePickerOptions) {
      formFilePickerOptions = JSON.parse(inputElt.dataset.formfilepicker);
    }
    if (!selection) {
      selection = JSON.parse(inputElt.dataset.selection);
    }
    // console.log(selection);

    let appElt = document.createElement("div");
    inputElt.after(appElt);

    this.app = createApp(VFormFilePicker, {
      formFilePickerOptions,
      fileManagerOptions,
      originalSelection: selection,
      input: inputElt,
    });
    this.inputElt = inputElt;

    this.onSelectionChange = this.onSelectionChange.bind(this);

    this.vm = this.app.mount(appElt);
    this.vm.$el.addEventListener("selectionChange", this.onSelectionChange);
  }

  onSelectionChange(e) {
    let selection = e.detail;
    this.inputElt.value = formStringifier(selection);
    console.log("selection change !", this.inputElt.value);
  }

  destroy() {
    this.vm.$el.removeEventListener("selectionChange", this.onSelectionChange);
    this.app.unmount();
    this.vm.$el.remove();

    this.app = null;
    this.vm = null;
  }
}
