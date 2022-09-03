import { Namespace_Parser } from "./NAMESPACE_PACKAGE/Namespace_Parser.js";
import { createRequire } from "module";
import { Comparison_Processor } from "./Comparison_Processor.js";
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
  }

  async compare() {
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

    const removed_functions = this.comparison_processor.getFunctionRemovals(
      namespace_parser_old.all_exported_functions_set,
      namespace_parser_new.all_exported_functions_set
    );

    //log writer
    console.log(removed_functions.length);
    this.log_writer.write("testing2");
  }
}
