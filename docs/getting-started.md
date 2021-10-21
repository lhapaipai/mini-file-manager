# Getting started with mini-file-manager

## Install Symfony with dependencies 

```bash
symfony new --full file-manager-example
composer require pentatrion/upload-bundle liip/imagine-bundle

# create uploads and thumbnails directories
mkdir -m 777 public/{uploads,media}


npm init
npm install mini-file-manager

# copy assets : file-manager and fonts directory
cp -r node_modules/mini-file-manager/dist/{file-manager,fonts} public/
# copy script and style
cp -r node_modules/mini-file-manager/dist/{mini-file-manager.es.js,mini-file-manager.css} public/
```

```
├──public
│ ├──file-manager
| | ├─...
│ ├──fonts
| | ├─...
| ├──mini-file-manager.es.js
| ├──mini-file-manager.css
│ ├...
├──composer.json
├──package.json
```

## Configure dependencies

configure `liip/imagine-bundle`

```yaml
# config/packages/liip_imagine
# Documentation on how to configure the bundle can be found at: https://symfony.com/doc/current/bundles/LiipImagineBundle/basic-usage.html
liip_imagine:
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

```yaml
# config/packages/pentatrion_upload.yaml
pentatrion_upload:
  file_infos_helper: 'Pentatrion\UploadBundle\Service\FileInfosHelper'
  origins:
    public_uploads:
      # if directory is inside %kernel.project_dir%/public, files
      # will be directly accessible.
      path: "%kernel.project_dir%/public/uploads"
      # prefix to add in order to be found by a liip_imagine loader
      liip_path: "/uploads"

  liip_filters: ["small", "large"]
```

## Create controller

```bash
symfony console make:controller Welcome
```

```php
namespace App\Controller;

use Pentatrion\UploadBundle\Service\FileManagerHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WelcomeController extends AbstractController
{
    #[Route('/', name: 'welcome')]
    public function index(): Response
    {
        $config = FileManagerHelper::completeConfig([
            'isAdmin' => true,
            'entryPoints' => [
                [
                    'label' => 'Uploads',
                    'directory' => '',
                    'origin' => 'public_uploads',
                    'readOnly' => false,
                    'icon' => 'fa-lock'
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
{# templates/welcome/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Hello Mini File Manager !{% endblock %}

{% block body %}
<main>
    <h1>Hello Mini File Manager</h1>
    <div id="file-manager" data-minifilemanager="{{ fileManagerConfig | json_encode | e('html_attr') }}"></div>
</main>
{% endblock %}

{% block stylesheets %}
    <link rel="stylesheet" href="/mini-file-manager.css" />
    <style>
        #file-manager {
            min-height: 600px;
        }
    </style>
{% endblock %}

{% block javascripts %}
    <script type="module">
        import { FileManager } from "/mini-file-manager.es.js";
        FileManager("#file-manager");
    </script>
{% endblock %}
```

## Finish ...

Run local web server

```bash
symfony serve
```

Go `https://127.0.0.1:8000`
Enjoy !
