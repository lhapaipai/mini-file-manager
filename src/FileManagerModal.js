import { createApp, toRaw } from "vue";
import VFileManagerModal from "./components/FileManagerModal.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { prepareOptions } from "./utils/mainHelper";

export default class FileManagerModal {
  constructor(options, onSuccess = () => {}, onAbort = () => {}) {
    this.elt = document.createElement("div");
    document.body.appendChild(this.elt);

    let { store, i18n } = prepareOptions(this.elt, options);

    this.onSelectFiles = this.onSelectFiles.bind(this);
    this.onAbortSelect = this.onAbortSelect.bind(this);

    this.app = createApp(VFileManagerModal);

    this.app.directive("scroll-lock", scrollLockDirective);
    this.app.use(store);
    this.app.use(i18n);

    this.vm = this.app.mount(this.elt);
    this.vm.$el.addEventListener("selectFiles", this.onSelectFiles);
    this.vm.$el.addEventListener("abortSelect", this.onAbortSelect);

    this.onSuccess = onSuccess;
    this.onAbort = onAbort;
  }

  onSelectFiles(e) {
    let files = [];
    for (let index = 0; index < e.detail.length; index++) {
      files.push(toRaw(e.detail[index]));
    }
    this.onSuccess(toRaw(files));

    this.destroy();
  }

  onAbortSelect() {
    this.onAbort();
    this.destroy();
  }

  destroy() {
    this.vm.$el.removeEventListener("selectFiles", this.onSelectFiles);
    this.vm.$el.removeEventListener("abortSelect", this.onAbortSelect);
    this.app.unmount();
    this.vm.$el.remove();
    this.elt.remove();
  }
}
