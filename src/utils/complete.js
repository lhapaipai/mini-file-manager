// create objects from options
// or complete object with default options

export function checkAndFixValidation(fileValidation) {
  if (!fileValidation) return null;
  if (fileValidation.imageOptions) {
    fileValidation.mimeGroup = "image";
    if (fileValidation.imageOptions.width && fileValidation.imageOptions.height) {
      fileValidation.imageOptions.ratio =
        fileValidation.imageOptions.width / fileValidation.imageOptions.height;
      delete fileValidation.imageOptions.height;
    }
  }
  return fileValidation;
}

export function completeUploadOptions(fileUpload) {
  return Object.assign(
    {
      maxFileSize: 500 * 1024 * 1024,
      fileType: ["image/jpeg", "image/png", "image/gif"],
    },
    fileUpload,
  );
}

export function resolveLocale(options) {
  let bodyLocale = document.body.dataset.locale
    ? document.body.dataset.locale.substring(0, 2)
    : null;

  return options.locale || bodyLocale || "en";
}
