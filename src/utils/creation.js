import { humanFileSize } from "./filters";

export async function createFileInfosFromUpload(fileUploadInfos, directory, origin) {
  let uploadRelativePath = `${directory}/${fileUploadInfos.fileName}`;
  let mimeType = fileUploadInfos.file.type;
  let mimeGroup = mimeType.split("/")[0];

  let infos = {
    inode: null,
    id: fileUploadInfos.id,
    filename: fileUploadInfos.fileName,
    directory,
    uploadRelativePath,
    mimeType,
    mimeGroup,
    type: "file",
    uploader: "",
    origin,
    size: fileUploadInfos.file.size,
    humanSize: humanFileSize(fileUploadInfos.file.size),
    createdAt: new Date().toISOString(),
    isDir: false,
    url: null,
    urlTimestamped: null,
    icon: "/file-manager/icons/other.svg",
    uploadInfos: {
      progression: 0,
      retry: 0,
    },
  };

  if (mimeGroup === "image") {
    infos.thumbnails = {
      small: await generateThumbnail(fileUploadInfos.file, [250, 250]),
    };
  }

  return infos;
}

export function generateThumbnail(file, boundBox) {
  if (!boundBox || boundBox.length != 2) {
    throw "You need to give the boundBox";
  }
  // let scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height);
  let reader = new FileReader();
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  return new Promise((resolve) => {
    reader.onload = function (event) {
      let img = new Image();
      img.onload = function () {
        let scaleRatio = Math.min(...boundBox) / Math.max(img.width, img.height);
        let w = img.width * scaleRatio;
        let h = img.height * scaleRatio;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        return resolve(canvas.toDataURL(file.type));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
