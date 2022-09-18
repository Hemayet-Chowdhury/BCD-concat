import { FunctionExtraction } from "./FunctionExtraction.js";

// let old_library_all_functions = new FunctionExtraction(
//   "C:\\NodeProjects\\first_app\\R\\aa_parser_scratch\\final_2\\scater\\scater_release_3_9"
// );
// await old_library_all_functions.collectNodes();
// old_library_all_functions.getAllFunctions();
// old_library_all_functions.all_functions.forEach((functionNode) => {
//   console.log(functionNode);
// });
// console.log(old_library_all_functions.all_functions.length);
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");

import { Compare_2_libraries } from "./Compare_2_libraries.js";

let package_name = "single test";
const log_writer = fs.createWriteStream(
  "./test_logs/" + package_name + "_output_log.txt"
);
let test_collection = undefined;

let compare_2_libraries = new Compare_2_libraries(
  "single_test",
  "./final_2/DESeq2/deseq2_release_3_14",
  "./final_2/DESeq2/deseq2_master",
  log_writer,
  1,
  test_collection
);
let result_object = await compare_2_libraries.compare();
console.log("late testing");
console.log(result_object);

//to do
