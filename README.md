Work In Progress

# Installation

```bash
npm install mini-file-manager
```

Copy `dist/file-manager` from static to your webroot directory. it contains thumbnail for each file type and icons.

## FrontEnd

### Importation

```html
<!-- with UMD -->
<link rel="stylesheet" href="/dist/style.css" />
<div id="file-manager"></div>
<script src="/dist/mini-file-manager.umd.js"></script>
<script>
  let createFileManager = miniFileManager.createFileManager;
  // etc...
</script>
```

```html
<!-- with ES modules -->
<link rel="stylesheet" href="/dist/style.css" />
<div id="file-manager"></div>
<script type="module">
  import { createFileManager } from "/dist/mini-file-manager.es.js";
  // etc...
</script>
```

```js
// with bundler
import { createFileManager } from "mini-file-manager";
```

```js
// without css/index.scss import
// if you want to custom your theme

import { createFileManager } from "mini-file-manager/src/main-without-theme.js";

// modify files and add them manually
import "mini-notifier/dist/style.css";
import "./css/index.scss";
```

### Configuration

```js
const options = {
	endPoint: "/media-manager",
  isAdmin:
  entryPoints :[
    {
        label: 'Conversation',
        // base directory relative to origin
        directory: 'projet/mon-projet',
        origin: 'private_uploads',
        readOnly: false,
        icon: 'fa-lock'
    },
  ],

  // if you want to filter files you can select
  // only for the modal "openFileManager"
  fileValidation: {
    mimeGroup: 'image',
    allowDir: false,
    imageOptions: {
      allowSvg: false,
      width: 1200,
      height: 900,
      minWidth: 1200,
      maxWidth: 800,
      minHeight: 1200,
      maxHeight: 800,
      ratio: 0.66 // float number : width/height

      // note : if you give a width and a height, the ratio is calculated
      // and only the width and the ratio are used.
    }
  },

  originalSelection: ["@public_uploads:posts/autre/ign.jpg"]
  // note : you can remove the origin if you have only one origin
  // originalSelection: ["posts/autre/ign.jpg"]
};

createFileManager('#file-manager', options);
```

## Backend with Symfony and pentatrion/upload-bundle

```php
use Pentatrion\UploadBundle\Service\FileManagerHelper;

class ShareController extends AbstractController
{
    /**
     * @Route("/share", name="share")
     */
    public function index(FileManagerHelper $fileManagerHelper): Response
    {
        $isAdmin = true;
        $config = $fileManagerHelper->getConfig([
            [
                'label' => 'Uploads',
                'directory' => '',
                'origin' => 'public_uploads',
                'readOnly' => false,
                'icon' => 'fa-lock'
            ]
        ], $isAdmin);

        return $this->render('share/index.html.twig', [
            'FileManagerConfig' => $config,
        ]);
    }
}
```

```twig
<div id="file-manager" data-props="{{ FileManagerConfig | json_encode | e('html_attr') }}"></div>
```

```js
//file-manager.js
import "mini-file-manager/src/css/index.scss";
import { createFileManager } from "mini-file-manager";

// config is parsed from data-props
createFileManager("#file-manager");
```

### FileManager With Button

```php
use Pentatrion\UploadBundle\Service\FileManagerHelper;

class ShareController extends AbstractController
{
    /**
     * @Route("/find", name="find")
     */
    public function find(FileManagerHelper $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->getConfig([
            [
                'label' => 'Uploads',
                // base directory, relative to origin
                'directory' => '',
                'origin' => 'public_uploads',
                'readOnly' => false,
                'icon' => 'fa-lock'
            ]
        ]);

        return $this->render('share/find.html.twig', [
            'FileManagerConfig' => $config,
        ]);
    }
}
```

```twig
<button id="find-file" data-props="{{ FileManagerConfig | json_encode | e('html_attr') }}">Find</button>
```

```js
import "mini-file-manager/src/css/index.scss";
import { openFileManager } from "mini-file-manager";

let findBtn = document.getElementById("find-file");
findBtn.addEventListener("click", () => {
  let options = JSON.parse(findBtn.dataset.props);
  openFileManager(
    options,
    (files) => {
      console.log("onSuccess", files);
    },
    () => {
      console.log("onAbort");
    }
  );
});
```
