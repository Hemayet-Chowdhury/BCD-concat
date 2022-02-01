export class TreeAnalyser {
  constructor(ts_ast) {
    this.ts_ast = ts_ast;
    this.functionsDict = {};
    this.generateFunctionsList();
    this.refineFunctionsList();
  }
  generateFunctionsList() {
    this.ts_ast.statements.forEach((statement) => {
      //for S3 functions
      if (statement?.expression?.left?.right?.operand?.parameters) {
        //remove decor here
        this.functionsDict[
          "Function Name : " +
            statement.expression.left.left.escapedText +
            "(...) | Function Declaration Type : S3"
        ] = statement.expression.left.right.operand;
        return;
      }

      if (statement?.expression?.left?.escapedText) {
        //remove decor here
        if (!statement.expression.right.operand) {
          this.functionsDict[
            "Function Name : " +
              statement.expression.left.escapedText +
              "(...) | Function Declaration Type : S3"
          ] = statement.expression.right;
        } else {
          this.functionsDict[
            "Function Name : " +
              statement.expression.left.escapedText +
              "(...) | Function Declaration Type : S3"
          ] = statement.expression.right.operand;
        }

        return;
      }
      //for S4 functions
      if (statement?.expression?.expression?.escapedText == "setMethod") {
        //not taking one liner set method function bodies into account. you'll have to write separate code if necessary in future.
        this.functionsDict[
          "Function Name : " +
            statement.expression.arguments[0].text +
            "(...) | Function Declaration Type : setMethod |  Signature: " +
            statement.expression.arguments[1].text
        ] = statement.expression.arguments[2];
      }
      if (
        statement?.expression?.expression?.escapedText == "setReplaceMethod"
      ) {
        //not taking one liner set method function bodies into account. you'll have to write separate code if necessary in future.
        this.functionsDict[
          "Function Name : " +
            statement.expression.arguments[0].text +
            "(...) | Function Declaration Type : setReplaceMethod |  Signature: " +
            statement.expression.arguments[1].text
        ] = statement.expression.arguments[2];
      }
    });
  }

  getFunctionsDict() {
    return this.functionsDict;
  }

  printFunctionsList() {
    for (let key in this.functionsDict) {
      console.log(key);
    }
  }

  printErrorFunctionsList() {
    for (let key in this.functionsDict) {
      if (this.functionsDict[key] == undefined) console.log(key);
    }
  }

  refineFunctionsList() {
    for (let key in this.functionsDict) {
      if (this.functionsDict[key] == undefined) {
        delete this.functionsDict[key];
      }
    }
  }
}
