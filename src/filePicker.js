import { createApp } from "vue";
import VFilePicker from "./components/FilePicker.vue";
import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { collectFormData, prepareOptions } from "./utils/mainHelper";
import vueLiipPlugin from "./utils/vueLiipPlugin";

export default function filePicker(elt, options) {
  if (typeof elt === "string") {
    elt = document.querySelector(elt);
  }

  let { i18n, store, minifilemanagerOptions } = prepareOptions(elt, options);

  let filePickerOptions = JSON.parse(elt.dataset.filePicker);
  console.log(filePickerOptions);
  let files = collectFormData(elt, filePickerOptions.multiple);
  const app = createApp(VFilePicker, {
    ...filePickerOptions,
    files,
    name: elt.dataset.name,
    themePrefix: minifilemanagerOptions.themePrefix,
  });

  app.directive("scroll-lock", scrollLockDirective);
  app.use(store);
  app.use(i18n);
  app.use(vueLiipPlugin);
  const vm = app.mount(elt);

  function destroy() {
    app.unmount();
    vm.$el.remove();
  }

  return { destroy };
}
