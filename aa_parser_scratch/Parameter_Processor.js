import { replaceAll } from "../aa_namespace_parser/Namespace_Utils.js";

let param_str = `function ( samples = NULL , files = (f1 = NULL, f2 = none)  , log = NULL , type = "kallisto" , txOut = TRUE , logExprsOffset = 1 , verbose = TRUE , ... )`;
let param2_str = `function ( samples = NULL , files = (f1 = NULL, f2 = none)  , log = NULL , type = "kallisto" , txOut = TRUE , logExprsOffset = 1 , verbose = TRUE , ..., abc=b )`;

export function processParametersString(str) {
  let open_counter = 0;
  let res = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      open_counter++;
    } else if (str[i] == ")") {
      open_counter--;
    }
    if (str[i] == "," && open_counter > 1) {
      res += "#*#"; //maps to comma (,)
    } else if (str[i] == "=" && open_counter > 1) {
      res += "#^#"; // maps to equal (=)
    } else {
      if (open_counter > 0) res += str[i];
    }
  }
  return res.substring(1, res.length);
}

export function nodifyParameters(arr) {
  let res = [];
  let split_arr = arr.split(",");
  split_arr.forEach((item) => {
    let raw_name = item.split("=")[0];
    let raw_value = item.split("=")[1];
    let trimmed_name;
    if (raw_name) {
      trimmed_name = raw_name.trim();
    }
    let trimmed_value;
    let cleaned_value_comma;
    let cleaned_value_equal;
    if (raw_value) {
      trimmed_value = raw_value.trim();
      cleaned_value_comma = replaceAll(trimmed_value, "#*#", ",");
      cleaned_value_equal = replaceAll(cleaned_value_comma, "#^#", "=");
    }
    res.push({ name: trimmed_name, value: cleaned_value_equal });
  });
  return res;
}

export function checkTripleDots(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.name == "...") return true;
  }

  return false;
}

export function checkParameterRemoval(arr_old, arr_new) {
  return arr_new.length < arr_old.length;
}

export function checkParameterReorganization(arr_old, arr_new) {
  for (let i = 0; i < arr_old.length; i++) {
    //iterate through both arrays and check names. add to broken array
    // iteratre through both arrays and check last parameters for default skip
    //parameters may have been renamed or reorganized
    if (arr_old[i]?.name != arr_new[i]?.name) {
      console.log(arr_new[i]?.name);
      return true;
    }
  }

  return false;
}

export function checkParameterAddition(arr_old, arr_new) {
  for (let i = arr_old.length; i < arr_new.length; i++) {
    if (!arr_new[i]?.value) {
      //parameters added without default value

      return true;
    }
  }
  return false;
}
export function checkSame(arr_old, arr_new) {
  for (let i = 0; i < arr_old.length; i++) {
    if (arr_old[i]?.name != arr_new[i]?.name) {
      return false;
    }
  }

  return true;
}

export function checkDefaultChange(arr_old, arr_new) {
  if (checkSame(arr_old, arr_new)) {
    for (let i = 0; i < arr_old.length; i++) {
      if (arr_old[i]?.value != arr_new[i]?.value) {
        return true;
      }
    }
  }
  return false;
}
let processed_string = processParametersString(param_str);
let node_list = nodifyParameters(processed_string);

let processed_string2 = processParametersString(param2_str);
let node_list2 = nodifyParameters(processed_string2);
console.log(checkParameterAddition(node_list, node_list2));
console.log(node_list2);
console.log(checkDefaultChange(node_list, node_list2));
//test removal and addition functions