import { Namespace_Parser } from "./Namespace_Parser.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

let namespace_file = await readFile("./S4Vectors_3_12_Namespace", "utf8");
const ns = new Namespace_Parser(namespace_file);
//console.log(ns.cleaned_namespace_file);
