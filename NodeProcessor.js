export class NodeProcessor {
  constructor(
    old_main_dict,
    new_main_dict,
    old_location_dict,
    new_location_dict
  ) {
    this.old_dict = old_main_dict;
    this.new_dict = new_main_dict;
    this.old_location_dict = old_location_dict;
    this.new_location_dict = new_location_dict;
    this.parameter_breaks = [];
    this.parameter_warnings = [];
    this.getParameterChanges();
    this.removed_functions = [];
    this.getFunctionRemovals();
    this.added_functions = [];
    this.getFunctionsAdded();
  }

  getParameterChanges() {
    for (let key in this.old_dict) {
      // if(this.old_dict[key]==undefined) console.log(this.old_dict[key])
      let old_params = this.old_dict[key].parameters;
      if (!this.new_dict[key]) continue;
      let new_params = this.new_dict[key].parameters;
      //ERROR WRAPPER 1
      if (new_params == undefined || old_params == undefined) continue;
      //ERROR WRAPPER 1 ends
      if (new_params.length < old_params.length) {
        let param_issue =
          "" +
          key +
          " had parameters removed in newer version.\nOriginal Parameters : " +
          "(";
        for (let j = 0; j < old_params.length; j++) {
          param_issue += old_params[j].name.escapedText;
          if (j < old_params.length - 2) param_issue += ", ";
        }
        param_issue += "){...}\nNew Parameters : " + "(";
        for (let j = 0; j < new_params.length; j++) {
          param_issue += new_params[j].name.escapedText;
          if (j < new_params.length - 2) param_issue += ", ";
        }
        param_issue += "){...}";

        this.parameter_breaks.push(
          param_issue + " FILE : " + this.old_location_dict[key]
        );
        continue;
      }
      for (let i = 0; i < old_params.length; i++) {
        if (old_params[i].name.escapedText == new_params[i].name.escapedText) {
          if (
            old_params[i].initializer == undefined &&
            new_params[i].initializer == undefined
          ) {
            continue;
          }
          if (
            old_params[i].initializer?.escapedText ==
            new_params[i].initializer?.escapedText
          ) {
            continue;
          }
        }
        let param_issue =
          "" +
          key +
          " had parameters modified in newer version.\nOriginal Parameters : " +
          "(";
        for (let j = 0; j < old_params.length; j++) {
          param_issue += old_params[j].name.escapedText;
          if (old_params[j].initializer != undefined)
            param_issue += " = " + old_params[j].initializer.escapedText;
          if (j < old_params.length - 2) param_issue += ", ";
        }
        param_issue += "){...}\nNew Parameters : " + "(";
        for (let j = 0; j < new_params.length; j++) {
          param_issue += new_params[j].name.escapedText;
          if (new_params[j].initializer != undefined)
            param_issue += " = " + new_params[j].initializer.escapedText;
          if (j < new_params.length - 2) param_issue += ", ";
        }
        param_issue += "){...}";
        this.parameter_warnings.push(param_issue);
        break;
      }

      for (let i = old_params.length; i < new_params.length; i++) {
        if (new_params[i].initializer == undefined) {
          let param_issue =
            "" +
            key +
            " had non-default parameters added in newer version.\nOriginal Parameters : " +
            key +
            "(";
          for (let j = 0; j < old_params.length; j++) {
            param_issue += old_params[j].name.escapedText;
            if (old_params[j].initializer != undefined)
              param_issue += " = " + old_params[j].initializer.escapedText;
            if (j < old_params.length - 2) param_issue += ", ";
          }
          param_issue += "){...}\nNew Parameters : " + key + "(";
          for (let j = 0; j < new_params.length; j++) {
            param_issue += new_params[j].name.escapedText;
            if (new_params[j].initializer != undefined)
              param_issue += " = " + new_params[j].initializer.escapedText;
            if (j < new_params.length - 1) param_issue += ", ";
          }
          param_issue += "){...}";
          this.parameter_breaks.push(
            param_issue + " FILE : " + this.old_location_dict[key]
          );
          break;
        }
      }
    }
  }

  printParameterChanges() {
    console.log("\n\n--------------------------------------");
    console.log("BREAKING CHANGES FROM PARAMETER MODIFICATIONS");
    console.log("--------------------------------------");
    this.parameter_breaks.forEach((param_issue, index) => {
      console.log(index + 1 + ". " + param_issue + "\n");
    });
  }

  printParameterWarnings() {
    console.log("\n\n--------------------------------------");
    console.log(
      "WARNINGS : POTENTIAL BREAKING CHANGES FROM PARAMETER MODIFICATIONS"
    );
    console.log("--------------------------------------");
    this.parameter_warnings.forEach((param_issue, index) => {
      console.log(index + 1 + ". " + param_issue + "\n");
    });
  }

  getFunctionRemovals() {
    for (let key in this.old_dict) {
      if (!this.new_dict.hasOwnProperty(key)) {
        this.removed_functions.push(key);
      }
    }
  }

  printFunctionRemovals() {
    console.log("\n\n--------------------------------------");
    console.log("FUNCTIONS REMOVED IN NEWER VERSION :");
    console.log("--------------------------------------");

    this.removed_functions.forEach((functionName, index) => {
      let params = this.old_dict[functionName].parameters;
      //ERROR WRAPPER 2
      if (params == undefined) return;
      //ERROR WRAPPER 2 ends
      let param_names = functionName + "( ";
      for (let i = 0; i < params.length; i++) {
        param_names += params[i].name.escapedText;
        if (i < params.length - 1) param_names += ", ";
      }
      param_names += "){...}";
      console.log(
        index +
          1 +
          ". " +
          param_names +
          " FILE : " +
          this.old_location_dict[functionName]
      );
    });
  }

  getFunctionsAdded() {
    for (let key in this.new_dict) {
      if (!this.old_dict.hasOwnProperty(key)) {
        this.added_functions.push(key);
      }
    }
  }

  printFunctionsAdded() {
    console.log("\n\n--------------------------------------");
    console.log("FUNCTIONS ADDED IN NEWER VERSION :");
    console.log("--------------------------------------");
    this.added_functions.forEach((functionName, index) => {
      let params = this.new_dict[functionName].parameters;
      let param_names = functionName + "( ";
      if (params != undefined && params.length != undefined) {
        for (let i = 0; i < params.length; i++) {
          param_names += params[i].name.escapedText;
          if (i < params.length - 1) param_names += ", ";
        }
      }

      param_names += "){...}";
      console.log(
        index +
          1 +
          ". " +
          param_names +
          " FILE : " +
          this.new_location_dict[functionName]
      );
    });
  }
}
