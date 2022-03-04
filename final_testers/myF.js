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

export default async function myF(
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
  console.log("checking versions", old_version, new_version);
  //edits begin
  const old_package_name = package_name;
  const old_package_version = old_version;
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
      old_version + new_version + file.name + "temp_morph_1.ts",
      rename_filename1
    );
    var rename_tree_analyser_old = new Rename_Tree_Analyser(source_ast);

    transfer_dicts(
      rename_old_main_dict,
      rename_tree_analyser_old.getFunctionsDict()
    );
    //RENAME STUFF
  }

  //edits begin
  const new_package_name = package_name;
  const new_package_version = new_version;
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
      old_version + new_version + file.name + "temp_morph_2.ts",
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
  log_output += "Checking Versions" + " " + old_version + " " + new_version;

  log_output += myNodeProcessor.printFunctionRemovals();
  log_output += myNodeProcessor.printFunctionsAdded();

  log_output += myNodeProcessor.printParameterChanges();
  log_output += myNodeProcessor.printParameterWarnings();

  //rename stuff
  log_output +=
    "\nRemoved Functions\n" + rename_node_processor.printRemovedFunctions();
  log_output +=
    "\nAdded Functions\n" + rename_node_processor.printAddedFunctions();
  log_output += "\n" + rename_node_processor.printRenamedFunctions();

  //rename stuff ends
  log_output += rename_new_ns_parser.getMissingItemDifference();
  log_output += rename_old_ns_parser.getMissingItemDifference();
  message.write(log_output);
}
