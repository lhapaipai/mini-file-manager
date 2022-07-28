import localesData from "../locales";
import { prepareContainer } from "mini-notifier";

export const mfmDefaultOptions = {
  endPoint: "/media-manager",
  entryPoints: [],

  // if you wants to filter files you can upload
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10Mo
    fileType: [
      "text/*",
      "image/*", // image/vnd.adobe.photoshop  image/x-xcf
      "video/*",
      "audio/*",
    ],
  },

  locale: "en", // "en" | "fr" | "custom"
  localeData: null,

  multiple: false, // allow multiple selection

  // not needed with FormFilePicker
  // selection is retrieved from input value
  originalSelection: ["posts/autre/ign.jpg"],

  themePrefix: "penta",
  injectCssVars: true,

  form: {
    filter: "small",
    type: "image",
  },
};

export function prepareOptions(elt, options) {
  if (!options) {
    if (elt instanceof HTMLElement) {
      options = JSON.parse(elt.dataset.minifilemanager);
    } else {
      options = {};
    }
  }

  options = Object.assign({}, mfmDefaultOptions, options);

  if (options.locale === "custom" && options.localeData) {
    localesData["custom"] = options.localeData;
  }

  // assign same theme to mini-notifier
  prepareContainer(document.body, options.injectCssVars);

  return options;
}

export function formParser(str) {
  return [str];
}

export function formStringifier(selection) {
  return selection
    .map((file) => {
      return `${file.directory}/${file.filename}`;
    })
    .join(",");
}

function getUploadedFileElementValue(prefix, key) {
  let elt = document.getElementById(`${prefix}_${key}`);
  if (!elt) {
    return null;
  }
  let value = elt.value;
  if (value === "") {
    return null;
  }

  if (["imageWidth", "imageHeight", "size"].indexOf(key) !== -1) {
    return isNaN(parseInt(value)) ? null : parseInt(value);
  } else if (key === "public") {
    return value === "1" ? true : false;
  }
  return value;
}

/* for entityFormFilePicker */
function collectItem(prefix) {
  let filename = getUploadedFileElementValue(prefix, "filename");
  if (filename === null) {
    return null;
  }

  let uploadedFile = {};
  for (let key of [
    "liipId",
    "mimeGroup",
    "mimeType",
    "filename",
    "directory",
    "origin",
    "imageWidth",
    "imageHeight",
    "type",
    "size",
    "createdAt",
    "icon",
    "public",
  ]) {
    uploadedFile[key] = getUploadedFileElementValue(prefix, key);
  }

  uploadedFile.uploadRelativePath = uploadedFile.directory
    ? `${uploadedFile.directory}/${uploadedFile.filename}`
    : uploadedFile.filename;

  console.log(uploadedFile);
  return uploadedFile;
}

export function collectFormData(elt, multiple) {
  let prefix = elt.id;
  if (multiple) {
    let data = [];
    for (let i = 0; document.getElementById(`${prefix}_${i}`); i++) {
      let item = collectItem(`${prefix}_${i}`);
      if (item) {
        data.push(item);
      }
    }
    return data;
  } else {
    let item = collectItem(prefix);
    if (item) {
      return [item];
    }
    return [];
  }
}
