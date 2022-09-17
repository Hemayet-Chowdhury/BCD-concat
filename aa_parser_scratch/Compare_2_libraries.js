import { Namespace_Parser } from "./NAMESPACE_PACKAGE/Namespace_Parser.js";
import { createRequire } from "module";
import { Comparison_Processor } from "./Comparison_Processor.js";
import { FunctionExtraction } from "./FunctionExtraction.js";
import {
  decorateString,
  getLibraryVersion,
  stringifyGenericArray,
  stringifyParameterArray,
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
    log_writer,
    old_library_release_number,
    collection
  ) {
    this.package_name = package_name;
    this.library_directory_old = library_directory_old;
    this.library_directory_new = library_directory_new;
    this.log_writer = log_writer;
    this.comparison_processor = new Comparison_Processor();
    this.log_output = "";
    this.old_library_release_number = old_library_release_number;
    this.collection = collection;
  }

  async compare() {
    //get all functions
    let old_library_object = new FunctionExtraction(this.library_directory_old);
    await old_library_object.collectNodes();
    old_library_object.getAllFunctions();
    console.log(
      "old library function number ",
      old_library_object.all_functions.length
    );
    //print all replacement functions
    old_library_object.fixReplacementFunctions();

    old_library_object.getFunctionsHashList();

    let new_library_object = new FunctionExtraction(this.library_directory_new);
    await new_library_object.collectNodes();
    new_library_object.getAllFunctions();
    new_library_object.fixReplacementFunctions();
    new_library_object.getFunctionsHashList();

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
    // console.log("parameter removed list");
    // console.log(this.comparison_processor.parameterRemovals);
    // console.log("parameter renames list");
    // console.log(this.comparison_processor.parameterRenames);
    // console.log("parameter warnings list");
    // console.log(this.comparison_processor.parameterWarnings);

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
      old_release_number: this.old_library_release_number,
      new_release_number: this.old_library_release_number + 1,
      function_removals: removed_functions.length,
      function_additions: added_functions.length,
      parameter_removals: this.comparison_processor.parameterRemovals.length,
      parameter_additions: this.comparison_processor.parameterAdditions.length,
      parameter_renames: this.comparison_processor.parameterRenames.length,
      parameter_default_changes:
        this.comparison_processor.parameterWarnings.length,
    };

    this.log_output += JSON.stringify(result_object, null, 4);
    this.log_output += decorateString("Functions Removed");
    this.log_output += stringifyGenericArray(removed_functions);
    this.log_output += decorateString("Functions Added");
    this.log_output += stringifyGenericArray(added_functions);
    this.log_output += decorateString("Removed Parameters");
    this.log_output += stringifyParameterArray(
      this.comparison_processor.parameterRemovals
    );
    this.log_output += decorateString("Added Parameters");
    this.log_output += stringifyParameterArray(
      this.comparison_processor.parameterAdditions
    );
    this.log_output += decorateString("Renamed Parameters");
    this.log_output += stringifyParameterArray(
      this.comparison_processor.parameterRenames
    );
    this.log_output += decorateString("Parameter Default Value Changes");
    this.log_output += stringifyParameterArray(
      this.comparison_processor.parameterWarnings
    );

    this.log_writer.write(this.log_output);

    await this.collection.insertOne(result_object);

    return result_object;
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
//if s3 functions don't have a body, clean them out (rethink this. look at point 4.)
//add file name of function -> done
// handle one liner functions. post process parameters perhaps

//ZHANG SHASHA FOR TREE EDIT DISTANCE

//dr. meng questions
//title of thesis
//appointment room
