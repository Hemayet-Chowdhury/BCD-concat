import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const ts = require("typescript");
// var NodeProcessor = require("./NodeProcessor");
// var TreeAnalyser = require("./TreeAnalyser");
// const Ns_Parser = require("./Ns_Parser");
import { NodeProcessor } from "./NodeProcessor.js";
import { TreeAnalyser } from "./TreeAnalyser.js";
import { Ns_Parser } from "./Ns_Parser.js";

const readline = require("readline");
const path = require("path");

//DICTS
const old_location_dict = {};
const new_location_dict = {};
const old_main_dict = {};
const new_main_dict = {};

function transfer_dicts(main_dict, small_dict) {
  for (let key in small_dict) {
    main_dict[key] = small_dict[key];
  }
}

function transfer_locations(locations_dict, small_dict, filename) {
  for (let key in small_dict) {
    locations_dict[key] = filename;
  }
}

function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}

function disp_function_names(main_dict, version) {
  console.log(version + " process started ");
  for (key in main_dict) {
    console.log(key);
  }
  console.log(Object.keys(main_dict).length);
}

function display_old_location(name) {
  console.log("old_lib/ + " + old_location_dict[name]);
}

function display_new_location(name) {
  console.log("new_lib/ + " + new_location_dict[name]);
}

//DICTS END

//custom functs

//custom functs end

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);
// prettier-ignore
const absolute_base = "C:\\Users\\hemay\\Desktop\\research_workbench\\RECENT\\";

// const raw_old_root = absolute_base + "case 7\\ctrap_release_3_9";
// const raw_new_root = absolute_base + "case 7\\ctrap_release_3_13";

const raw_old_root = absolute_base + "case 8\\nanomethviz_release_3_12";
const raw_new_root = absolute_base + "case 8\\nanomethviz_release_3_14";

// const raw_old_root = absolute_base + "case 9\\metabosignal_release_3_5";
// const raw_new_root = absolute_base + "case 9\\metabosignal_release_3_6";

// const raw_old_root = absolute_base + "case 10\\cocoa_release_3_9";
// const raw_new_root = absolute_base + "case 10\\cocoa_release_3_11";

// const raw_old_root =
//   absolute_base + "case 11\\isoformswitchanalyzer_release_3_9";
// const raw_new_root =
//   absolute_base + "case 11\\isoformswitchanalyzer_release_3_11";

const base_old_root = path.normalize(raw_old_root);
// prettier-ignore

const base_new_root = path.normalize(raw_new_root);

const old_root_dir = base_old_root + "/R";
const new_root_dir = base_new_root + "/R";

async function myF() {
  let old_names;
  try {
    old_names = await readdir(old_root_dir);
  } catch (err) {
    console.log(err);
  }
  if (old_names === undefined) {
    console.log("undefined");
  } else {
    // console.log(old_names);
  }

  for (let file of old_names) {
    let filename1 = await readFile(old_root_dir + "/" + file, "utf8");
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

  let new_names;
  try {
    new_names = await readdir(new_root_dir);
  } catch (err) {
    console.log(err);
  }
  if (new_names === undefined) {
    console.log("undefined");
  } else {
    // console.log(new_names);
  }

  for (let file of new_names) {
    let filename2 = await readFile(new_root_dir + "/" + file, "utf8");
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

  const fileStream = fs.createReadStream(base_old_root + "/NAMESPACE");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let old_ns_parser = new Ns_Parser(old_main_dict);
  for await (const line of rl) {
    old_ns_parser.parseLine(line);
  }
  console.log("\n\nOld Namespace");
  const old_filtered_dict = old_ns_parser.getFilteredDict();
  old_ns_parser.getMissingItemDifference();

  console.log(old_ns_parser.getMissingItems());

  const fileStream_new = fs.createReadStream(base_new_root + "/NAMESPACE");

  const rl_new = readline.createInterface({
    input: fileStream_new,
    crlfDelay: Infinity,
  });

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
