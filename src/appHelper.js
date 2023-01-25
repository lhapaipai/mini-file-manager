import { scrollLockDirective } from "scroll-blocker/scroll-lock-directive";
import { vueMiniTipDirective } from "./lib/mini-tip/mini-tip";
import createStoreWithOptions from "./store";
import { createI18n } from "vue-i18n-lite";
import localesData from "./locales";
import vueLiipPlugin from "./utils/vueLiipPlugin";
import { resolveLocale } from "./utils/complete";

export function prepareApp(app, options, isModal) {
  app.directive("scroll-lock", scrollLockDirective);
  app.directive("tooltip", vueMiniTipDirective);
  app.use(createStoreWithOptions(options, isModal));
  app.use(
    createI18n({
      locale: resolveLocale(options),
      fallbackLocale: "en",
      messages: localesData,
    }),
  );
  app.use(vueLiipPlugin(app.config.globalProperties.$store.state));
}
