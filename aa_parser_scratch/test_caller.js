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

let package_name = "scater";
const log_writer = fs.createWriteStream(
  "./test_logs/" + package_name + "_output_log.txt"
);

let compare_2_libraries = new Compare_2_libraries(
  "scater",
  "./final_2/scater/scater_release_3_5",
  "./final_2/scater/scater_release_3_6",
  log_writer
);
await compare_2_libraries.compare();

//to do
