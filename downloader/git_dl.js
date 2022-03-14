import { createRequire } from "module";
const require = createRequire(import.meta.url);

const http = require("http"); // or 'https' for https:// URLs
const fs = require("fs");
const download = require("download");

// const branch_url =
//   "http://code.bioconductor.org/browse/MetaboSignal/zipball/RELEASE_3_14";

// const path = "./download_2";
// (async () => {
//   await download(branch_url, path);
// })();

// console.log("done");
fs.appendFile("./test.txt", "data to append", function (err) {
  if (err) throw err;
  console.log("Saved!");
});
