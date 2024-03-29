function getExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

const filters = {
  mini: {
    imageWidth: 40,
    imageHeight: 40,
    ratio: 1,
  },
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
  card: {
    imageWidth: 500,
    imageHeight: 500,
    ratio: 1,
  },
  medium: {
    imageWidth: 800,
    imageHeight: 800,
    ratio: 1,
  },
  large: {
    imageWidth: 1500,
    imageHeight: 1500,
    ratio: 1,
  },
};

export default function (state, options = {}) {
  let liipResolverPrefix = options.liipResolverPrefix || "/media/cache/resolve";

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
        return `${host}${liipResolverPrefix}/${filterName}${entryPoint.webPrefix}/${file.uploadRelativePath}${suffix}`;
      } else {
        if (!filterName || getExtension(file.uploadRelativePath) === "svg") {
          return `${endPoints.getFileContent}/download/${file.origin}/${file.uploadRelativePath}${suffix}`;
        }
        return `${host}${liipResolverPrefix}/${filterName}${entryPoint.webPrefix}/${file.uploadRelativePath}${suffix}`;
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
        return image.imageHeight < filter.imageHeight
          ? image.imageHeight
          : filter.imageHeight;
      } else {
        return image.imageWidth < filter.imageWidth
          ? image.imageHeight
          : Math.round(filter.imageWidth / imageRatio);
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
        return image.imageWidth < filter.imageWidth
          ? image.imageWidth
          : filter.imageWidth;
      } else {
        return image.imageHeight < filter.imageHeight
          ? image.imageWidth
          : Math.round(filter.imageHeight * imageRatio);
      }
    },
    install(app) {
      app.config.globalProperties.$uploadSrc = this.uploadSrc;
      app.config.globalProperties.$uploadWidth = this.uploadWidth;
      app.config.globalProperties.$uploadHeight = this.uploadHeight;
    },
  };
}
