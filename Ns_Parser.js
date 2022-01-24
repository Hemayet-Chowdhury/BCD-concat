module.exports = class Ns_Parser {
  constructor(mainDict) {
    this.mainDict = mainDict;
    this.functions_list = [];
    this.filteredDict = {};
  }

  parseLine(line) {
    let result = undefined;
    if (line.substring(0, 8) == "S3method") {
      let temp = line.substring(9, line.length - 1);
      temp = temp.replace(",", ".");

      result = temp;
    } else if (line.substring(0, 13) == "exportMethods") {
      let temp = line.substring(14, line.length - 1);
      temp = temp.replace(/'/g, "");
      temp = temp.replace(/'/g, "");
      temp = temp.replace('"', "");
      temp = temp.replace('"', "");
      temp = temp.replace("<", "");
      temp = temp.replace("-", "");
      temp = temp.replace(".", "_");
      result = temp;
    } else if (line.substring(0, 6) == "export") {
      let temp = line.substring(7, line.length - 1);
      temp = temp.replace(/'/g, "");
      temp = temp.replace(/'/g, "");
      temp = temp.replace(".", "_");
      result = temp;
    }
    if (result) this.functions_list.push(result);
  }

  getNameSpaceList() {
    return this.functions_list;
  }

  getFilteredDict() {
    for (key in this.mainDict) {
      let temp = key.split("(")[0];
      temp = temp.substring(16, temp.length);
      if (this.functions_list.includes(temp)) {
        this.filteredDict[key] = this.mainDict[key];
      }
    }

    return this.filteredDict;
  }

  getMissingItems() {
    //run getFilteredDict first.
    let filtered_functions = [];
    let missingList = [];
    for (key in this.filteredDict) {
      let temp = key.split("(")[0];
      temp = temp.substring(16, temp.length);
      filtered_functions.push(temp);
    }

    this.functions_list.forEach((item) => {
      if (!filtered_functions.includes(item)) {
        missingList.push(item);
      }
    });

    return missingList;
  }

  getMissingItemDifference() {
    console.log("Functions in namespace : ", this.functions_list.length);
    console.log(
      "Functions in parsed : ",
      Object.keys(this.filteredDict).length
    );
  }
};
