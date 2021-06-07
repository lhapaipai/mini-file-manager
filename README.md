Work In Progress

# Installation

```bash
npm install mini-file-manager
```

Copy `file-manager` from static to your webroot directory. it contains thumbnail for each file type and icons.

```html
<div id="file-manager"></div>
```

```js
import "mini-file-manager/dist/style.css";
import { createFileManager } from "mini-file-manager";
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
  ]
};

createFileManager('#file-manager', options);
```

## With pentatrion/upload-bundle

```php
use Pentatrion\UploadBundle\Service\FileManagerHelper;

class ShareController extends AbstractController
{
    /**
     * @Route("/share", name="share")
     */
    public function index(FileManagerHelper $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->getConfig([
            [
                'label' => 'Uploads',
                'directory' => '',
                'origin' => 'public_uploads',
                'readOnly' => false,
                'icon' => 'fa-lock'
            ]
        ]);

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
