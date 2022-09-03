//to-do
//for every .R file in every package in master folder, dump their ast-s in thatfilename_ast.txt

const R = require("r-integration");

let result = R.executeRScript("./R_ast.R");
console.log(result);
