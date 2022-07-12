import { createI18n } from "vue-i18n-lite";
import createStoreWithOptions from "../store";
import localesData from "../locales";
import { prepareContainer } from "mini-notifier";

export function prepareFormFilePickerOptions(options) {
  let locale = options.locale || "en";
  if (locale === "custom" && options.localeData) {
    localesData["custom"] = locale;
    locale = "custom";
  }

  return {
    i18n: createI18n({
      locale: locale,
      fallbackLocale: "en",
      messages: localesData,
    }),
    themePrefix: options.themePrefix || "penta",
    // options
  };
}

function collectItem(prefix) {
  return {
    mimeType: document.getElementById(`${prefix}_mimeType`).value,
    width: document.getElementById(`${prefix}_width`).value,
    height: document.getElementById(`${prefix}_height`).value,
    filename: document.getElementById(`${prefix}_filename`).value,
    directory: document.getElementById(`${prefix}_directory`).value,
    origin: document.getElementById(`${prefix}_origin`).value,
  };
}

export function collectFormData(elt, multiple) {
  let prefix = elt.id;
  if (multiple) {
    return Array.from(elt.children).map((child, i) => collectItem(`${prefix}_${i}`));
  } else {
    return [collectItem(prefix)];
  }
}

export function prepareOptions(elt, options) {
  if (!options) {
    if (elt instanceof HTMLElement) {
      options = JSON.parse(elt.dataset.minifilemanager);
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
    minifilemanagerOptions: options,
  };
}

export function formParser(str) {
  return [str];
}

export function formStringifier(selection) {
  return selection.map((file) => file.uploadRelativePath).join(",");
}
