import { createRequire } from "module";
const require = createRequire(import.meta.url);
var stringSimilarity = require("string-similarity");
const matchAll = require("match-all");

function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}
export class Rename_Node_Processor {
  constructor(old_filtered_dict, new_filtered_dict) {
    this.old_filtered_dict = old_filtered_dict;
    this.new_filtered_dict = new_filtered_dict;
    this.functions_removed_dict = {};
    this.functions_added_dict = {};
    this.parameters_removed_dict = {};
    this.parameters_added_dict = {};
    this.functions_renamed_list = [];
    this.functions_definite_name_renamed_list = [];
    this.functions_definite_body_renamed_list = [];
    this.getFunctionRemovals();
    this.getFunctionAdditions();
    this.getParameters();
  }

  getParameters() {
    for (let key in this.functions_removed_dict) {
      let str = this.functions_removed_dict[key];
      let arr = str.match(/(?<=function\s*).*?(?=\s*{)/gs);
      if (!arr) {
        this.parameters_removed_dict[key] = "";
      } else {
        this.parameters_removed_dict[key] = arr[0];
      }
    }

    for (let key in this.functions_added_dict) {
      let str = this.functions_added_dict[key];
      let arr = str.match(/(?<=function\s*).*?(?=\s*{)/gs);
      if (!arr) {
        this.parameters_added_dict[key] = "";
      } else {
        this.parameters_added_dict[key] = arr[0];
      }
    }
  }
  getFunctionRemovals() {
    for (let key in this.old_filtered_dict) {
      if (!this.new_filtered_dict.hasOwnProperty(key)) {
        this.functions_removed_dict[key] = this.old_filtered_dict[key];
      }
    }
  }

  getFunctionAdditions() {
    for (let key in this.new_filtered_dict) {
      if (!this.old_filtered_dict.hasOwnProperty(key)) {
        this.functions_added_dict[key] = this.new_filtered_dict[key];
      }
    }
  }

  printRemovedFunctions() {
    console.log("Functions Removed : ");
    console.log(Object.keys(this.functions_removed_dict));
    return "\n" + Object.keys(this.functions_removed_dict).join("\n");
  }

  printAddedFunctions() {
    console.log("Functions Added : ");
    console.log(Object.keys(this.functions_added_dict));
    return "\n" + Object.keys(this.functions_added_dict).join("\n");
  }

  printRenamedFunctions() {
    let idx = 0;
    let body_idx = 0;
    let name_idx = 0;
    for (let removed_key in this.functions_removed_dict) {
      for (let added_key in this.functions_added_dict) {
        let function1_body = this.functions_removed_dict[removed_key];
        let function2_body = this.functions_added_dict[added_key];
        let similarity_body = stringSimilarity.compareTwoStrings(
          function1_body,
          function2_body
        );

        let function1_name = removed_key.toLowerCase();
        function1_name = replaceAll(function1_name, "_", "");
        let function2_name = added_key.toLowerCase();
        function2_name = replaceAll(function2_name, "_", "");
        let similarity_name = stringSimilarity.compareTwoStrings(
          function1_name,
          function2_name
        );

        if (similarity_body == 1) {
          body_idx++;
          this.functions_definite_body_renamed_list.push(
            body_idx + ". " + removed_key + " -> " + added_key
          );
          delete this.functions_removed_dict[removed_key];
          delete this.functions_added_dict[added_key];

          break;
        }

        if (similarity_name == 1) {
          name_idx++;
          this.functions_definite_name_renamed_list.push(
            name_idx + ". " + removed_key + " -> " + added_key
          );
          delete this.functions_removed_dict[removed_key];
          delete this.functions_added_dict[added_key];

          break;
        }
      }
    }
    for (let removed_key in this.functions_removed_dict) {
      var max = 0.8;
      let matched_function;
      for (let added_key in this.functions_added_dict) {
        let function1_body = this.functions_removed_dict[removed_key];
        let function2_body = this.functions_added_dict[added_key];
        let similarity_body = stringSimilarity.compareTwoStrings(
          function1_body,
          function2_body
        );

        let function1_name = removed_key.toLowerCase();
        let function2_name = added_key.toLowerCase();

        let function1_parameter =
          function1_name + this.parameters_removed_dict[removed_key];
        let function2_parameter =
          function2_name + this.parameters_added_dict[added_key];
        let similarity_parameter = stringSimilarity.compareTwoStrings(
          function1_parameter,
          function2_parameter
        );

        let similarity_name = stringSimilarity.compareTwoStrings(
          function1_name,
          function2_name
        );

        // prettier-ignore
        let overall_similarity =  similarity_body + similarity_parameter;

        if (
          // (overall_similarity>0.8) && overall_similarity > max
          overall_similarity > max
        ) {
          // prettier-ignore
          // console.log(
          //   "Match",
          //   removed_key,
          //   added_key,"|",
          //   "name :", similarity_name, "param :",similarity_parameter,
          //   "body :",similarity_body,
          //   "",overall_similarity
          // );
          max = Math.max(overall_similarity, max);
          matched_function = added_key;
        } else {
        }
      }
      if (matched_function) {
        idx++;
        this.functions_renamed_list.push(
          idx + ". " + removed_key + " -> " + matched_function
        );
      }
    }

    var total_renames =
      this.functions_definite_body_renamed_list.length +
      this.functions_definite_name_renamed_list.length +
      this.functions_renamed_list.length;
    var renamed_output_string =
      "\nDefinite Rename : Body Match\n" +
      this.functions_definite_body_renamed_list.join("\n") +
      "\nDefinite Rename : Name Match\n" +
      this.functions_definite_name_renamed_list.join("\n") +
      "\nPotential Renames\n" +
      this.functions_renamed_list.join("\n") +
      "\nTotal renames\n" +
      total_renames;

    console.log("Definite Rename : Body Match");
    console.log(this.functions_definite_body_renamed_list);
    console.log("Definite Rename : Name Match");
    console.log(this.functions_definite_name_renamed_list);
    console.log("Potential Renames");
    console.log(this.functions_renamed_list);
    console.log(
      "Total renames ",
      this.functions_definite_body_renamed_list.length +
        this.functions_definite_name_renamed_list.length +
        this.functions_renamed_list.length
    );
    return renamed_output_string;
  }
}
