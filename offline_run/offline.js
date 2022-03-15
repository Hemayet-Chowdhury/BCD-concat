//combine both online files here.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const ts = require("typescript");
var Readable = require("stream").Readable;
import { NodeProcessor } from "../NodeProcessor.js";
import { TreeAnalyser } from "../TreeAnalyser.js";
import { Ns_Parser } from "../Ns_Parser.js";
import { Project } from "ts-morph";
import { Rename_Tree_Analyser } from "../ts_morph/Rename_Tree_Analyser.js";
import { Rename_Node_Processor } from "../ts_morph/Rename_Node_Processor.js";
var stringSimilarity = require("string-similarity");

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

//RENAME STUFF
var project_old = new Project();
var project_new = new Project();

const rename_old_main_dict = {};
const rename_new_main_dict = {};

export default async function offline(
  package_name,
  old_version,
  new_version,
  message
) {
  console.log("##################################");
  console.log("##################################");
  console.log("##################################");
  console.log("##################################");
  console.log("##################################\n\n");
  // console.log("checking versions", old_version, new_version);

  const readFile = util.promisify(fs.readFile);

  const readdir = util.promisify(fs.readdir);

  const absolute_base =
    "C:\\NodeProjects\\first_app\\R\\downloader\\test_offline\\";

  //   const raw_old_root = absolute_base + "case 8\\nanomethviz_release_3_12";
  //   const raw_new_root = absolute_base + "case 8\\nanomethviz_release_3_14";

  const raw_old_root = absolute_base + package_name + "\\" + old_version;
  const raw_new_root = absolute_base + package_name + "\\" + new_version;

  const base_old_root = path.normalize(raw_old_root);
  // prettier-ignore

  const base_new_root = path.normalize(raw_new_root);

  const old_root_dir = base_old_root + "/R";
  const new_root_dir = base_new_root + "/R";

  let old_files;
  try {
    old_files = await readdir(old_root_dir);
  } catch (err) {
    console.log(err);
  }
  if (old_files === undefined) {
    console.log("undefined");
  } else {
    // console.log(old_names);
  }
  //edits end

  for (let file of old_files) {
    let filename1 = await readFile(old_root_dir + "/" + file, "utf8");
    filename1 = "##\n" + filename1;
    filename1 = replaceAll(filename1, "@", ".");
    filename1 = replaceAll(filename1, "\n.", "\n_");
    let rename_filename1 = filename1;
    filename1 = replaceAll(filename1, "#", "//");

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
    //RENAME STUFF
    const source_ast = project_old.createSourceFile(
      old_version + new_version + file + "temp_morph_1.ts",
      rename_filename1
    );
    var rename_tree_analyser_old = new Rename_Tree_Analyser(source_ast);

    transfer_dicts(
      rename_old_main_dict,
      rename_tree_analyser_old.getFunctionsDict()
    );
    //RENAME STUFF
  }

  let new_files;
  try {
    new_files = await readdir(new_root_dir);
  } catch (err) {
    console.log(err);
  }
  if (new_files === undefined) {
    console.log("undefined");
  } else {
    // console.log(new_names);
  }

  //edits end

  for (let file of new_files) {
    let filename2 = await readFile(new_root_dir + "/" + file, "utf8");
    filename2 = "##\n" + filename2;

    filename2 = replaceAll(filename2, "@", ".");
    filename2 = replaceAll(filename2, "\n.", "\n_");
    let rename_filename2 = filename2;
    filename2 = replaceAll(filename2, "#", "//");

    const ts_target_ast = ts.createSourceFile("temp2.ts", filename2);

    let new_version_tree = new TreeAnalyser(ts_target_ast);
    // console.log("new functions collected")
    transfer_dicts(new_main_dict, new_version_tree.getFunctionsDict());
    transfer_locations(
      new_location_dict,
      new_version_tree.getFunctionsDict(),
      file
    );

    //RENAME STUFF
    const target_ast = project_new.createSourceFile(
      old_version + new_version + file + "temp_morph_2.ts",
      rename_filename2
    );
    var rename_tree_analyser_new = new Rename_Tree_Analyser(target_ast);
    transfer_dicts(
      rename_new_main_dict,
      rename_tree_analyser_new.getFunctionsDict()
    );

    //RENAME STUFF ENDS
  }
  //OLD namespace stream work
  const fileStream = fs.createReadStream(base_old_root + "/NAMESPACE");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let old_ns_parser = new Ns_Parser(old_main_dict);

  //rename stuff
  let rename_old_ns_parser = new Ns_Parser(rename_old_main_dict);
  //rename stuff
  for await (const line of rl) {
    old_ns_parser.parseLine(line);
    //rename_stuff
    rename_old_ns_parser.parseLine(line);
    //rename_stuff
  }
  console.log("\n\nOld Namespace");
  const old_filtered_dict = old_ns_parser.getFilteredDict();
  const rename_old_filtered_dict = rename_old_ns_parser.getRenameFilteredDict();
  old_ns_parser.getMissingItemDifference();

  console.log(old_ns_parser.getMissingItems());

  //NEW namespace stream work
  const fileStream_new = fs.createReadStream(base_new_root + "/NAMESPACE");

  const rl_new = readline.createInterface({
    input: fileStream_new,
    crlfDelay: Infinity,
  });
  //NEW namespace stream work ends

  let new_ns_parser = new Ns_Parser(new_main_dict);
  //rename stuff
  let rename_new_ns_parser = new Ns_Parser(rename_new_main_dict);
  //rename stuff
  for await (const line of rl_new) {
    new_ns_parser.parseLine(line);
    rename_new_ns_parser.parseLine(line);
  }

  console.log("\n\nNew Namespace");

  const new_filtered_dict = new_ns_parser.getFilteredDict();
  const rename_new_filtered_dict = rename_new_ns_parser.getRenameFilteredDict();
  new_ns_parser.getMissingItemDifference();

  console.log(new_ns_parser.getMissingItems());

  console.log("\n\n");

  let myNodeProcessor = new NodeProcessor(
    old_filtered_dict,
    new_filtered_dict,
    old_location_dict,
    new_location_dict
  );

  //rename stuff
  var rename_node_processor = new Rename_Node_Processor(
    rename_old_filtered_dict,
    rename_new_filtered_dict
  );

  //rename stuff ends
  var log_output =
    "\n###############################\n###############################\n###############################\n###############################\n";
  var result_object = {};
  result_object["package"] = package_name;
  const [old_first, ...old_rest] = old_version.split("_");
  const old_remainder = old_rest.join("_");
  const [new_first, ...new_rest] = new_version.split("_");
  const new__remainder = new_rest.join("_");
  result_object["versions"] = old_remainder + "  " + new__remainder;
  log_output += "Package : " + package_name;
  log_output +=
    "\nChecking Versions" + " " + old_version + "\n" + new_version + "\n";

  var function_removal_object = myNodeProcessor.printFunctionRemovals();
  //log_output += function_removal_object.line;

  //log_output += myNodeProcessor.printFunctionsAdded();

  var parameter_changes_object = myNodeProcessor.printParameterChanges();
  log_output += parameter_changes_object.line;
  result_object["param_changes"] = parameter_changes_object.value;

  var parameter_warnings_object = myNodeProcessor.printParameterWarnings();

  log_output += parameter_warnings_object.line;
  result_object["param_warnings"] = parameter_warnings_object.value;

  //rename stuff
  var function_removal_rename_object =
    rename_node_processor.printRemovedFunctions();
  log_output +=
    "\n-----------------------Removed Functions------------\n" +
    function_removal_rename_object.line +
    "\n";
  result_object["function_removals"] = function_removal_rename_object.value;

  log_output +=
    "\n\n---------------------Added Functions---------------\n\n" +
    rename_node_processor.printAddedFunctions();

  var function_rename_object = rename_node_processor.printRenamedFunctions();
  log_output += "\n\n---------------------Renamed Functions---------------\n\n";
  log_output += "\n" + function_rename_object.line;
  result_object["function_renames"] = function_rename_object.value;
  result_object["def_body_renames"] = function_rename_object.def_body;
  result_object["def_name_renames"] = function_rename_object.def_name;
  result_object["potential_renames"] = function_rename_object.poss_rename;

  //rename stuff ends
  var rename_new_ns_parser_object =
    rename_new_ns_parser.getMissingItemDifference();
  log_output += rename_new_ns_parser_object.line;
  var rename_old_ns_parser_object =
    rename_old_ns_parser.getMissingItemDifference();
  log_output += rename_old_ns_parser_object.line;
  //   result_object["old_namespace_count"] =
  //     rename_old_ns_parser_object.namespace_count;
  //   result_object["old_parsed_count"] = rename_old_ns_parser_object.parsed_count;
  //   result_object["new_namespace_count"] =
  //     rename_new_ns_parser_object.namespace_count;
  //   result_object["new_parsed_count"] = rename_new_ns_parser_object.parsed_count;
  result_object["total_count"] =
    function_removal_rename_object.value +
    parameter_warnings_object.value +
    parameter_changes_object.value;

  var stringfied_results = JSON.stringify(result_object, null, 4);
  log_output = stringfied_results + "\n\n" + log_output;
  message.write(log_output);

  console.log(result_object);
  return result_object;
}

// const message_writer = fs.createWriteStream(
//   "./logs/" + " testing offline " + "_output_log.txt"
// );
// await offline(
//   "testing offline ",
//   "sorted_branches[i].name",
//   "sorted_branches[i + 1].name",
//   message_writer
// );
