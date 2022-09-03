import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
import { sort_array_by_branch } from "../crawler/utils.js";
import offline from "./offline.js";
import { MongoClient } from "mongodb";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

const readdir = util.promisify(fs.readdir);
const final_errors = [];

async function offline_runner() {
  await client.connect();
  const database = client.db("myNewDB");
  const collection = database.collection("first_100");
  var total_object = {};
  total_object["function_removals"] = 0;
  total_object["function_renames"] = 0;
  total_object["param_changes"] = 0;
  total_object["param_warnings"] = 0;
  total_object["def_body_renames"] = 0;
  total_object["def_name_renames"] = 0;
  total_object["potential_renames"] = 0;
  // total_object["old_namespace_count"] = 0;
  // total_object["old_parsed_count"] = 0;
  // total_object["new_namespace_count"] = 0;
  // total_object["new_parsed_count"] = 0;
  total_object["pairs_checked"] = 0;
  total_object["total_count"] = 0;

  let base_directory_name = "../downloader/download_final_100";

  let folder_names = await readdir(base_directory_name);

  for (let folder of folder_names) {
    try {
      let package_name = folder;
      const message_writer = fs.createWriteStream(
        "./logs_temp/" + package_name + "_output_log.txt"
      );
      let path = base_directory_name + "/" + folder;
      console.log(path);
      let file_names = await readdir(path);
      file_names = file_names.filter((file_name) => {
        if (file_name.slice(-4) === ".zip") return false;
        else return true;
      });

      let master_list = {};
      for (let sub_folder of file_names) {
        let file_path = path + "/" + sub_folder;
        let inner_files = await readdir(file_path);
        master_list[sub_folder] = [];
        master_list[sub_folder].push(inner_files);
      }

      file_names = file_names.filter((sub_folder) => {
        if (master_list[sub_folder][0].includes("NAMESPACE")) return true;
      });
      file_names.sort(sort_array_by_branch);

      console.log(file_names);
      for (let i = 0; i < file_names.length - 1; i++) {
        let first_version = file_names[i];
        let second_version = file_names[i + 1];
        var result_object = await offline(
          package_name,
          first_version,
          second_version,
          message_writer,
          collection
        );
        console.log("totals");
        total_object["function_removals"] += result_object["function_removals"];
        total_object["function_renames"] += result_object["function_renames"];
        total_object["param_changes"] += result_object["param_changes"];
        total_object["param_warnings"] += result_object["param_warnings"];
        total_object["def_body_renames"] += result_object["def_body_renames"];
        total_object["def_name_renames"] += result_object["def_name_renames"];
        total_object["potential_renames"] += result_object["potential_renames"];
        // total_object["old_namespace_count"] +=
        //   result_object["old_namespace_count"];
        // total_object["old_parsed_count"] += result_object["old_parsed_count"];
        // total_object["new_namespace_count"] +=
        //   result_object["new_namespace_count"];
        // total_object["new_parsed_count"] += result_object["new_parsed_count"];
        total_object["pairs_checked"] += 1;
        total_object["total_count"] += result_object["total_count"];
        const used = process.memoryUsage();
        for (let key in used) {
          console.log(
            `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
          );
        }
      }
    } catch (error) {
      console.log(error);
      final_errors.push(folder);
    }
  }

  console.log(final_errors);
  console.log(total_object);
  await client.close();
}

offline_runner();
