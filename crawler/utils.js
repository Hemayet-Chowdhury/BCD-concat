//returns an array of objects {files, urls}
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";
const model = {
  files: [
    ".table > tbody tr td a",
    {
      name: "",
      url: "(href)",
    },
  ],
};
export function extractFiles(body) {
  var file_object = scrapy.extract(body, model);
  var filtered_array = file_object.files.filter((file) => {
    if (file.name.slice(-2) == ".R") return true;
    else return false;
  });

  return filtered_array;
}

export function transfer_dicts(main_dict, small_dict) {
  for (let key in small_dict) {
    main_dict[key] = small_dict[key];
  }
}

export function transfer_locations(locations_dict, small_dict, filename) {
  for (let key in small_dict) {
    locations_dict[key] = filename;
  }
}

export function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}

export function disp_function_names(main_dict, version) {
  console.log(version + " process started ");
  for (key in main_dict) {
    console.log(key);
  }
  console.log(Object.keys(main_dict).length);
}

export function display_old_location(name) {
  console.log("old_lib/ + " + old_location_dict[name]);
}

export function display_new_location(name) {
  console.log("new_lib/ + " + new_location_dict[name]);
}
