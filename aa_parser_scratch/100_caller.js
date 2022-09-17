import { sort_array_by_branch } from "./FunctionExtractionUtils.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
import { MongoClient } from "mongodb";
const readdir = util.promisify(fs.readdir);
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

import { Compare_2_libraries } from "./Compare_2_libraries.js";

var total_object = {};
total_object["function_removals"] = 0;
total_object["function_additions"] = 0;
total_object["parameter_removals"] = 0;
total_object["parameter_additions"] = 0;
total_object["parameter_renames"] = 0;
total_object["def_name_renames"] = 0;
total_object["parameter_default_changes"] = 0;

await client.connect();
const database = client.db("myNewDB");
const collection = database.collection("trial_sketch");
const error_writer = fs.createWriteStream("./errors/" + "error_log.txt");

let directory_100 = "./test_final_2";
let all_parent_folders = await readdir(directory_100);

for (let parent_folder of all_parent_folders) {
  let package_folder = directory_100 + "/" + parent_folder;
  let all_versions = await readdir(package_folder);
  let filtered_versions = all_versions.filter((version_name) => {
    return version_name.slice(-4) != ".zip";
  });
  filtered_versions.sort(sort_array_by_branch);
  for (let i = 0; i < filtered_versions.length - 1; i++) {
    let package_name = parent_folder;
    let old_version = package_folder + "/" + filtered_versions[i];
    let new_version = package_folder + "/" + filtered_versions[i + 1];
    let old_library_release_number = i;
    const log_writer = fs.createWriteStream(
      "./test_logs/" + package_name + "_output_log.txt"
    );
    try {
      let compare_2_libraries = new Compare_2_libraries(
        package_name,
        old_version,
        new_version,
        log_writer,
        old_library_release_number,
        collection
      );
      let result_object = await compare_2_libraries.compare();
      total_object.function_removals += result_object.function_removals;
      total_object.function_additions += result_object.function_additions;
      total_object.parameter_removals += result_object.parameter_removals;
      total_object.parameter_additions += result_object.parameter_additions;
      total_object.parameter_renames += result_object.parameter_renames;
      total_object.parameter_default_changes +=
        result_object.parameter_default_changes;

      console.log(result_object);
    } catch (error) {
      console.log(error);
      error_writer.write(
        package_name + "\n" + old_version + "\n" + new_version
      );
      error_writer.write(error);
    }
  }
}
await client.close();
console.log("FINAL RESULTS");
console.log(total_object);
