import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const util = require("util");
import { MongoClient } from "mongodb";
const readdir = util.promisify(fs.readdir);
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

await client.connect();
const database = client.db("myNewDB");
const collection = database.collection("alpha");

var data = [];
var length = 31; // user defined length

for (var i = 0; i < length; i++) {
  data.push(0);
}

let selected_libs = new Set();
let time_across_10 = [];
for (var i = 0; i < 12; i++) {
  time_across_10.push(0);
}
await collection.find({}).toArray(function (err, result) {
  if (err) throw err;
  result.forEach((obj) => {
    let release_num = obj.new_release_number;
    if (release_num >= 10) {
      selected_libs.add(obj.package);
    }
  });
  result.forEach((obj) => {
    let release_num = obj.new_release_number;
    let pack = obj.package;
    if (selected_libs.has(pack) && release_num <= 10) {
      time_across_10[release_num] += obj.parameter_overall_changes;
    }
  });
  client.close();
  console.log(selected_libs);
  time_across_10.forEach((num) => {
    console.log(num);
  });
  console.log(time_across_10);
  console.log("test");
});
