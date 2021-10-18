export function parseOriginalSelection(originalSelection, entryPoints) {
  if (!originalSelection || originalSelection.length === 0) {
    return null;
  }

  let newList = [],
    temp,
    origin,
    path,
    originPos,
    dirPos,
    dir,
    id;
  for (let fileId of originalSelection) {
    if (fileId[0] !== "@") {
      origin = entryPoints[0].origin;
      path = fileId;
      id = `@${origin}:${path}`;
    } else {
      id = fileId;
      temp = fileId.substr(1);
      originPos = temp.indexOf(":");
      origin = temp.substr(0, originPos);
      path = temp.substr(originPos + 1);
    }
    dirPos = path.lastIndexOf("/");
    if (dirPos === -1) {
      dir = "";
    } else {
      dir = path.substr(0, dirPos);
      path = path.substr(dirPos + 1);
    }
    newList.push([origin, dir, path, id]);
  }
  return newList;
}

export function verifyValidation(fileValidation) {
  if (!fileValidation) return null;
  if (fileValidation.imageOptions) {
    if (fileValidation.imageOptions.width && fileValidation.imageOptions.height) {
      fileValidation.imageOptions.ratio =
        fileValidation.imageOptions.width / fileValidation.imageOptions.height;
      delete fileValidation.imageOptions.height;
    }
  }
  return fileValidation;
}

export function urlizer(value, separator = "-") {
  let src = "áàãâéèêëÿíïóôõúüñçÁÀÃÂÉÊÈÍÓÔÕÚÜÑÇ";
  let dst = "aaaaeeeeyiiooouuncAAAAEEEIOOOUUNC";
  let map = {};
  for (let i = 0; i < src.length; i++) {
    map[src.charAt(i)] = dst.charAt(i);
  }
  map["æ"] = "ae";
  map["œ"] = "oe";
  map[" "] = separator;

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  value = value.toLowerCase();
  value = replaceAll(value, "-", " ");
  value = replaceAll(value, "_", " ");
  let tmp = "";
  let splited = value.split(" ");
  for (let i = 0; i < splited.length; ++i) {
    let s = splited[i];
    if (s.trim().length != 0) {
      tmp += " " + s.trim();
    }
  }
  value = tmp.trim();
  let out = "";
  for (let i = 0; i < value.length; ++i) {
    let char = value.charAt(i);
    let translatedChar = map[char];

    if (translatedChar != null) {
      out += translatedChar;
    } else if ((char >= "a" && char <= "z") || (char >= "0" && char <= "9")) {
      out += char;
    }
  }
  return out;
}

export function sanitizeFilename(filename, filenameList) {
  let filenameWithoutExtension,
    extension = "",
    extPos = filename.lastIndexOf(".");
  if (extPos !== -1) {
    extension = filename.substr(extPos).toLowerCase();
    filenameWithoutExtension = filename.substr(0, extPos);
  } else {
    filenameWithoutExtension = filename;
  }

  filenameWithoutExtension = urlizer(filenameWithoutExtension);

  if (filenameList.find((f) => f.filename === filenameWithoutExtension + extension)) {
    let counter = 1;
    while (
      filenameList.find(
        (f) => f.filename === `${filenameWithoutExtension}-${counter}${extension}`,
      )
    ) {
      counter++;
    }
    filenameWithoutExtension = `${filenameWithoutExtension}-${counter}`;
  }

  return filenameWithoutExtension + extension;
}

export function filename2dirname(filename) {
  let extPos = filename.lastIndexOf(".");
  if (extPos !== -1) {
    return filename.substr(0, extPos) + filename.substr(extPos + 1);
  } else {
    return filename;
  }
}

export function isValidFile(file, fileValidation) {
  if (!fileValidation) {
    return true;
  }
  if (fileValidation.allowDir === false && file.type === "dir") {
    return false;
  }

  if (fileValidation.mimeGroup !== file.mimeGroup) {
    return false;
  }

  if (fileValidation.mimeGroup === "image") {
    if (!fileValidation.imageOptions) {
      return true;
    }
    if (
      fileValidation.imageOptions.allowSvg &&
      (file.mimeType === "image/svg+xml" || file.mimeType === "image/svg")
    ) {
      return true;
    }

    // si on a des critères de dimension et que l'image n'en dispose pas
    // comme du svg alors le fichier n'est pas valide.
    if (!file.details) {
      return false;
    }

    if (
      fileValidation.imageOptions.ratio &&
      Math.round(fileValidation.imageOptions.ratio * 100000) !==
        Math.round(file.details.ratio * 100000)
    ) {
      return false;
    }

    if (
      fileValidation.imageOptions.width &&
      fileValidation.imageOptions.width !== file.details.width
    ) {
      return false;
    }
    if (
      fileValidation.imageOptions.height &&
      fileValidation.imageOptions.height !== file.details.height
    ) {
      return false;
    }

    if (
      fileValidation.imageOptions.minWidth &&
      fileValidation.imageOptions.minWidth > file.details.width
    ) {
      return false;
    }
    if (
      fileValidation.imageOptions.minHeight &&
      fileValidation.imageOptions.minHeight > file.details.height
    ) {
      return false;
    }

    if (
      fileValidation.imageOptions.maxWidth &&
      fileValidation.imageOptions.maxWidth < file.details.width
    ) {
      return false;
    }
    if (
      fileValidation.imageOptions.maxHeight &&
      fileValidation.imageOptions.maxHeight < file.details.height
    ) {
      return false;
    }
  }

  return true;
}

export function isEditableFile(file) {
  if (file.mimeGroup !== "image") {
    return false;
  }
  if (file.mimeType === "image/svg+xml" || file.mimeType === "image/svg") {
    return false;
  }
  return true;
}

export async function createFileInfosFromUpload(fileUploadInfos, directory, origin) {
  let uploadRelativePath = `${directory}/${fileUploadInfos.fileName}`;
  let mimeType = fileUploadInfos.file.type;
  let mimeGroup = mimeType.split("/")[0];

  let infos = {
    inode: fileUploadInfos.tempInode,
    id: `@${origin}:${uploadRelativePath}`,
    filename: fileUploadInfos.fileName,
    directory,
    uploadRelativePath,
    mimeType,
    mimeGroup,
    type: "file",
    uploader: "",
    origin,
    size: fileUploadInfos.file.size,
    humanSize: "4.0 Ko",
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
