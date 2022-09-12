import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { accept } = require("@xml-tools/ast");
import { replaceAll } from "../aa_namespace_parser/Namespace_Utils.js";

export class FunctionModel {
  constructor(
    name,
    representation,
    signature,
    parameters,
    replacementFunction
  ) {
    this.name = name;
    this.representation = representation;
    this.signature = signature;
    this.parameters = parameters;
    this.replacementFunction = replacementFunction;
  }
}
export const processParamArray = (token_array) => {
  let trimmed_token_array = token_array.map((token) => {
    return token.trim();
  });
  let cleaned_token_array = trimmed_token_array.filter(function (str) {
    if (str === "") return false;
    return true;
  });
  return cleaned_token_array.join(" ");
};

export function getParameterWrapper(node) {
  let paramArray = [];
  let flag = 0;
  const getParamText = {
    visitXMLElement: function (node) {
      if (node?.subElements[0]?.name == "OP-LEFT-BRACE") {
        flag = 1;
      }
      if (flag == 0) {
        if (node.name != "COMMENT") {
          var contents = node.textContents;
          var res = "";
          contents.forEach((d) => {
            res += " " + d.text;
          });
          //console.log(res);
          paramArray.push(res);
        }
      }
    },
  };

  accept(node, getParamText);
  return processParamArray(paramArray);
}

export function getAllTextRecursively(node) {
  if (node.subElements == undefined) return;
  let res = "";
  node.subElements.forEach((subElement) => {
    res +=
      subElement.textContents[0].text.trim() +
      " " +
      getAllTextRecursively(subElement);
  });
  return res;
}

export function getFunctionBodyParentNode(node) {
  let res = undefined;
  node.subElements.forEach((subElement) => {
    if (subElement?.subElements[0]?.name == "OP-LEFT-BRACE") {
      res = subElement;
      return;
    }
  });
  return res;
}

export function checkFunctionPresenceinSetMethodRecursively(node) {
  if (node.subElements == undefined) return;
  let flag = false;
  node.subElements.forEach((subElement) => {
    if (subElement.name == "FUNCTION") {
      flag = true;
    }
    flag = flag || checkFunctionPresenceinSetMethodRecursively(subElement);
  });

  return flag;
}

export function getNodesWrapper(xmlDocAst) {
  const node_list = [];
  const variant_node_list = [];
  const addVisitor = {
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
  };

  accept(xmlDocAst, addVisitor);
  return { node_list: node_list, variant_node_list: variant_node_list };
}

export function getS3Functions(node) {
  if (
    node?.parent?.subElements[0]?.subElements[0]?.name === "SYMBOL" &&
    node?.parent?.subElements[1].name === "LEFT_ASSIGN"
  ) {
    let raw_functionName =
      node?.parent?.subElements[0]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let representation = functionName;
    let signature = undefined;
    let parameters = getParameterWrapper(node);
    let replacement_function = undefined;
    return new FunctionModel(
      functionName,
      representation,
      signature?.trim(),
      parameters,
      replacement_function
    );
  }
}

export function getSetMethodFunctions(node) {
  if (
    node?.parent?.subElements[0]?.subElements[0]?.textContents[0]?.text ==
    "setMethod"
  ) {
    let raw_functionName =
      node?.parent?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let representation = functionName;
    let raw_signature = getAllTextRecursively(node?.parent?.subElements[4]);
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = getParameterWrapper(node);
    let replacement_function = undefined;

    return new FunctionModel(
      functionName,
      representation,
      signature?.trim(),
      parameters,
      replacement_function
    );
  }
}

export function getSetReplaceMethodFunctions(node) {
  if (
    node?.parent?.subElements[0]?.subElements[0]?.textContents[0]?.text ==
    "setReplaceMethod"
  ) {
    let raw_functionName =
      node?.parent?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let representation = functionName + "<-";
    let raw_signature = getAllTextRecursively(node?.parent?.subElements[4]);
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = getParameterWrapper(node);
    let replacement_function = undefined;
    return new FunctionModel(
      functionName,
      representation,
      signature?.trim(),
      parameters,
      replacement_function
    );
  }
}

export function getSetMethodVariant2Functions(node) {
  if (
    node?.subElements[0]?.subElements[0]?.textContents[0]?.text == "setMethod"
  ) {
    let raw_functionName =
      node?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let representation = functionName;
    let raw_signature = getAllTextRecursively(node?.subElements[4]);
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = undefined;
    let replacement_function =
      node?.subElements[6].subElements[0].textContents[0].text;
    return new FunctionModel(
      functionName,
      representation,
      signature?.trim(),
      parameters,
      replacement_function
    );
  }
}

export function getSetReplaceMethodVariant2Functions(node) {
  if (
    node?.subElements[0]?.subElements[0]?.textContents[0]?.text ==
    "setReplaceMethod"
  ) {
    let raw_functionName =
      node?.subElements[2]?.subElements[0]?.textContents[0]?.text;
    let functionName = replaceAll(raw_functionName, '"', "");
    let representation = functionName + "<-";
    let raw_signature = getAllTextRecursively(node?.subElements[4]);
    let signature = replaceAll(raw_signature, '"', "");
    let parameters = undefined;
    let replacement_function =
      node?.subElements[6].subElements[0].textContents[0].text;
    return new FunctionModel(
      functionName,
      representation,
      signature?.trim(),
      parameters,
      replacement_function
    );
  }
}
