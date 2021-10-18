// change les codes de fontello pour qu'ils soient compris entre E800 et E900.

const path = require("path");
const fs = require("fs");

const now = toIsoString(new Date());
// const now = "2021-06-09T07-57";
// const configTmpFile = path.resolve(fontelloAssetsDir, "config-tmp.json");

const backupDir = path.resolve(__dirname, "../.local/backup");
fs.mkdirSync(backupDir, { recursive: true });

const configFile = path.resolve(
  __dirname,
  "../src/css/fontello/config.json"
);
const backupFile = path.resolve(backupDir, `config-${now}.json`);

// pour éviter un conflit on réécris tous les codes.
let from = 59392;

const fileManagerConfigFile =
  "/home/lhapaipai/projets/modules/mini-file-manager/src/css/fontello/config.json";

fs.copyFileSync(configFile, backupFile);

let { glyphs: fmGlyphs } = JSON.parse(
  fs.readFileSync(configFile, { encoding: "utf8" })
);

fmGlyphs.forEach((g) => {
  g.code = from++;
});

let output = {
  name: "",
  css_prefix_text: "fa-",
  css_use_suffix: false,
  hinting: true,
  units_per_em: 1000,
  ascent: 850,
  glyphs: fmGlyphs,
};

fs.writeFileSync(configFile, JSON.stringify(output), { encoding: "utf8" });
// console.log(appGlyphs.length, fmGlyphs.length);

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
