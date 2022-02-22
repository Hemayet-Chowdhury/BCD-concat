import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
const util = require("util");
const ts = require("typescript");
import { Project } from "ts-morph";
const matchAll = require("match-all");

const readline = require("readline");
const path = require("path");
import { Rename_Tree_Analyser } from "./Rename_Tree_Analyser.js";
import { Rename_Node_Processor } from "./Rename_Node_Processor.js";
import { Ns_Parser } from "../Ns_Parser.js";
var stringSimilarity = require("string-similarity");

const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);

const absolute_base = "C:\\Users\\hemay\\Desktop\\research_workbench\\RECENT\\";

// const raw_old_root = absolute_base + "case 7\\ctrap_release_3_9";
// const raw_new_root = absolute_base + "case 7\\ctrap_release_3_13";

// const raw_old_root = absolute_base + "case 8\\nanomethviz_release_3_12";
// const raw_new_root = absolute_base + "case 8\\nanomethviz_release_3_14";

const raw_old_root = absolute_base + "case 9\\metabosignal_release_3_5";
const raw_new_root = absolute_base + "case 9\\metabosignal_release_3_6";

// const raw_old_root = absolute_base + "case 10\\cocoa_release_3_9";
// const raw_new_root = absolute_base + "case 10\\cocoa_release_3_11";

// const raw_old_root =
//   absolute_base + "case 11\\isoformswitchanalyzer_release_3_9";
// const raw_new_root =
//   absolute_base + "case 11\\isoformswitchanalyzer_release_3_11";

// const raw_old_root = absolute_base + "case 13\\transite_release_3_9";
// const raw_new_root = absolute_base + "case 13\\transite_release_3_11";

const base_old_root = path.normalize(raw_old_root);
// prettier-ignore

const base_new_root = path.normalize(raw_new_root);

const old_root_dir = base_old_root + "/R";
const new_root_dir = base_new_root + "/R";

const old_ns_link = base_old_root + "/NAMESPACE";
const new_ns_link = base_new_root + "/NAMESPACE";

var project_old = new Project();
var project_new = new Project();

///weird functions
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

// let filename1 = fs.readFileSync(old_root_dir + "/file3.R", "utf8");
// const source_ast = project.createSourceFile("temp.ts", filename1);
// var rename_tree_analyser = new Rename_Tree_Analyser(source_ast);
// var rename_node_processor = new Rename_Node_Processor();

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
    // filename1 = replaceAll(filename1, "#", "//");
    filename1 = replaceAll(filename1, "@", ".");
    filename1 = replaceAll(filename1, "\n.", "\n_");

    const source_ast = project_old.createSourceFile(
      file + "temp_morph_1.ts",
      filename1
    );
    var rename_tree_analyser_old = new Rename_Tree_Analyser(source_ast);

    transfer_dicts(old_main_dict, rename_tree_analyser_old.getFunctionsDict());
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
    // filename2 = replaceAll(filename2, "#", "//");
    filename2 = replaceAll(filename2, "@", ".");
    filename2 = replaceAll(filename2, "\n.", "\n_");

    const target_ast = project_new.createSourceFile(
      file + "temp_morph_2.ts",
      filename2
    );
    var rename_tree_analyser_new = new Rename_Tree_Analyser(target_ast);
    transfer_dicts(new_main_dict, rename_tree_analyser_new.getFunctionsDict());
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
  const old_filtered_dict = old_ns_parser.getRenameFilteredDict();

  old_ns_parser.getMissingItemDifference();

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

  const new_filtered_dict = new_ns_parser.getRenameFilteredDict();
  new_ns_parser.getMissingItemDifference();

  console.log("\n\n");

  var rename_node_processor = new Rename_Node_Processor(
    old_filtered_dict,
    new_filtered_dict
  );

  //console.log(Object.keys(old_filtered_dict));
  rename_node_processor.printRemovedFunctions();
  rename_node_processor.printAddedFunctions();
  rename_node_processor.printRenamedFunctions();
}

myF();
