function getExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

const filters = {
  station_small: {
    width: 250,
    height: 300,
    ratio: 250 / 300,
  },
  small: {
    width: 250,
    height: 250,
    ratio: 1,
  },
};

export default {
  uploadSrc(file, filterName, backendOrigin = "") {
    let uploadRelativePath = file.directory
      ? `${file.directory}/${file.filename}`
      : file.filename;

    let host = backendOrigin ? backendOrigin : "";

    if (getExtension(uploadRelativePath) === "svg") {
      return `${host}/uploads/${uploadRelativePath}`;
    } else {
      return `${host}/media/cache/resolve/${filterName}/uploads/${uploadRelativePath}`;
    }
  },
  uploadHeight(image, filterName) {
    if (!image.width || !image.height) {
      return;
    }
    let filter = filters[filterName];
    if (!filter) {
      image.width;
    }
    let filterRatio = filter.width / filter.height;
    let imageRatio = image.width / image.height;
    if (filterRatio > imageRatio) {
      return filter.height;
    } else {
      return Math.round(filter.width * imageRatio);
    }
  },
  uploadWidth(image, filterName) {
    if (!image.width || !image.height) {
      return;
    }
    let filter = filters[filterName];
    if (!filter) {
      image.width;
    }
    let filterRatio = filter.width / filter.height;
    let imageRatio = image.width / image.height;
    if (filterRatio < imageRatio) {
      return filter.width;
    } else {
      return Math.round(filter.height * imageRatio);
    }
  },
  install(app) {
    app.config.globalProperties.$uploadSrc = this.uploadSrc;
    app.config.globalProperties.$uploadWidth = this.uploadWidth;
    app.config.globalProperties.$uploadHeight = this.uploadHeight;
  },
};
