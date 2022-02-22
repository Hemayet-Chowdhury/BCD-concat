import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const ts = require("typescript");
var Readable = require("stream").Readable;
// var NodeProcessor = require("./NodeProcessor");
// var TreeAnalyser = require("./TreeAnalyser");
// const Ns_Parser = require("./Ns_Parser");
import { NodeProcessor } from "../NodeProcessor.js";
import { TreeAnalyser } from "../TreeAnalyser.js";
import { Ns_Parser } from "../Ns_Parser.js";

const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";
import {
  extractFiles,
  transfer_dicts,
  transfer_locations,
  replaceAll,
  disp_function_names,
  display_old_location,
  display_new_location,
} from "../crawler/utils.js";

const readline = require("readline");
const path = require("path");

//DICTS
const old_location_dict = {};
const new_location_dict = {};
const old_main_dict = {};
const new_main_dict = {};

const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);
// prettier-ignore
const absolute_base = "C:\\Users\\hemay\\Desktop\\research_workbench\\RECENT\\";

const raw_old_root = absolute_base + "case 8\\nanomethviz_release_3_12";
const raw_new_root = absolute_base + "case 8\\nanomethviz_release_3_14";

const base_old_root = path.normalize(raw_old_root);
// prettier-ignore

const base_new_root = path.normalize(raw_new_root);

const old_root_dir = base_old_root + "/R";
const new_root_dir = base_new_root + "/R";

async function myF() {
  //edits begin
  const old_package_name = "NanoMethViz";
  const old_package_version = "RELEASE_3_12";
  let old_namespace_url =
    "https://code.bioconductor.org/browse/" +
    old_package_name +
    "/raw/" +
    old_package_version +
    "/NAMESPACE";
  let old_files = "";
  const old_url =
    "https://code.bioconductor.org/browse/" +
    old_package_name +
    "/tree/" +
    old_package_version +
    "/R/";
  await fetch(old_url)
    .then((res) => res.text())
    .then((body) => {
      var file_array = extractFiles(body);
      console.log(file_array);
      old_files = file_array;
    })
    .catch(console.error);

  //edits end

  for (let file of old_files) {
    let file_url_1 =
      "https://code.bioconductor.org/browse/" +
      old_package_name +
      "/raw/" +
      old_package_version +
      "/R/" +
      file.name;

    let filename1 = "";
    //edits_begin
    await fetch(file_url_1)
      .then((res) => res.text())
      .then((data) => {
        filename1 = data;
      })
      .catch((err) => console.log("fetch error", err));
    //edits_end
    filename1 = "##\n" + filename1;
    filename1 = replaceAll(filename1, "#", "//");
    filename1 = replaceAll(filename1, "@", ".");
    filename1 = replaceAll(filename1, "\n.", "\n_");

    const ts_source_ast = ts.createSourceFile("temp1.ts", filename1);

    let old_version_tree = new TreeAnalyser(ts_source_ast);

    // console.log("old functions collected")
    //EDITS to be backtracked

    transfer_dicts(old_main_dict, old_version_tree.getFunctionsDict());
    transfer_locations(
      old_location_dict,
      old_version_tree.getFunctionsDict(),
      file
    );
  }

  //edits begin
  const new_package_name = "NanoMethViz";
  const new_package_version = "RELEASE_3_14";
  let new_namespace_url =
    "https://code.bioconductor.org/browse/" +
    new_package_name +
    "/raw/" +
    new_package_version +
    "/NAMESPACE";
  let new_files = "";
  const new_url =
    "https://code.bioconductor.org/browse/" +
    new_package_name +
    "/tree/" +
    new_package_version +
    "/R/";

  https: await fetch(new_url)
    .then((res) => res.text())
    .then((body) => {
      var new_file_array = extractFiles(body);
      console.log(new_file_array);
      new_files = new_file_array;
    })
    .catch(console.error);

  //edits end

  for (let file of new_files) {
    let file_url_2 =
      "https://code.bioconductor.org/browse/" +
      new_package_name +
      "/raw/" +
      new_package_version +
      "/R/" +
      file.name;

    let filename2 = "";
    //edits_begin
    await fetch(file_url_2)
      .then((res) => res.text())
      .then((data) => {
        filename2 = data;
      })
      .catch((err) => console.log("fetch error", err));
    //edits_end
    filename2 = "##\n" + filename2;
    filename2 = replaceAll(filename2, "#", "//");
    filename2 = replaceAll(filename2, "@", ".");
    filename2 = replaceAll(filename2, "\n.", "\n_");

    const ts_target_ast = ts.createSourceFile("temp2.ts", filename2);

    let new_version_tree = new TreeAnalyser(ts_target_ast);
    // console.log("new functions collected")
    transfer_dicts(new_main_dict, new_version_tree.getFunctionsDict());
    transfer_locations(
      new_location_dict,
      new_version_tree.getFunctionsDict(),
      file
    );
  }
  //OLD namespace stream work
  let fileStream_old = "";
  await fetch(old_namespace_url)
    .then((res) => res.text())
    .then((data) => {
      fileStream_old = data;
    })
    .catch((err) => console.log("fetch error", err));

  var stream_old = new Readable();
  stream_old.push(fileStream_old); // the string you want
  stream_old.push(null); // indicates end-of-file basically - the end of the stream

  const rl = readline.createInterface({
    input: stream_old,
    crlfDelay: Infinity,
  });

  //Old namespace stream work ends

  let old_ns_parser = new Ns_Parser(old_main_dict);
  for await (const line of rl) {
    old_ns_parser.parseLine(line);
  }
  console.log("\n\nOld Namespace");
  const old_filtered_dict = old_ns_parser.getFilteredDict();
  old_ns_parser.getMissingItemDifference();

  console.log(old_ns_parser.getMissingItems());

  //NEW namespace stream work
  let fileStream_new = "";
  await fetch(new_namespace_url)
    .then((res) => res.text())
    .then((data) => {
      fileStream_new = data;
    })
    .catch((err) => console.log("fetch error", err));

  var stream_new = new Readable();
  stream_new.push(fileStream_new); // the string you want
  stream_new.push(null); // indicates end-of-file basically - the end of the stream

  const rl_new = readline.createInterface({
    input: stream_new,
    crlfDelay: Infinity,
  });

  //NEW namespace stream work ends

  let new_ns_parser = new Ns_Parser(new_main_dict);
  for await (const line of rl_new) {
    new_ns_parser.parseLine(line);
  }

  console.log("\n\nNew Namespace");

  const new_filtered_dict = new_ns_parser.getFilteredDict();
  new_ns_parser.getMissingItemDifference();

  console.log(new_ns_parser.getMissingItems());

  console.log("\n\n");

  let myNodeProcessor = new NodeProcessor(
    old_filtered_dict,
    new_filtered_dict,
    old_location_dict,
    new_location_dict
  );
  myNodeProcessor.printFunctionRemovals();
  myNodeProcessor.printFunctionsAdded();

  myNodeProcessor.printParameterChanges();
  myNodeProcessor.printParameterWarnings();
}

myF();
