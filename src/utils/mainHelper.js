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

/* for entityFormFilePicker */
function collectItem(prefix) {
  let filename = document.getElementById(`${prefix}_filename`).value;
  if (filename === "") {
    return null;
  }

  let uploadedFile = {
    liipId: document.getElementById(`${prefix}_liipId`).value,
    mimeGroup: document.getElementById(`${prefix}_mimeGroup`).value,
    mimeType: document.getElementById(`${prefix}_mimeType`).value,
    filename: document.getElementById(`${prefix}_filename`).value,
    directory: document.getElementById(`${prefix}_directory`).value,
    origin: document.getElementById(`${prefix}_origin`).value,
    imageWidth: document.getElementById(`${prefix}_imageWidth`).value,
    imageHeight: document.getElementById(`${prefix}_imageHeight`).value,
    type: document.getElementById(`${prefix}_type`).value,
    size: document.getElementById(`${prefix}_size`).value,
    createdAt: document.getElementById(`${prefix}_createdAt`).value,
    icon: document.getElementById(`${prefix}_icon`).value,
    public: document.getElementById(`${prefix}_public`).value,
  };

  uploadedFile.imageWidth = isNaN(parseInt(uploadedFile.imageWidth))
    ? null
    : parseInt(uploadedFile.imageWidth);
  uploadedFile.imageHeight = isNaN(parseInt(uploadedFile.imageHeight))
    ? null
    : parseInt(uploadedFile.imageHeight);
  uploadedFile.uploadRelativePath = uploadedFile.directory
    ? `${uploadedFile.directory}/${uploadedFile.filename}`
    : uploadedFile.filename;
  uploadedFile.public = uploadedFile.public === "1" ? true : false;

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
