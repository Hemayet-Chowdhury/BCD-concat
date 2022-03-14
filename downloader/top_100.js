import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";
import { list_100, list_last_59, sort_by_branch } from "../crawler/utils.js";
const download = require("download");
let base = "./download_final_100/";
const fs = require("fs");
let errors = [];

const model = {
  branch: [
    ".dropdown-menu li a ",
    {
      name: "",
      url: "(href)",
    },
  ],
};

async function download_files() {
  for (let i = 0; i < list_100.length; i++) {
    let package_name = list_100[i];
    let path = base + package_name;
    let url = "https://code.bioconductor.org/browse/" + package_name + "/";
    let branches;
    let branch_success = false;
    while (branch_success == false) {
      await fetch(url)
        .then((res) => res.text())
        .then((body) => {
          let unsorted_branches = scrapy.extract(body, model).branch;
          branches = unsorted_branches.sort(sort_by_branch);
          console.log(branches);
          branch_success = true;
        })
        .catch(() => {
          console.log("branch is empty " + package_name);
        });
    }
    if (branches.length == 0) continue;
    for (let branch_item of branches) {
      let release_version = branch_item.name;
      let branch_url =
        "http://code.bioconductor.org/browse/" +
        package_name +
        "/zipball/" +
        release_version;
      let success = false;
      let attempts = 0;
      while (success == false) {
        await download(branch_url, path)
          .then(() => {
            console.log("done " + package_name + " " + release_version);
            success = true;
          })
          .catch((err) => {
            attempts++;
            console.log("error " + branch_url);
            errors.push(branch_url);
            fs.appendFile("./errors.txt", "\n" + branch_url, function (err) {
              if (err) console.log("could not append");
            });
            if (attempts > 5) success = true;
          });
        await sleep(2000);
      }
    }
  }
}

download_files();
async function init() {
  for (let i = 0; i < 5; i++) {
    console.log(i);
    await sleep(2000);
    console.log(i + "ends");
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
