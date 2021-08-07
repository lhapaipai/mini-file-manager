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
    if (
      fileValidation.imageOptions.width &&
      fileValidation.imageOptions.height
    ) {
      fileValidation.imageOptions.ratio =
        fileValidation.imageOptions.width / fileValidation.imageOptions.height;
      delete fileValidation.imageOptions.height;
    }
  }
  return fileValidation;
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
