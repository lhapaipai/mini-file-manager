// change les codes de fontello pour qu'ils soient compris entre E800 et E900.

const path = require("path");
const fs = require("fs");

const now = toIsoString(new Date()); // "2021-06-09T07-57"

const configFile = path.resolve(__dirname, "../src/css/fontello/config.json");
makeBackup(configFile, `config-fontello-${now}.json`);

// pour éviter un conflit on réécris tous les codes.
// (les codes de mini-file-manager sont entre 0x e800 = 59392 et 0x e900)
let from = 59392;

let { glyphs } = JSON.parse(fs.readFileSync(configFile, { encoding: "utf8" }));

glyphs.forEach((g) => {
  g.code = from++;
});

let output = {
  name: "",
  css_prefix_text: "fa-",
  css_use_suffix: false,
  hinting: true,
  units_per_em: 1000,
  ascent: 850,
  glyphs,
};

fs.writeFileSync(configFile, JSON.stringify(output), { encoding: "utf8" });

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
