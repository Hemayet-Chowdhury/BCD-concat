import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";
const url = "https://code.bioconductor.org/browse/scater/";
const model = {
  branch: [
    ".dropdown-menu li a ",
    {
      name: "",
      url: "(href)",
    },
  ],
};

await fetch(url)
  .then((res) => res.text())
  .then((body) => {
    console.log(scrapy.extract(body, model));
    //console.log(body);
  })
  .catch(console.error);
