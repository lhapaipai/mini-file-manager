export function humanFileSize(size) {
  let i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "Ko", "Mo", "Go", "To"][i]
  );
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

export function parseSelection(selection, entryPoints) {
  if (!selection || selection.length === 0) {
    return null;
  }
  let newList = [],
    temp,
    origin,
    path,
    originPos,
    dirPos,
    dir,
    liipId;
  for (let fileId of selection) {
    if (fileId[0] !== "@") {
      origin = entryPoints[0].origin;
      path = fileId;
      liipId = `@${origin}:${path}`;
    } else {
      liipId = fileId;
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
    newList.push({
      origin,
      dir,
      path,
      liipId,
    });
  }
  return newList;
}
