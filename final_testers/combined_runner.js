import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";

const fs = require("fs");

const package_name = "cTRAP";
const url = "https://code.bioconductor.org/browse/" + package_name + "/";
const model = {
  branch: [
    ".dropdown-menu li a ",
    {
      name: "",
      url: "(href)",
    },
  ],
};

let branches = [];

await fetch(url)
  .then((res) => res.text())
  .then((body) => {
    branches = scrapy.extract(body, model).branch;
    //console.log(body);
  })
  .catch(console.error);

function sort_by_branch(a, b) {
  var first_version = a.url.match(/\d/g);
  var second_version = b.url.match(/\d/g);
  if (first_version && second_version) {
    first_version = first_version.join("");
    first_version = +first_version;

    second_version = second_version.join("");
    second_version = +second_version;
    return first_version - second_version;
  } else {
    return 1;
  }
}

var sorted_branches = branches.sort(sort_by_branch);

import myF from "./myF.js";
const message = fs.createWriteStream(
  "./logs/" + package_name + "_output_log.txt"
);

for (let i = 0; i < sorted_branches.length - 1; i++) {
  await myF(
    package_name,
    sorted_branches[i].name,
    sorted_branches[i + 1].name,
    message
  );
}

message.close();
