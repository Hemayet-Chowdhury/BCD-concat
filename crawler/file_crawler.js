import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";
import { extractFiles } from "./utils.js";
const url = "https://code.bioconductor.org/browse/NanoMethViz/tree/master/R/";

await fetch(url)
  .then((res) => res.text())
  .then((body) => {
    var file_array = extractFiles(body);
    console.log(file_array);
  })
  .catch(console.error);

await fetch(
  "https://code.bioconductor.org/browse/scater/raw/master/R/plot_central.R"
)
  .then((res) => res.text())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log("fetch error", err));
