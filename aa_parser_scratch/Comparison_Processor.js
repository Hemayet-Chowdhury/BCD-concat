export class Comparison_Processor {
  getFunctionRemovals(set_old, set_new) {
    this.result = [];
    set_old.forEach((functionName) => {
      if (!set_new.has(functionName)) {
        this.result.push(functionName);
      }
    });
    return this.result;
  }
}
