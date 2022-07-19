export async function createUploadedFileFromUpload(fileUploadInfos, directory, origin) {
  let uploadRelativePath = `${directory}/${fileUploadInfos.fileName}`;
  let mimeType = fileUploadInfos.file.type;
  let mimeGroup = mimeType.split("/")[0];
  let infos = {
    liipId: fileUploadInfos.liipId,
    mimeGroup,
    mimeType,
    filename: fileUploadInfos.fileName,
    directory,
    origin,
    imageWidth: null,
    imageHeight: null,
    type: "temp-file",
    size: fileUploadInfos.file.size,
    createdAt: new Date().toISOString(),
    icon: "other.svg",
    public: true,
    uploadInfos: {
      progression: 0,
      retry: 0,
    },
    uploadRelativePath,
  };

  if (mimeGroup === "image") {
    infos.thumbnail = await generateThumbnail(fileUploadInfos.file, [250, 250]);
    infos.imageWidth = 250;
    infos.imageHeight = 250;
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
