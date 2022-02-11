export class Rename_Tree_Analyser {
  constructor(ts_ast) {
    this.ts_ast = ts_ast;
    this.functionsDict = {};
    this.generateFunctions();
    this.refineFunctionsList();
  }

  refineFunctionsList() {
    for (let key in this.functionsDict) {
      if (this.functionsDict[key] == undefined) {
        delete this.functionsDict[key];
      }
    }
  }
  generateFunctions() {
    this.ts_ast._compilerNode.statements.forEach((statement) => {
      //handle S3 functions

      if (
        statement?.expression?.left &&
        statement?.expression?.right?.parameters
      ) {
        var functionName = statement.expression.left
          .getFullText()
          .replace(/(\r\n|\n|\r)/gm, "");

        functionName = functionName.replace(/\s/g, "");
        this.functionsDict[functionName] =
          statement.expression.right.getFullText();
      }

      if (
        statement?.expression?.left &&
        statement?.expression?.right?.operand?.parameters
      ) {
        var functionName = statement.expression.left
          .getFullText()
          .replace(/(\r\n|\n|\r)/gm, "");

        functionName = functionName.replace(/\s/g, "");
        this.functionsDict[functionName] =
          statement.expression.right.getFullText();
      }

      //handle setMethod functions
      if (
        statement?.expression?.arguments &&
        statement?.expression?.arguments[2]?.parameters
      ) {
        var functionName = statement.expression.arguments[0].getFullText();
        functionName = functionName.replace('"', "");
        functionName = functionName.replace('"', "");
        // console.log("->" + functionName);
        this.functionsDict[functionName] =
          statement.expression.arguments[2].getFullText();
      }
    });
  }

  printFunctionsDict() {
    console.log(Object.keys(this.functionsDict));
  }

  getFunctionsDict() {
    return this.functionsDict;
  }
}
