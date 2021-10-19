import { createI18n } from "vue-i18n-lite";
import createStoreWithOptions from "../store";
import localesData from "../locales";
import { prepareContainer } from "mini-notifier";

export function prepareOptions(elt, options) {
  if (!options) {
    if (elt instanceof HTMLElement) {
      options = JSON.parse(elt.dataset.props);
    } else {
      options = {};
    }
  }

  let locale = options.locale || "en";
  if (locale === "custom" && options.localeData) {
    localesData["custom"] = locale;
    locale = "custom";
  }

  elt.classList.add(options.theme || "mini-file-manager-theme");

  // assign same theme to mini-notifier
  prepareContainer(document.body, options.theme || "mini-file-manager-theme");

  return {
    i18n: createI18n({
      locale: locale,
      fallbackLocale: "en",
      messages: localesData,
    }),
    store: createStoreWithOptions(options),
    // options
  };
}

export function formParser(str) {
  return [str];
}

export function formStringifier(selection) {
  return selection.map((file) => file.uploadRelativePath).join(",");
}
