import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

const { parse } = require("@xml-tools/parser");
const { buildAst, accept } = require("@xml-tools/ast");
import {
  getParameterWrapper,
  getAllTextRecursively,
  checkFunctionPresenceinSetMethodRecursively,
  FunctionModel,
  getFunctionBodyParentNode,
} from "./FunctionExtractionUtils.js";
import { replaceAll } from "../aa_namespace_parser/Namespace_Utils.js";

let node_list = [];
let variant_node_list = [];
const addVisitor = {
  // Will be invoked once for each Element node in the AST.
  visitXMLElement: function (node) {
    if (node.name == "FUNCTION") {
      node_list.push(node.parent);
    }
    if (
      (node?.textContents[0]?.text == "setMethod" ||
        node?.textContents[0]?.text == "setReplaceMethod") &&
      !checkFunctionPresenceinSetMethodRecursively(node.parent.parent)
    ) {
      variant_node_list.push(node.parent.parent);
    }
  },

  // An XML AST Visitor may have other methods as well, see the api.d.ts file/
};

// Invoking the Visitor
const xmlText = await readFile("./output_ast.txt", "utf8");
const { cst, tokenVector } = parse(xmlText);
const xmlDocAst = buildAst(cst, tokenVector);
accept(xmlDocAst, addVisitor);

function getS3FunctionNames(node) {
  if (
    node?.parent?.subElements[0]?.subElements[0]?.name === "SYMBOL" &&
    node?.parent?.subElements[1].name === "LEFT_ASSIGN"
  ) {
    let raw_functionName =
      node?.parent?.subElements[0]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let signature = undefined;
    let parameters = getParameterWrapper(node);
    let replacement_function = undefined;
    let body_node = getFunctionBodyParentNode(node);
    if (body_node) {
      console.log(getAllTextRecursively(body_node));
    }

    return new FunctionModel(
      functionName,
      signature,
      parameters,
      replacement_function
    );
  }
}

function getSetMethodNames(node) {
  if (
    node?.parent?.subElements[0]?.subElements[0]?.textContents[0]?.text ==
    "setMethod"
  ) {
    let raw_functionName =
      node?.parent?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let raw_signature =
      node?.parent?.subElements[4]?.subElements[0]?.textContents[0]?.text;
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = getParameterWrapper(node);
    let replacement_function = undefined;
    let body_node = getFunctionBodyParentNode(node);
    if (body_node) {
      console.log(getAllTextRecursively(body_node));
    }

    return new FunctionModel(
      functionName,
      signature,
      parameters,
      replacement_function
    );
  }
}

function getSetReplaceMethodNames(node) {
  if (
    node?.parent?.subElements[0]?.subElements[0]?.textContents[0]?.text ==
    "setReplaceMethod"
  ) {
    let raw_functionName =
      node?.parent?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let signature = getAllTextRecursively(node?.parent?.subElements[4]);
    let parameters = getParameterWrapper(node);
    let replacement_function = undefined;
    return new FunctionModel(
      functionName,
      signature,
      parameters,
      replacement_function
    );
  }
}

function getSetMethodVariant2Names(node) {
  if (
    node?.subElements[0]?.subElements[0]?.textContents[0]?.text == "setMethod"
  ) {
    let raw_functionName =
      node?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let raw_signature = getAllTextRecursively(node?.subElements[4]);
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = undefined;
    let replacement_function =
      node?.subElements[6].subElements[0].textContents[0].text;
    return new FunctionModel(
      functionName,
      signature,
      parameters,
      replacement_function
    );
  }
}

function getSetReplaceMethodVariant2Names(node) {
  if (
    node?.subElements[0]?.subElements[0]?.textContents[0]?.text ==
    "setReplaceMethod"
  ) {
    let raw_functionName =
      node?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let raw_signature = getAllTextRecursively(node?.subElements[4]);
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = undefined;
    let replacement_function =
      node?.subElements[6].subElements[0].textContents[0].text;
    return new FunctionModel(
      functionName,
      signature,
      parameters,
      replacement_function
    );
  }
}

node_list.forEach((node) => console.log(getS3FunctionNames(node)));

node_list.forEach((node) => console.log(getSetMethodNames(node)));
node_list.forEach((node) => console.log(getSetReplaceMethodNames(node)));

variant_node_list.forEach((node) => {
  console.log(getSetMethodVariant2Names(node));
});
variant_node_list.forEach((node) => {
  console.log(getSetReplaceMethodVariant2Names(node));
});

// figure out which library has most parameter and function removals
// create R loop to generate ast for all of them. in THAT FOLDER
// parse all files and create functions list
// bring namespace parser in and cross check
//scater 3_9 to 3_11

//handle split by = and get last element case
//get library version
// dr. meng topics :
//talk about release versions
//https://www.bioconductor.org/about/
