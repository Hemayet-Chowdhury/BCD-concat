import { Namespace_Parser } from "./NAMESPACE_PACKAGE/Namespace_Parser.js";
import { createRequire } from "module";
import { Comparison_Processor } from "./Comparison_Processor.js";
import { FunctionExtraction } from "./FunctionExtraction.js";
import {
  decorateString,
  getLibraryVersion,
  stringifyGenericArray,
} from "./Metadata_Utils.js";
import { format } from "path";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

export class Compare_2_libraries {
  constructor(
    package_name,
    library_directory_old,
    library_directory_new,
    log_writer
  ) {
    this.package_name = package_name;
    this.library_directory_old = library_directory_old;
    this.library_directory_new = library_directory_new;
    this.log_writer = log_writer;
    this.comparison_processor = new Comparison_Processor();
    this.log_output = "";
  }

  async compare() {
    //get all functions
    let old_library_object = new FunctionExtraction(this.library_directory_old);
    await old_library_object.collectNodes();
    old_library_object.getAllFunctions();
    old_library_object.getFunctionsHashList();
    console.log(
      "Old Library All Functions HashList length: ",
      Object.keys(old_library_object.all_functions_hash_list).length
    );

    let new_library_object = new FunctionExtraction(this.library_directory_new);
    await new_library_object.collectNodes();
    new_library_object.getAllFunctions();
    new_library_object.getFunctionsHashList();
    console.log(
      "New Library All Functions HashList length: ",
      Object.keys(new_library_object.all_functions_hash_list).length
    );

    //release version string splitting
    let old_directory_splits = this.library_directory_old.split("/");
    let new_directory_splits = this.library_directory_new.split("/");
    let old_release_version =
      old_directory_splits[old_directory_splits.length - 1];
    let new_release_version =
      new_directory_splits[new_directory_splits.length - 1];
    //description_old
    let description_file_old = await readFile(
      this.library_directory_old + "/DESCRIPTION",
      "utf8"
    );

    let library_version_old = getLibraryVersion(description_file_old);
    console.log(library_version_old);

    //description_new
    let description_file_new = await readFile(
      this.library_directory_new + "/DESCRIPTION",
      "utf8"
    );
    let library_version_new = getLibraryVersion(description_file_new);
    console.log(library_version_new);

    //namespace_old
    let namespace_file_old = await readFile(
      this.library_directory_old + "/NAMESPACE",
      "utf8"
    );
    const namespace_parser_old = new Namespace_Parser(namespace_file_old);

    //namespace_new
    let namespace_file_new = await readFile(
      this.library_directory_new + "/NAMESPACE",
      "utf8"
    );
    const namespace_parser_new = new Namespace_Parser(namespace_file_new);

    //filter libraries
    let old_filtered_functions_hash_list =
      this.comparison_processor.filterLibrary(
        old_library_object.all_functions_hash_list,
        namespace_parser_old.all_exported_functions_set
      );

    let new_filtered_functions_hash_list =
      this.comparison_processor.filterLibrary(
        new_library_object.all_functions_hash_list,
        namespace_parser_new.all_exported_functions_set
      );

    //debug - delete later

    //differences

    //parameter differences

    this.comparison_processor.getParameterModifications(
      old_filtered_functions_hash_list,
      new_filtered_functions_hash_list
    );

    console.log("parameter differences");
    console.log(this.comparison_processor.parameterRemovals.length);
    console.log(this.comparison_processor.parameterAdditions.length);
    console.log(this.comparison_processor.parameterRenames.length);
    console.log(this.comparison_processor.parameterWarnings.length);
    console.log("parameter differences end");
    console.log("parameter renames list");
    console.log(this.comparison_processor.parameterRenames);
    console.log("parameter warnings list");
    console.log(this.comparison_processor.parameterWarnings);

    //removed functions
    const removed_functions = this.comparison_processor.getFunctionRemovals(
      namespace_parser_old.all_exported_functions_set,
      namespace_parser_new.all_exported_functions_set
    );

    //added functions
    const added_functions = this.comparison_processor.getFunctionAdditions(
      namespace_parser_old.all_exported_functions_set,
      namespace_parser_new.all_exported_functions_set
    );

    //log writer
    console.log("Number of removed functions", removed_functions.length);
    this.log_output =
      "\n###############################\n###############################\n###############################\n###############################\n";
    this.log_output +=
      "Checking Versions: " +
      " " +
      old_release_version +
      " " +
      new_release_version +
      "\n\n";

    let result_object = {
      package: this.package_name,
      release_versions: old_release_version + " " + new_release_version,
      function_removals: removed_functions.length,
      function_additions: added_functions.length,
    };

    this.log_output += JSON.stringify(result_object, null, 4);
    this.log_output += decorateString("Functions Removed");
    this.log_output += stringifyGenericArray(removed_functions);
    this.log_output += decorateString("Functions Added");
    this.log_output += stringifyGenericArray(added_functions);

    this.log_writer.write(this.log_output);
  }
}

//to do
//check and perform any minor fixes in function representation. ("probably do a replace quotes")
//filter functions for both libraries. use algorithm
//use function location libraries -> probably add as a node
//add release number 1,2,3 in object
//figure out some of the most removed functions

//** Function Body Edits */

//**FIX SIGNATURE READING */
// add function body
//add file name of function

//ZHANG SHASHA FOR TREE EDIT DISTANCE

//dr. meng questions
//1. thesis paper format
//2. research paper format
//3. ** thesis paper length
//4. *** schedule final exam on december's first week
