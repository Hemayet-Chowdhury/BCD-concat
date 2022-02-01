import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const ts = require("typescript");
import { Project } from "ts-morph";

const readline = require("readline");
const path = require("path");
import { Rename_Tree_Analyser } from "./Rename_Tree_Analyser.js";
import { Rename_Node_Processor } from "./Rename_Node_Processor.js";

const absolute_base = "C:\\Users\\hemay\\Desktop\\research_workbench\\RECENT\\";
const raw_old_root = absolute_base + "case ts_morph_test\\version old";
const base_old_root = path.normalize(raw_old_root);
// prettier-ignore
const raw_new_root = absolute_base + "case ts_morph_test\\version new";
const base_new_root = path.normalize(raw_new_root);

const old_root_dir = base_old_root + "/R";
const new_root_dir = base_new_root + "/R";

const old_ns_link = base_old_root + "/NAMESPACE";
const new_ns_link = base_new_root + "/NAMESPACE";

var project = new Project();
let filename1 = fs.readFileSync(old_root_dir + "/file3.R", "utf8");
const source_ast = project.createSourceFile("temp.ts", filename1);
var rename_tree_analyser = new Rename_Tree_Analyser(source_ast);
var rename_node_processor = new Rename_Node_Processor();
rename_node_processor.printTest();
