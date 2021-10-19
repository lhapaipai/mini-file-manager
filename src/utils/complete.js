// create objects from options
// or complete object with default options

export function checkAndFixValidation(fileValidation) {
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

export function completeUploadOptions(fileUpload) {
  return Object.assign(
    {
      maxFileSize: 500 * 1024 * 1024,
      fileType: [
        "text/*",
        "image/*", // image/vnd.adobe.photoshop  image/x-xcf
        "video/*",
        "audio/*",
        "application/rtf",
        "application/pdf",
        "application/xml",
        "application/zip",
        "font/ttf",
        "font/woff",
        "font/woff2",
        "application/vnd.oasis.opendocument.spreadsheet", // tableur libreoffice ods
        "application/vnd.oasis.opendocument.text", // traitement de texte odt
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/msword", // doc
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
        "application/vnd.ms-excel", // xls
        "application/json",
        "application/illustrator", // .ai
      ],
    },
    fileUpload,
  );
}
