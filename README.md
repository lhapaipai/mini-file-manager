# Mini File Manager

Mini File Manager is a file management interface for your Symfony backend. The connection is made with [pentatrion/upload-bundle](https://github.com/lhapaipai/upload-bundle).

<img alt="Mini File Manager" src="https://user-images.githubusercontent.com/1088155/128615403-2b41fbb4-dd4e-452e-b2c2-6926642bf146.jpg">

## Dependances

Mini File Manager is designed with Vue (unless you modify the sources, the dependencies are integrated into the module) and you have to configure a Symfony backend to manage your files.

i18n integration, available in English and French or provide your own Translation file. PRs are welcome.

<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/symfony.svg" alt="Symfony logo">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/vue.svg" alt="Vue logo">
</p>

- Symfony v5
  - pentatrion/upload-bundle
  - liip/imagine-bundle
  - symfony/validator

## Examples

### Full integration

You can see an example here : [**Live Demo**](https://mini-file-manager.pentatrion.com/)

Sources of this example are available in a separate repository [mini-file-manager-template](https://github.com/lhapaipai/mini-file-manager-template). This example contain full integration of the manager with form (file picker, wysiwyg), and simple file manager.

### Partial integration

If you want to see basic utilisation of the manager you can see examples in the public directory.

After configuring a backend, change the `endPoint` option in the `example-01-umd.html` file and type :

```console
npm run serve
```

Your example is available on `http://localhost:5000/example-01-umd.html`

## Installation

### BackEnd

before you configure the mini-file-manager, you must first install and configure the backend under Symfony with [pentatrion/upload-bundle](https://github.com/lhapaipai/upload-bundle).

### FrontEnd

```console
npm install mini-file-manager
```

Copy `dist/file-manager` directory from `node_modules/mini-file-manager` to your webroot directory. it contains icons for each file type.

Copy `dist/fonts` directory from `node_modules/mini-file-manager` to your webroot directory. it contains icons for buttons.

#### with UMD / ES Modules

`mini-file-manager.umd.js` provides `miniFileManager` global variable.

```html
<!-- with UMD -->
<link rel="stylesheet" href="/dist/style.css" />
<div id="file-manager"></div>
<script src="/dist/mini-file-manager.umd.js"></script>
<script>
  let { createFileManager, openFileManager } = miniFileManager;
  // etc...
</script>
```

or

```html
<!-- with ES modules -->
<link rel="stylesheet" href="/dist/style.css" />
<div id="file-manager"></div>
<script type="module">
  import {
    createFileManager,
    openFileManager,
  } from "/dist/mini-file-manager.es.js";
  // etc...
</script>
```

or

```js
// with bundler
import { createFileManager, openFileManager } from "mini-file-manager";
import "mini-file-manager/dist/style.css";
```

#### Custom installation

if you want to customize styles, you need to use mini-file-manager with a bundler (Rollup/Vite/Webpack)
you probably need to install custom loader to compile Vue 3 template files and mini-notifier (if you want to import style files)

```console
npm i mini-notifier cropperjs mini-notifier pentatrion-lib scroll-blocker vue-i18n-lite vuex@next
```

```js
import {
  createFileManager,
  openFileManager,
} from "mini-file-manager/src/main-without-theme";

import "mini-file-manager/src/css/index.scss";
import "mini-notifier/dist/style.css";
```

## Configuration

Mini File Manager export 2 functions

```js
createFileManager("#selector", options);

openFileManager(options, onSuccess, onAbort);

function onSuccess(files) {
  console.log("selected files", files);
}
function onAbort() {
  console.log("abort");
}
```

```js
const options = {
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

  multiSelection: false,
  originalSelection: ["posts/autre/ign.jpg"],
  theme: "pentatrion-theme"
};
```

### Theme

if you wants to define your own theme, you can set the `theme` option with custom class and redefine the css variables from `src/css/variables.css` with this class.

```js
const options = {
  //...
  theme: 'my-own-theme'
};
```

```css
.my-own-theme {
  --primary-color-light: #fff9d2;
  --primary-color: #ffe64b;
  --primary-color-active: #fadf30;
  --primary-color-dark: #eac800;

  /* etc... */
}
```


## Screenshots

<img alt="Crop image" src="https://user-images.githubusercontent.com/1088155/128615409-8ba709cf-dd51-40c8-a5f5-93aaacd98fe3.jpg"><br>

### Mobile friendly

<img alt="Mobile first" style="border: 1px solid #aaa; margin-right: 10px;" src="https://user-images.githubusercontent.com/1088155/128615401-10dca575-3beb-4cc2-885f-d80498d181d6.jpg" width="400"><img alt="Crop mobile first" style="border: 1px solid #aaa;" src="https://user-images.githubusercontent.com/1088155/128623126-8fdda390-fc3a-455e-a8ad-5f3ab9d7d2e1.jpg" width="400">
