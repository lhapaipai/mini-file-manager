import { createApp } from "vue";
import VFileManager from "./components/FileManager.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { prepareOptions } from "./utils/mainHelper";

export default function FileManager(elt, options) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }

  let { i18n, store } = prepareOptions(elt, options);

  const app = createApp(VFileManager);

  app.directive("scroll-lock", scrollLockDirective);
  app.use(store);
  app.use(i18n);

  const vm = app.mount(elt);

  function destroy() {
    app.unmount();
    vm.$el.remove();
  }

  return { destroy };
}
