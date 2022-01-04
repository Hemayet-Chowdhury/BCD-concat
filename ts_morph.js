import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { Project } from "ts-morph";
const fs = require("fs");
const ts = require("typescript");

class NodeProcessor{
    constructor(source_ast, target_ast) {
          this.old_dict = source_ast.getFunctionsDict();
          this.new_dict = target_ast.getFunctionsDict(); 
          this.parameter_breaks = [];
          this.getParameterChanges();
          this.removed_functions = []; 
          this.getFunctionRemovals(); 
          this.added_functions = [];
          this.getFunctionsAdded();    
    }

    getParameterChanges(){
      for(let key in this.old_dict){
        let old_params = this.old_dict[key].parameters;
        if(!this.new_dict[key] ) continue;
        let new_params = this.new_dict[key].parameters;
        if(new_params.length < old_params.length){
          let param_issue = "Function "+key+"(...) had parameters removed in newer version.\nOriginal Parameters : "+key+"(";
          for(let j=0; j<old_params.length; j++){
            param_issue+=old_params[j].name.escapedText;
            if(j<old_params.length-2) param_issue+=", "
            
          }
          param_issue+="){...}\nNew Parameters : "+key+"(";
          for(let j=0; j<new_params.length; j++){
            param_issue+=new_params[j].name.escapedText;
            if(j<new_params.length-2) param_issue+=", "
            
          }
          param_issue+="){...}"
          
          this.parameter_breaks.push(param_issue);
          continue;
        }
        for(let i =0; i<old_params.length; i++){
          if(old_params[i].name.escapedText== new_params[i].name.escapedText){
            if(old_params[i].initializer == undefined && new_params[i].initializer == undefined ){
              continue;
            }
            if(old_params[i].initializer.escapedText == new_params[i].initializer.escapedText){
              continue;
            }

          }
          let param_issue = "Function "+key+"(...) had parameters modified in newer version.\nOriginal Parameters : "+key+"(";
          for(let j=0; j<old_params.length; j++){
            param_issue+=old_params[j].name.escapedText;
            if(old_params[j].initializer!=undefined) param_issue+=" = " +old_params[j].initializer.escapedText;
            if(j<old_params.length-2) param_issue+=", "
            
          }
          param_issue+="){...}\nNew Parameters : "+key+"(";
          for(let j=0; j<new_params.length; j++){
            param_issue+=new_params[j].name.escapedText;
            if(new_params[j].initializer!=undefined) param_issue+=" = " +new_params[j].initializer.escapedText;
            if(j<new_params.length-2) param_issue+=", "
            
          }
          param_issue+="){...}"
            this.parameter_breaks.push(param_issue);
            break;
        }

        for(let i=old_params.length; i<new_params.length;i++){
          if(new_params[i].initializer==undefined){
            let param_issue = "Function "+key+"(...) had non-default parameters added in newer version.\nOriginal Parameters : "+key+"(";
            for(let j=0; j<old_params.length; j++){
              param_issue+=old_params[j].name.escapedText;
              if(old_params[j].initializer!=undefined) param_issue+=" = " +old_params[j].initializer.escapedText;
              if(j<old_params.length-2) param_issue+=", "
              
            }
            param_issue+="){...}\nNew Parameters : "+key+"(";
            for(let j=0; j<new_params.length; j++){
              param_issue+=new_params[j].name.escapedText;
              if(new_params[j].initializer!=undefined) param_issue+=" = " +new_params[j].initializer.escapedText;
              if(j<new_params.length-1) param_issue+=", "
              
            }
            param_issue+="){...}"
            this.parameter_breaks.push(param_issue);
            break;
          }
        }

        

      }
    }

    printParameterChanges(){
      console.log("\n\n--------------------------------------")
      console.log("BREAKING CHANGES FROM PARAMETER MODIFICATIONS")
      console.log("--------------------------------------")
        this.parameter_breaks.forEach((param_issue, index) =>{
          console.log(index+1+". "+param_issue+"\n");
        });
    }

    getFunctionRemovals(){


      for(let key in this.old_dict){
        if(!this.new_dict.hasOwnProperty(key)){
          this.removed_functions.push(key);
        }
      }
    }

    printFunctionRemovals(){
      console.log("\n\n--------------------------------------")
      console.log("FUNCTIONS REMOVED IN NEWER VERSION :")
      console.log("--------------------------------------")

      this.removed_functions.forEach((functionName, index) =>{
        let params = this.old_dict[functionName].parameters
        let param_names = functionName+"( ";
        for(let i=0; i<params.length; i++){
          param_names+=params[i].name.escapedText;
          if(i<params.length-1) param_names+=", "
        }
        param_names += "){...}"
        console.log(index+1+". "+param_names)
      });
    }

    getFunctionsAdded(){


      for(let key in this.new_dict){
        if(!this.old_dict.hasOwnProperty(key)){
          this.added_functions.push(key);
        }
      }
    }

    printFunctionsAdded(){
      console.log("\n\n--------------------------------------")
      console.log("FUNCTIONS ADDED IN NEWER VERSION :")
      console.log("--------------------------------------")
      this.added_functions.forEach((functionName,index) =>{
        let params = this.new_dict[functionName].parameters
        let param_names = functionName+"( ";
        for(let i=0; i<params.length; i++){
          param_names+=params[i].name.escapedText;
          if(i<params.length-1) param_names+=", "
        }
        param_names += "){...}"
        console.log(index+1+". "+param_names)
      });
    }





  }


  class TreeAnalyser {
    constructor(ts_ast) {
      this.ts_ast = ts_ast
      this.functionsDict = {}
    //   this.generateFunctionsList();
      
    }
    generateFunctionsList() {
      this.ts_ast.statements.forEach((statement)=>{
        //for S3 functions
        if(statement?.expression?.left?.escapedText){
          //remove decor here
          this.functionsDict["Function Name : "+statement.expression.left.escapedText+ " | Function Declaration Type : S3"] = statement.expression.right.operand;
          return;
        }
        //for S4 functions
        if(statement?.expression?.expression?.escapedText == "setMethod"){
          
          //not taking one liner set method function bodies into account. you'll have to write separate code if necessary in future.
          this.functionsDict["Function Name : "+statement.expression.arguments[0].text+" | Function Declaration Type : setMethod |  Signature: "+statement.expression.arguments[1].text] = statement.expression.arguments[2];
        }
        if(statement?.expression?.expression?.escapedText == "setReplaceMethod"){
          
          //not taking one liner set method function bodies into account. you'll have to write separate code if necessary in future.
          this.functionsDict["Function Name : "+statement.expression.arguments[0].text+" | Function Declaration Type : setReplaceMethod |  Signature: "+statement.expression.arguments[1].text] = statement.expression.arguments[2];
        }
        

          
      });

      return this.functionsDict;
    }

    getFunctionsDict(){
        return this.functionsDict;
    }

    printFunctionsList(){
      for (let key in this.functionsDict){
        console.log(key);
      }

    }
  }

// var NodeProcessor = require('./NodeProcessor');
// var TreeAnalyser  = require('./TreeAnalyser');




const project = new Project();
const code = "console.log('hello world')";


var sourceString = "morph_tester.txt"
var targetString = "new_S4.txt"

let filename1 = fs.readFileSync(sourceString, "utf8");
let filename2 = fs.readFileSync(targetString, "utf8");



const sourceFile = project.createSourceFile("temp.ts", filename1);
let indent = 0;
function printOGTree(node) {
    console.log(new Array(indent + 1).join(' ') + node.getKindName());
    indent++;
    node.forEachChild(printOGTree);
    indent--;
}
// printOGTree(sourceFile._compilerNode.statements[0]);
let function1 = sourceFile._compilerNode.statements[0].expression.getFullText()
let function2 = sourceFile._compilerNode.statements[1].expression.getFullText()

var stringSimilarity = require("string-similarity");

var similarity = stringSimilarity.compareTwoStrings(function1, function2);
console.log(similarity)

