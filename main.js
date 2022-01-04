
//fix type in package.json
const fs = require("fs");
const ts = require("typescript");
const acorn = require('acorn');
const babel = require("@babel/core");
var readlineSync = require('readline-sync');
var NodeProcessor = require('./NodeProcessor');
var TreeAnalyser  = require('./TreeAnalyser');
const { file } = require("@babel/types");
const { replace } = require("lodash");



var sourceString = "OLD_OUTPUT.txt"
var targetString = "NEW_OUTPUT.txt"

let filename1 = fs.readFileSync(sourceString, "utf8");
let filename2 = fs.readFileSync(targetString, "utf8");

// filename1 =  filename1.replace(".", "_dot_").replace("#", "//").replace("@", ".")
// filename2 =  filename2.replace(".", "_dot_").replace("#", "//").replace("@", ".")
function replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
 }

filename1 =  replaceAll(filename1, "#", "//")
filename2 =  replaceAll(filename2, "#", "//")

filename1 =  replaceAll(filename1, "@", ".")
filename2 =  replaceAll(filename2, "@", ".")

filename1 =  replaceAll(filename1, "\n.", "\n_")
filename2 =  replaceAll(filename2, "\n.", "\n_")

// console.log(filename1)

const ts_source_ast = ts.createSourceFile('temp1.ts', filename1);
const ts_target_ast = ts.createSourceFile('temp2.ts', filename2);








let old_version_tree = new TreeAnalyser(ts_source_ast)
let new_version_tree = new TreeAnalyser(ts_target_ast)
// console.log("Old Functions")
// old_version_tree.printErrorFunctionsList();
// console.log("\n\n\nNew Functions")
// new_version_tree.printFunctionsList();
let myNodeProcessor = new NodeProcessor(old_version_tree, new_version_tree);
myNodeProcessor.printFunctionRemovals();
myNodeProcessor.printFunctionsAdded();

myNodeProcessor.printParameterChanges();
myNodeProcessor.printParameterWarnings();







