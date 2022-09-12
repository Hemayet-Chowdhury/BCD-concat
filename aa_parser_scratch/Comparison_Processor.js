import {
  checkDefaultChange,
  checkParameterAddition,
  checkParameterRemoval,
  checkParameterReorganization,
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
    this.parameterRemovals = [];
    this.parameterAdditions = [];
    this.paremeterRenames = [];
    this.paremeterWarnings = [];
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

  getParameterModifications(old_hash_list, new_hash_list) {
    for (let common_key in old_hash_list) {
      if (new_hash_list.hasOwnProperty(common_key)) {
        old_array = old_hash_list[common_key];
        new_array = new_hash_list[common_key];
        for (let old_node in old_array) {
          for (let new_node in new_array) {
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
                  checkParameterRemoval(
                    old_param_node_list,
                    new_param_node_list
                  )
                ) {
                  this.parameterRemovals.push(joint_obj);
                  continue;
                } else {
                  if (
                    checkParameterReorganization(
                      old_param_node_list,
                      new_param_node_list
                    )
                  ) {
                    this.parameterRenames.push(joint_obj);
                  } else {
                    if (
                      checkParameterAddition(
                        old_param_node_list.new_param_node_list
                      )
                    ) {
                      this.parameterAdditions.push(joint_obj);
                    } else {
                      if (
                        checkDefaultChange(
                          old_param_node_list,
                          new_param_node_list
                        )
                      ) {
                        this.paremeterWarnings.push(joint_obj);
                      }
                    }
                  }
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
