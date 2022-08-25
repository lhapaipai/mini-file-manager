function getExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

const filters = {
  station_small: {
    imageWidth: 250,
    imageHeight: 300,
    ratio: 250 / 300,
  },
  small: {
    imageWidth: 250,
    imageHeight: 250,
    ratio: 1,
  },
};

export default function (state) {
  let { backendOrigin, endPoints, entryPoints } = state;

  return {
    uploadSrc(file, filterName, withSuffix = true) {
      let entryPoint = entryPoints.find((e) => file.origin === e.origin);
      if (file.type === "temp-file" && file.thumbnail) {
        return file.thumbnail;
      }

      if (!entryPoint || file.type === "dir" || file.mimeGroup !== "image") {
        return `/file-manager/icons/${file.icon}`;
      }

      let suffix = withSuffix
        ? `?${new Date(file.updatedAt.substring(0, 19)).getTime()}`
        : "";

      let host = backendOrigin ? backendOrigin : "";
      if (file.public) {
        if (!filterName || getExtension(file.uploadRelativePath) === "svg") {
          return `${host}${entryPoint.webPrefix}/${file.uploadRelativePath}${suffix}`;
        }
        return `${host}/media/cache/resolve/${filterName}${entryPoint.webPrefix}/${file.uploadRelativePath}${suffix}`;
      } else {
        if (!filterName || getExtension(file.uploadRelativePath) === "svg") {
          return `${endPoints.getFileContent}/download/${file.origin}/${file.uploadRelativePath}${suffix}`;
        }
        return `${host}/media/cache/resolve/${filterName}${entryPoint.webPrefix}/${file.uploadRelativePath}${suffix}`;
      }
    },
    uploadHeight(image, filterName) {
      if (!image.imageWidth || !image.imageHeight) {
        return;
      }
      let filter = filters[filterName];
      if (!filter) {
        image.imageWidth;
      }
      let filterRatio = filter.imageWidth / filter.imageHeight;
      let imageRatio = image.imageWidth / image.imageHeight;
      if (filterRatio > imageRatio) {
        return filter.imageHeight;
      } else {
        return Math.round(filter.imageWidth * imageRatio);
      }
    },
    uploadWidth(image, filterName) {
      if (!image.imageWidth || !image.imageHeight) {
        return;
      }
      let filter = filters[filterName];
      if (!filter) {
        image.imageWidth;
      }
      let filterRatio = filter.imageWidth / filter.imageHeight;
      let imageRatio = image.imageWidth / image.imageHeight;
      if (filterRatio < imageRatio) {
        return filter.imageWidth;
      } else {
        return Math.round(filter.imageHeight * imageRatio);
      }
    },
    install(app) {
      app.config.globalProperties.$uploadSrc = this.uploadSrc;
      app.config.globalProperties.$uploadWidth = this.uploadWidth;
      app.config.globalProperties.$uploadHeight = this.uploadHeight;
    },
  };
}
