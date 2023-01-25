import { createApp } from "vue";
import VFileManager from "./components/FileManager.vue";
import { prepareApp } from "./appHelper";
import { prepareOptions } from "./utils/mainHelper";

export default function fileManager(elt, options) {
  elt = elt instanceof HTMLElement ? elt : document.querySelector(elt);

  const app = createApp(VFileManager);
  prepareApp(app, prepareOptions(elt, options));
  const vm = app.mount(elt);

  function destroy() {
    app.unmount();
    vm.$el.remove();
  }

  return { destroy };
}
