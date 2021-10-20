// ce fichier est à utiliser dans vos projets uniquement

const path = require("path");
const fs = require("fs");

const now = toIsoString(new Date());

// fichier contenant les icones du projet
const appConfigFile = path.resolve(__dirname, "../assets/fontello/config.json");
makeBackup(appConfigFile, `config-fontello-${now}.json`);

// fichier contenant les icones de mini-file-manager
const fileManagerConfigFile =
  "/home/lhapaipai/projets/modules/mini-file-manager/src/css/fontello/config.json";

// pour éviter un conflit on réécris tous les codes de l'app à partir de 0x e900 => 59648
// (les codes de mini-file-manager sont entre 0x e800 et 0x e900)
let from = 59648;

let { glyphs: appGlyphs } = JSON.parse(
  fs.readFileSync(appConfigFile, { encoding: "utf8" }),
);
let { glyphs: fmGlyphs } = JSON.parse(
  fs.readFileSync(fileManagerConfigFile, { encoding: "utf8" }),
);

// ajoute à l'application tous les glyphs de mini-file-manager manquants
fmGlyphs.forEach((g) => {
  if (!appGlyphs.find((aG) => aG.uid === g.uid)) {
    appGlyphs.push(g);
  }
});

// ne touche pas aux codes des glyphs de mini-file-manager
// réorganise les codes de l'appli pour qu'ils ne rentrent pas en conflit
appGlyphs = appGlyphs.map((g) => {
  let glyphFromFileManager = fmGlyphs.find((aG) => aG.uid === g.uid);
  return {
    ...g,
    code: glyphFromFileManager ? glyphFromFileManager.code : from++,
  };
});

let output = {
  name: "",
  css_prefix_text: "fa-",
  css_use_suffix: false,
  hinting: true,
  units_per_em: 1000,
  ascent: 850,
  glyphs: appGlyphs,
};

fs.writeFileSync(appConfigFile, JSON.stringify(output), { encoding: "utf8" });

/* FIN */

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function toIsoString(datetime) {
  return (
    datetime.getUTCFullYear() +
    "-" +
    pad(datetime.getUTCMonth() + 1) +
    "-" +
    pad(datetime.getUTCDate()) +
    "T" +
    pad(datetime.getUTCHours()) +
    "-" +
    pad(datetime.getUTCMinutes())
  );
}

function makeBackup(filePath, backupFileName) {
  const backupDir = path.resolve(__dirname, "../.local/backup");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.resolve(backupDir, backupFileName);
  fs.copyFileSync(filePath, backupFile);
}
