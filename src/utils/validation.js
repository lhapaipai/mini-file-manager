export function isValidFile(file, fileValidation) {
  if (!fileValidation) {
    return true;
  }
  if (fileValidation.allowDir === false && file.type === "dir") {
    return false;
  }

  if (fileValidation.mimeGroup && fileValidation.mimeGroup !== file.mimeGroup) {
    return false;
  }

  if (fileValidation.mimeGroup === "image" || fileValidation.imageOptions) {
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
