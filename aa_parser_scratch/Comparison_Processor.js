import {
  checkDuplicateS3,
  checkNonDefaultAddition,
  checkNonDefaultRemoval,
  checkOverallParameterNonBreaking,
  checkTripleDots,
  nodifyParameters,
  processParametersString,
} from "./Parameter_Processor.js";

export class Comparison_Processor {
  constructor() {
    //init all param removal arrays here
    // create comparison functions in parameter processor
    //keep adding parameters to the arrays here from the loop
    //should be two function set
    this.overallParameterChanges = [];
    this.parameterRemovals = [];
    this.parameterAdditions = [];
    this.parameterRenames = [];
    this.parameterWarnings = [];
    this.uncaught = [];
  }
  getFunctionRemovals(set_old, set_new) {
    this.result = [];
    set_old.forEach((functionName) => {
      if (!set_new.has(functionName)) {
        this.result.push(functionName);
      }
    });
    return this.result;
  }

  getFunctionAdditions(set_old, set_new) {
    this.result = [];
    set_new.forEach((functionName) => {
      if (!set_old.has(functionName)) {
        this.result.push(functionName);
      }
    });
    return this.result;
  }

  filterLibrary(hash_list, namespace_set) {
    let result = {};
    for (let elem in hash_list) {
      if (namespace_set.has(elem)) {
        result[elem] = hash_list[elem];
      }
    }

    return result;
  }

  debug_filter(set, list) {
    let result = [];
    set.forEach((elem) => {
      if (!list.includes(elem)) {
        result.push(elem);
      }
    });
    return result;
  }

  getBodyRenames(old_hash, new_hash, removed_list, added_list) {
    let result = [];
    let old_filtered_list = [];
    let new_filtered_list = [];
    removed_list.forEach((functionName) => {
      if (old_hash[functionName]) {
        old_filtered_list.push(...old_hash[functionName]);
      }
    });
    added_list.forEach((functionName) => {
      if (new_hash[functionName]) {
        new_filtered_list.push(...new_hash[functionName]);
      }
    });
    old_filtered_list.forEach((old_model) => {
      new_filtered_list.forEach((new_model) => {
        if (old_model.body == new_model.body) {
          result.push({ old_function: old_model, new_function: new_model });
        }
      });
    });
  }

  checkNames(old_list, new_list) {
    let result = [];
    old_list.forEach((old_name) => {
      let old_lower = old_name.toLowerCase();
      let old_clean = "";
      for (let i = 0; i < old_lower.length; i++) {
        let character = old_lower[i];
        if (
          (character >= "0" && character <= "9") ||
          (character >= "a" && character <= "z") ||
          (character >= "A" && character <= "Z")
        ) {
          old_clean += character;
        }
      }
      new_list.forEach((new_name) => {
        let new_lower = new_name.toLowerCase();

        let new_clean = "";

        for (let i = 0; i < new_lower.length; i++) {
          let character = new_lower[i];
          if (
            (character >= "0" && character <= "9") ||
            (character >= "a" && character <= "z") ||
            (character >= "A" && character <= "Z")
          ) {
            new_clean += character;
          }
        }
        if (old_clean == new_clean) {
          result.push({ old_function: old_clean, new_function: new_clean });
        }
      });
    });
  }

  getParameterModifications(old_hash_list, new_hash_list) {
    for (let common_key in old_hash_list) {
      if (new_hash_list.hasOwnProperty(common_key)) {
        let old_array = old_hash_list[common_key];
        let new_array = new_hash_list[common_key];
        if (checkDuplicateS3(old_array) || checkDuplicateS3(new_array))
          continue;
        for (let old_node of old_array) {
          if (!old_node.parameters) {
            // console.log("undefined params", old_node);
            continue;
          }
          for (let new_node of new_array) {
            if (!new_node.parameters) {
              //  console.log("undefined params", new_node);
              continue;
            }
            //parameter comparison starts
            let joint_obj = { old_function: old_node, new_function: new_node };
            if (old_node.signature == new_node.signature) {
              let old_param_processed = processParametersString(
                old_node.parameters
              );
              let old_param_node_list = nodifyParameters(old_param_processed);
              let new_param_processed = processParametersString(
                new_node.parameters
              );
              let new_param_node_list = nodifyParameters(new_param_processed);
              if (
                checkTripleDots(old_param_node_list) ||
                checkTripleDots(new_param_node_list)
              ) {
                continue;
              } else {
                if (
                  !checkOverallParameterNonBreaking(
                    old_param_node_list,
                    new_param_node_list
                  )
                ) {
                  this.overallParameterChanges.push(joint_obj);
                }
                if (
                  checkNonDefaultRemoval(
                    old_param_node_list,
                    new_param_node_list
                  )
                ) {
                  this.parameterRemovals.push(joint_obj);
                } else if (
                  checkNonDefaultAddition(
                    old_param_node_list,
                    new_param_node_list
                  )
                ) {
                  this.parameterAdditions.push(joint_obj);
                }
              }
            }

            //parameter comparison ends
          }
        }
      }
    }
  }
}
