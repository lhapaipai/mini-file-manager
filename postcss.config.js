// module.exports = {
//   plugins: [
//     require("postcss-import"),
//     require("postcss-nested"),
//     require("autoprefixer")
//   ]
// };

import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import autoprefixer from "autoprefixer";

export default {
  
  plugins: [
    postcssImport,
    postcssNested,
    autoprefixer
  ]
}