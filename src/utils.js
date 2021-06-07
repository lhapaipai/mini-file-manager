export function parseOriginalSelection(originalSelection, entryPoints) {
  if (!originalSelection) {
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

export function validateFile(file, fileValidation) {
  if (fileValidation.type !== file.mimeGroup) {
    return false;
  }
  if (fileValidation.type !== "image" || !file.details) {
    return true;
  }
  if (
    Math.round(fileValidation.ratio * 100000) !==
    Math.round(file.details.ratio * 100000)
  ) {
    return false;
  }

  return true;
}
