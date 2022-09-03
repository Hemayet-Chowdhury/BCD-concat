import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const path = require("path");

const { parse } = require("@xml-tools/parser");
const { buildAst, accept } = require("@xml-tools/ast");
import {
  getParameterWrapper,
  getAllTextRecursively,
  checkFunctionPresenceinSetMethodRecursively,
  FunctionModel,
  getNodesWrapper,
  getS3Functions,
  getSetMethodFunctions,
  getSetReplaceMethodFunctions,
  getSetMethodVariant2Functions,
  getSetReplaceMethodVariant2Functions,
} from "./FunctionExtractionUtils.js";
import { replaceAll } from "../aa_namespace_parser/Namespace_Utils.js";

export class FunctionExtraction {
  constructor(directory) {
    this.directory = directory;
    this.node_list = [];
    this.variant_node_list = [];
    this.R_directory = directory + "\\R";
    this.all_functions = [];
  }

  async collectNodes() {
    let normalized_directory = path.normalize(this.R_directory);
    let all_file_names = await readdir(normalized_directory);
    let ast_file_names = all_file_names.filter((file_name) => {
      let last_six = file_name.slice(-7);
      if (last_six === "ast.txt") return true;
    });
    for (let filename of ast_file_names) {
      let xmlNewText = await readFile(
        path.normalize(normalized_directory + "/" + filename),
        "utf8"
      );
      const { cst, tokenVector } = await parse(xmlNewText);
      const xmlDocAstNew = await buildAst(cst, tokenVector);
      const { node_list, variant_node_list } = getNodesWrapper(xmlDocAstNew);
      node_list.forEach((node) => {
        this.node_list.push(node);
      });
      variant_node_list.forEach((node) => {
        this.variant_node_list.push(node);
      });
    }
  }

  getAllFunctions() {
    this.node_list.forEach((node) => {
      let S3FunctionModel = getS3Functions(node);
      if (S3FunctionModel) {
        this.all_functions.push(S3FunctionModel);
      }

      let setMethodFunctionModel = getSetMethodFunctions(node);
      if (setMethodFunctionModel) {
        this.all_functions.push(setMethodFunctionModel);
      }

      let setReplaceMethodFunctionModel = getSetReplaceMethodFunctions(node);
      if (setReplaceMethodFunctionModel) {
        this.all_functions.push(setReplaceMethodFunctionModel);
      }

      let setMethodVariant2FunctionModel = getSetMethodVariant2Functions(node);
      if (setMethodVariant2FunctionModel) {
        this.all_functions.push(setMethodVariant2FunctionModel);
      }

      let setReplaceMethodVariant2FunctionsModel =
        getSetReplaceMethodVariant2Functions(node);
      if (setReplaceMethodVariant2FunctionsModel) {
        this.all_functions.push(setReplaceMethodVariant2FunctionsModel);
      }
    });
  }
}
