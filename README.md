# Mini File Manager

Mini File Manager is a file management interface for your Symfony backend. The connection is made with [pentatrion/upload-bundle](https://github.com/lhapaipai/upload-bundle).

Mini File Manager is very flexible, you can :
  - upload big files / resume uploads with [resumableJS](https://github.com/23/resumable.js/) integration.
  - crop / resize / rotate image after their upload.
  - custom easily the theme with CSS variables.
  - localize the application.

You can see an example here : [**Live Demo**](https://mini-file-manager.pentatrion.com/) (TinyMCE integration / File Picker with form)

<img alt="Mini File Manager" src="https://user-images.githubusercontent.com/1088155/128615403-2b41fbb4-dd4e-452e-b2c2-6926642bf146.jpg">

## Getting started

if you want a practical [**minimal installation recipe**](https://github.com/lhapaipai/mini-file-manager/blob/main/docs/getting-started.md) you can follow this tutorial which will not take you more than 5 minutes.

if you want a full example you can consult the sources of [mini-file-manager-template](https://github.com/lhapaipai/mini-file-manager-template). This example contain full integration of the manager with form (file picker, wysiwyg), and simple file manager.

## Dependances

Mini File Manager is designed with Vue (unless you modify the sources, the dependencies are integrated into the module) and **you have to configure a Symfony backend to manage your files**.

i18n integration, available in English and French or provide your own Translation file. PRs are welcome.

<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/symfony.svg" alt="Symfony logo">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/vue.svg" alt="Vue logo">
</p>

- Symfony v5
  - pentatrion/upload-bundle
  - liip/imagine-bundle
  - symfony/validator


## Installation

### BackEnd

before you configure the mini-file-manager, you must first install and configure the backend under Symfony with [pentatrion/upload-bundle](https://github.com/lhapaipai/upload-bundle).

### FrontEnd

```console
npm install mini-file-manager
```

Copy `dist/file-manager` directory from `node_modules/mini-file-manager` to your webroot directory. it contains icons for each file type.

Copy `dist/style.css` directory from `node_modules/mini-file-manager` to your webroot `file-manager` directory. it contains your styles for buttons.

#### with UMD / ES Modules

`mini-file-manager.umd.js` provides `miniFileManager` global variable.

```html
<!-- with UMD -->
<link rel="stylesheet" href="/dist/mini-file-manager.css" />
<div id="file-manager"></div>
<script src="/dist/mini-file-manager.umd.js"></script>
<script>
  let {
    fileManager,
    fileManagerModal,
    textFormFilePicker,
    entityFormFilePicker
  } = miniFileManager;
    // etc...
</script>
```

or

```js
// with bundler
import {
    fileManager,
    fileManagerModal,
    textFormFilePicker,
    entityFormFilePicker
} from "mini-file-manager";
import "mini-file-manager/dist/style.css";
```

## Configuration

Mini File Manager export 4 functions

```js
fileManager(
  "#selector",        // string | HTMLElement
  fileManagerOptions  // FileManagerOptions
);

fileManagerModal(
  fileManagerOptions, // FileManagerOptions
  onSuccess,          // (selectedFiles: File[]) => void
  onAbort             // () => void
);

textFormFilePicker(
  inputElt,             // string | HTMLElement
  fileManagerOptions,   // FileManagerOptions
  selection             // File[]
)

entityFormFilePicker(
  "#inputs-container",  // string | HTMLElement
  fileManagerOptions,   // FileManagerOptions
  uploadedFiles         // File[]
  onNewFormFiles        // callBack (File[]) => {}
)
```

```ts
const options: FileManagerOptions = {
  endPoint: "http://url-to-backend.com/media-manager",
  entryPoints: [
    {
      label: "Conversation",
      // base directory relative to origin
      directory: "projet/mon-projet",
      origin: "private_uploads",
      // readOnly mode -> can't upload/modify/rename/delete files
      readOnly: false,
      icon: "fa-lock",
    },
  ],

  // if you wants to filter files you can select
  // only for the modal "openFileManager"
  fileValidation: {
    mimeGroup: "image",
    allowDir: false,
    imageOptions: {
      allowSvg: false,
      width: 1200,
      height: 900,
      minWidth: 1200,
      maxWidth: 800,
      minHeight: 1200,
      maxHeight: 800,
      ratio: 0.66, // float number : width/height

      // note : if you give a width and a height, the ratio is calculated
      // and only the width and the ratio are used.
    },
  }

  // if you wants to filter files you can upload
  fileUpload: {
    maxFileSize: 500 * 1024 * 1024, // 500Mo
    fileType: [
      "text/*",
      "image/*", // image/vnd.adobe.photoshop  image/x-xcf
      "video/*",
      "audio/*",
      "application/rtf",
      "application/pdf",
      "application/xml",
      "application/zip",
      "font/ttf",
      "font/woff",
      "font/woff2",
      "application/vnd.oasis.opendocument.spreadsheet", // libreoffice ods
      "application/vnd.oasis.opendocument.text", // libreoffice odt
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/msword", // doc
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "application/json",
      "application/illustrator", // .ai
    ]
  },
  
  locale: "en", // "en" | "fr" | "custom"
  localeData: {
    // if "custom" write here your translations by referring to the file
    // https://github.com/lhapaipai/mini-file-manager/blob/main/src/locales.js
    apply: "foo",
    cancel: "bar",
    editAndSelect: "baz",
    // ...
  }

  multiple: false,

  // not needed with textFormFilePicker
  // selection is retrieved from input value
  originalSelection: ["posts/autre/ign.jpg"],

  injectCssVars: true,
  themePrefix: 'penta',

  // only for textFormFilePicker and entityFormFilePicker
  form: {
    filter: "small",  // any filter defined in LiipImagineBundle
    type: "image"     // "image" | "file"
  }

  // displays the files contained in the folder in the filemanager
  // (otherwise only the files imported into the current session will be visible)
  indexes: true
};


```

### Theme

if you wants to define your own theme, you have 2 levels of customization.
- you can set `injectCssVars` to false and replace by your own css vars following this file : `src/css/variables.scss`
- you can set the `themePrefix` option with custom class to redefine your buttons in depth.


## Screenshots

<img alt="Crop image" src="https://user-images.githubusercontent.com/1088155/128615409-8ba709cf-dd51-40c8-a5f5-93aaacd98fe3.jpg"><br>

### Mobile friendly

<img alt="Mobile first" style="border: 1px solid #aaa; margin-right: 10px;" src="https://user-images.githubusercontent.com/1088155/128615401-10dca575-3beb-4cc2-885f-d80498d181d6.jpg" width="400"><img alt="Crop mobile first" style="border: 1px solid #aaa;" src="https://user-images.githubusercontent.com/1088155/128623126-8fdda390-fc3a-455e-a8ad-5f3ab9d7d2e1.jpg" width="400">
