import { createApp } from "vue";
import VFileManager from "./components/FileManager.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { prepareOptions } from "./utils/mainHelper";

export default class FileManager {
  constructor(elt, options) {
    if (typeof elt === "string") {
      elt = document.querySelector(elt);
    }

    let { i18n, store } = prepareOptions(elt, options);

    this.app = createApp(VFileManager);

    this.app.directive("scroll-lock", scrollLockDirective);
    this.app.use(store);
    this.app.use(i18n);

    this.vm = this.app.mount(elt);
  }

  destroy() {
    this.app.unmount();
    this.vm.$el.remove();

    this.app = null;
    this.vm = null;
  }
}
