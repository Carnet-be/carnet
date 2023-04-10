/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
module.exports = {
  i18n: {
    defaultLocale: "fr",
    locales: ["en", "fr", "ar"],
  },
  localePath: path.resolve("./public/locales"),
};
