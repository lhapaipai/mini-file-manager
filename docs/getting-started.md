# Getting started with mini-file-manager

## Install Symfony with dependencies 

```bash
symfony new file-manager-example
composer require --dev maker
composer require twig
composer require pentatrion/upload-bundle pentatrion/vite-bundle


mkdir public/{uploads,media}
# replace <your-current-user>  by whoami
# replace <apache-user> by www-data or http or ...
setfacl -dR -m u:<your-current-user>:rwX -m u:<apache-user>:rwX public/{uploads,media}
setfacl -R -m u:<your-current-user>:rwX -m u:<apache-user>:rwX public/{uploads,media}

npm install
npm i mini-file-manager

# copy assets from mini-file-manager : file-manager and fonts directory
cp -r node_modules/mini-file-manager/dist/file-manager public/
```

## Configure dependencies

configure `liip/imagine-bundle`

define at least the `small` filter. Image uploaded into mini-file-manager will be resized into thumbnails by LiipImagineBundle.

```yaml
# config/packages/liip_imagine
# Documentation on how to configure the bundle can be found at: https://symfony.com/doc/current/bundles/LiipImagineBundle/basic-usage.html
liip_imagine:
    # valid drivers options include "gd" or "gmagick" or "imagick"
    driver: "gd"

    # define filters defined in pentatrion_upload.liip_filters
    # (at least small filter)
    filter_sets:
        small:
            filters:
                thumbnail: { size: [250, 250], mode: inset, allow_upscale: true }

        large:
            filters:
                thumbnail: { size: [1500, 1500], mode: inset, allow_upscale: false }

    loaders:
        default:
            filesystem:
                data_root:
                # must be linked with pentatrion_upload -> origin.[origin-name].liip_path
                - "%kernel.project_dir%/public"
```


configure `pentatrion/upload-bundle`

you have to set `liip_path` with `path` = `data_root` (from liip_imagine.yaml) + `liip_path`

```yaml
# config/packages/pentatrion_upload.yaml
pentatrion_upload:
    uploaded_file_helper: 'Pentatrion\UploadBundle\Service\UploadedFileHelper'
    origins:
        public_uploads:
            # if directory is inside %kernel.project_dir%/public, files
            # will be directly accessible.
            path: "%kernel.project_dir%/public/uploads"
            # prefix to add in order to be found by a liip_imagine loader
            liip_path: "/uploads"

    liip_filters: ["small"]

```


## Create controller

```bash
symfony console make:controller Welcome
```

```php
namespace App\Controller;

use Pentatrion\UploadBundle\Service\FileManagerHelperInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WelcomeController extends AbstractController
{
    #[Route('/', name: 'app_welcome')]
    public function index(FileManagerHelperInterface $fileManagerHelper): Response
    {
        $config = $fileManagerHelper->completeConfig([
            'entryPoints' => [
                [
                    'label' => 'Uploads',
                    'directory' => '',
                    'origin' => 'public_uploads',
                ]
            ]
        ]);

        return $this->render('welcome/index.html.twig', [
            'fileManagerConfig' => $config,
        ]);
    }
}
```


## Create associate template

```twig
{% extends 'base.html.twig' %}

{% block title %}Hello Mini File Manager !{% endblock %}

{% block body %}
<main>
    <h1>Hello Mini File Manager</h1>
    <div id="file-manager" data-minifilemanager="{{ fileManagerConfig | json_encode | e('html_attr') }}"></div>
</main>
{% endblock %}

{% block stylesheets %}
    {{ parent() }}
    {{ vite_entry_link_tags('file-manager') }}
{% endblock %}

{% block javascripts %}
    {{ parent() }}
    {{ vite_entry_script_tags('file-manager') }}
{% endblock %}
```

```js
// assets/file-manager.js
import 'mini-file-manager/dist/style.css'
import "./file-manager.css";
import { fileManager } from "mini-file-manager";
fileManager("#file-manager");
```

```css
/* assets/file-manager.css */


```

and your bundler
```js
// vite.config.js
import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

/* if you're using React */
// import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        /* react(), // if you're using React */
        symfonyPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.js",
                'file-manager': "./assets/file-manager.js"
            },
        },
    },
});
```


## Finish ...

Run your development server
```js
npm run dev
```

Run your local web server

```bash
symfony serve --no-tls
```

Go `http://127.0.0.1:8000`
Enjoy !

<img alt="Mini file manager in action !" src="https://raw.githubusercontent.com/lhapaipai/mini-file-manager/main/docs/screenshot.png">
