import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
const util = require("util");
const ts = require("typescript");
import { Project } from "ts-morph";
const matchAll = require("match-all");

const readline = require("readline");
const path = require("path");
import { Rename_Tree_Analyser } from "../ts_morph/Rename_Tree_Analyser.js";
import { Rename_Node_Processor } from "../ts_morph/Rename_Node_Processor.js";
import { Ns_Parser } from "../Ns_Parser.js";
var stringSimilarity = require("string-similarity");
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
import {
  extractFiles,
  transfer_dicts,
  transfer_locations,
  replaceAll,
  disp_function_names,
  display_old_location,
  display_new_location,
} from "../crawler/utils.js";

const absolute_base = "C:\\Users\\hemay\\Desktop\\research_workbench\\RECENT\\";

const raw_old_root = absolute_base + "case 9\\metabosignal_release_3_5";
const raw_new_root = absolute_base + "case 9\\metabosignal_release_3_6";

const base_old_root = path.normalize(raw_old_root);

const base_new_root = path.normalize(raw_new_root);

const old_root_dir = base_old_root + "/R";
const new_root_dir = base_new_root + "/R";

var project_old = new Project();
var project_new = new Project();

const rename_old_main_dict = {};
const rename_new_main_dict = {};

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

    transfer_dicts(
      rename_old_main_dict,
      rename_tree_analyser_old.getFunctionsDict()
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
    // filename2 = replaceAll(filename2, "#", "//");
    filename2 = replaceAll(filename2, "@", ".");
    filename2 = replaceAll(filename2, "\n.", "\n_");

    const target_ast = project_new.createSourceFile(
      file + "temp_morph_2.ts",
      filename2
    );
    var rename_tree_analyser_new = new Rename_Tree_Analyser(target_ast);
    transfer_dicts(
      rename_new_main_dict,
      rename_tree_analyser_new.getFunctionsDict()
    );
  }

  const fileStream = fs.createReadStream(base_old_root + "/NAMESPACE");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let rename_old_ns_parser = new Ns_Parser(rename_old_main_dict);
  for await (const line of rl) {
    rename_old_ns_parser.parseLine(line);
  }
  console.log("\n\nOld Namespace");
  const rename_old_filtered_dict = rename_old_ns_parser.getRenameFilteredDict();

  rename_old_ns_parser.getMissingItemDifference();

  const fileStream_new = fs.createReadStream(base_new_root + "/NAMESPACE");

  const rl_new = readline.createInterface({
    input: fileStream_new,
    crlfDelay: Infinity,
  });

  let rename_new_ns_parser = new Ns_Parser(rename_new_main_dict);
  for await (const line of rl_new) {
    rename_new_ns_parser.parseLine(line);
  }

  console.log("\n\nNew Namespace");

  const rename_new_filtered_dict = rename_new_ns_parser.getRenameFilteredDict();
  rename_new_ns_parser.getMissingItemDifference();

  console.log("\n\n");

  var rename_node_processor = new Rename_Node_Processor(
    rename_old_filtered_dict,
    rename_new_filtered_dict
  );

  rename_node_processor.printRemovedFunctions();
  rename_node_processor.printAddedFunctions();
  rename_node_processor.printRenamedFunctions();
  console.log(Object.keys(rename_old_main_dict));
}

myF();
