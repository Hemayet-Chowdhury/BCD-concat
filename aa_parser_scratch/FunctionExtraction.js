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
    this.all_functions_hash_list = {};
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
        let actual_filename = replaceAll(filename, "_ast", "");
        let wrapper = { node: node, filename: actual_filename };
        this.node_list.push(wrapper);
      });
      variant_node_list.forEach((node) => {
        let actual_filename = replaceAll(filename, "_ast", "");
        let wrapper = { node: node, filename: actual_filename };
        this.variant_node_list.push(wrapper);
      });
    }
  }

  getAllFunctions() {
    this.node_list.forEach((wrapper) => {
      let S3FunctionModel = getS3Functions(wrapper);
      if (S3FunctionModel) {
        this.all_functions.push(S3FunctionModel);
      }

      let setMethodFunctionModel = getSetMethodFunctions(wrapper);
      if (setMethodFunctionModel) {
        this.all_functions.push(setMethodFunctionModel);
      }

      let setReplaceMethodFunctionModel = getSetReplaceMethodFunctions(wrapper);
      if (setReplaceMethodFunctionModel) {
        this.all_functions.push(setReplaceMethodFunctionModel);
      }
    });

    this.variant_node_list.forEach((wrapper) => {
      let setMethodVariant2FunctionModel =
        getSetMethodVariant2Functions(wrapper);
      if (setMethodVariant2FunctionModel) {
        this.all_functions.push(setMethodVariant2FunctionModel);
      }

      let setReplaceMethodVariant2FunctionsModel =
        getSetReplaceMethodVariant2Functions(wrapper);
      if (setReplaceMethodVariant2FunctionsModel) {
        this.all_functions.push(setReplaceMethodVariant2FunctionsModel);
      }
    });
  }

  getFunctionsHashList() {
    this.all_functions.forEach((functionNode) => {
      if (
        this.all_functions_hash_list.hasOwnProperty(functionNode.representation)
      ) {
        this.all_functions_hash_list[functionNode.representation].push(
          functionNode
        );
      } else {
        this.all_functions_hash_list[functionNode.representation] = [];
        this.all_functions_hash_list[functionNode.representation].push(
          functionNode
        );
      }
    });
  }

  fixReplacementFunctions() {
    this.all_functions.forEach((functionModel) => {
      if (functionModel.replacementFunction) {
        let replacementFunction = functionModel.replacementFunction;
        this.all_functions.forEach((searchModel) => {
          if (searchModel.name == replacementFunction) {
            functionModel.parameters = searchModel.parameters;
          }
        });
      }
    });
  }
  printReplacementFunctions() {
    console.log("length of all_functions", this.all_functions.length);
    this.all_functions.forEach((functionModel) => {
      if (functionModel.replacementFunction) {
        console.log(functionModel);
      }
    });
  }

  printSpecificFunction(name) {
    this.all_functions.forEach((model) => {
      if (model.name == name) {
        console.log(model);
      }
    });
  }
}
