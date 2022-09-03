import {
  getTokensFromSimplePatternArray,
  getTokensFromS3MethodPatternArray,
  getTokensFromImportFromPatternArray,
} from "./Namespace_Utils.js";

export class Namespace_Parser {
  constructor(namespace_file) {
    this.cleaned_namespace_file = this.readCleanedFile(namespace_file);
    //console.log(this.cleaned_namespace_file);
    this.list_export_methods = this.getExportMethods(
      this.cleaned_namespace_file
    );
    this.list_export = this.getExport(this.cleaned_namespace_file);
    this.list_S3_method = this.getS3Method(this.cleaned_namespace_file);
    this.list_export_classes = this.getExportClasses(
      this.cleaned_namespace_file
    );
    this.list_import = this.getImport(this.cleaned_namespace_file);
    this.list_import_from = this.getImportFrom(this.cleaned_namespace_file);
    this.set_all_exported_functions = this.getAllExportedFunctions([
      this.list_export,
      this.list_export_methods,
      this.list_S3_method,
    ]);
    console.log(
      "[NameSpace] Size of set",
      this.set_all_exported_functions.size
    );
  }

  /* This function takes in a namespace file and cleans out the comments. 
  @Params : namespace file
  @Return : cleaned string.
  */
  readCleanedFile(namespace_file) {
    let lines = namespace_file.split("\n");

    let cleaned_lines = lines.filter(function (line) {
      return !line.includes("#");
    });

    let cleaned_namespace_file = cleaned_lines.join("\n");
    return cleaned_namespace_file;
  }

  /*
  get all tokens under "exportMethods" pattern
  @param text : cleaned namespace file text, input as a string
  @return array of tokens
  */
  getExportMethods(text) {
    let extracted_raw = text.match(/(?<=exportMethods\().*?(?=\))/gs);
    if (extracted_raw == null) {
      console.debug("no pattern match for exportMethods");
      return [];
    }
    let tokens = getTokensFromSimplePatternArray(extracted_raw);
    return tokens;
  }

  /*
  get all tokens under "export" pattern
  @param text : cleaned namespace file text, input as a string
  @return array of tokens
  */
  getExport(text) {
    let extracted_raw = text.match(/(?<=export\().*?(?=\))/gs);
    if (extracted_raw == null) {
      console.debug("no pattern match for export");
      return [];
    }
    let tokens = getTokensFromSimplePatternArray(extracted_raw);
    // console.log(tokens);
    return tokens;
  }

  /*
  get all combined tokens under "S3method" pattern
  @param text : cleaned namespace file text, input as a string
  @return array of tokens
  */
  getS3Method(text) {
    let extracted_raw = text.match(/(?<=S3method\().*?(?=\))/gs);
    if (extracted_raw == null) {
      console.debug("no pattern match for S3method");
      return [];
    }
    let tokens = getTokensFromS3MethodPatternArray(extracted_raw);
    return tokens;
  }

  /*
  get all combined tokens under "exportClasses" pattern
  @param text : cleaned namespace file text, input as a string
  @return array of tokens
  */
  getExportClasses(text) {
    let extracted_raw = text.match(/(?<=exportClasses\().*?(?=\))/gs);
    if (extracted_raw == null) {
      console.debug("no pattern match for exportClasses");
      return [];
    }
    let tokens = getTokensFromSimplePatternArray(extracted_raw);
    return tokens;
  }

  /*
  get all combined tokens under "import" pattern
  @param text : cleaned namespace file text, input as a string
  @return array of tokens
  */
  getImport(text) {
    let extracted_raw = text.match(/(?<=import\().*?(?=\))/gs);
    if (extracted_raw == null) {
      console.debug("no pattern match for import");
      return [];
    }
    let tokens = getTokensFromSimplePatternArray(extracted_raw);
    return tokens;
  }

  /*
  get all combined tokens under "import" pattern
  @param text : cleaned namespace file text, input as a string
  @return array of tokens
  */
  getImportFrom(text) {
    let extracted_raw = text.match(/(?<=importFrom\().*?(?=\))/gs);
    if (extracted_raw == null) {
      console.debug("no pattern match for importFrom");
      return [];
    }
    let tokens = getTokensFromImportFromPatternArray(extracted_raw);
    return tokens;
  }

  getAllExportedFunctions(parent_array) {
    const result_set = new Set();
    parent_array.forEach((arr) => {
      arr.forEach((functionName) => {
        result_set.add(functionName);
      });
    });
    return result_set;
  }
} // end file

//to do

// check for duplicates in set (all functions set)
// check against 5 other namespace files. see if all patterns are covered.
