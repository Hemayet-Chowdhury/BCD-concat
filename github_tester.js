import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const matchAll = require("match-all");

const getNames = () => {
  fetch("https://code.bioconductor.org/browse/cTRAP/tree/RELEASE_3_11/R/")
    .then((res) => res.text())
    .then((data) => {
      console.log(matchAll(data, />([a-zA-Z0-9_\-.]+)<\/a><\/td>/gi).toArray());
    })
    .catch((err) => console.log("fetch error", err));
};

// let s = `<td><span class="fafa-file-text-o"></span> <a href="/browse/cTRAP/blob/RELEASE_3_11/R/utils.R">utils.R</a></td>`;
// s = `<td><span class="fafa-file-text-o"></span> <a href="/browse/cTRAP/blob/RELEASE_3_11/R/utils.R">utils.R</a></td>`;
// console.log(matchAll(s, />([a-z][A-Z].+)<\/a><\/td>/gi).toArray());
getNames();
