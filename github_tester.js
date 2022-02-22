import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const matchAll = require("match-all");

const getNames = () => {
  fetch("https://code.bioconductor.org/browse/cTRAP/tree/RELEASE_3_10/R/")
    .then((res) => res.text())
    .then((data) => {
      console.log(matchAll(data, />([a-zA-Z0-9_\-.]+)<\/a><\/td>/gi).toArray());
    })
    .catch((err) => console.log("fetch error", err));
};

getNames();
