export class Rename_Tree_Analyser {
  constructor(ts_ast) {
    this.ts_ast = ts_ast;
    this.functionsDict = {};
    this.generateFunctions();
  }

  generateFunctions() {
    this.ts_ast._compilerNode.statements.forEach((statement) => {
      //handle S3 functions
      if (
        statement?.expression?.left &&
        statement?.expression?.right?.operand?.parameters
      ) {
        var functionName = statement.expression.left
          .getFullText()
          .replace(/(\r\n|\n|\r)/gm, "");
        this.functionsDict[functionName] =
          statement.expression.right.getFullText();
      }

      //handle setMethod functions
      if (
        statement?.expression?.arguments &&
        statement?.expression?.arguments[2]?.parameters
      ) {
        var functionName = statement.expression.arguments[0].getFullText();
        this.functionsDict[functionName] =
          statement.expression.arguments[2].getFullText();
      }
    });
  }

  printFunctionsDict() {
    console.log(Object.keys(this.functionsDict));
  }

  returnFunctionsDict() {
    return this.functionsDict;
  }
}
