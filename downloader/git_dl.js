import { createRequire } from "module";
const require = createRequire(import.meta.url);

const http = require("http"); // or 'https' for https:// URLs
const fs = require("fs");
const download = require("download");

const url =
  "http://code.bioconductor.org/browse/MetaboSignal/zipball/RELEASE_3_14";
//const path = "./metabosignal_master.zip";
const path = "./";
(async () => {
  await download(url, path);
})();

console.log("done");
