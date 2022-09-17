export function getLibraryVersion(description_file) {
  let lines = description_file.split("\n");
  let version;
  lines.forEach((line) => {
    if (line.includes("Version")) {
      let raw_version = line.split(":")[1];
      version = raw_version.trim();
    }
  });

  return version;
}

export function stringifyGenericArray(arr) {
  let result = "";
  arr.forEach((elem) => {
    result += elem + "\n";
  });
  return result;
}

export function stringifyParameterArray(arr) {
  let res = "";
  let index = 0;
  arr.forEach((item) => {
    res += index + ".\n";
    res += JSON.stringify(item, null, 2) + "\n\n";
    index++;
  });
  return res;
}

export function decorateString(str) {
  return "\n\n##########\n" + str + "\n##########\n\n";
}
