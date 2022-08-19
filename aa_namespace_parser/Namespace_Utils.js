/*
  Given an array of multiple blobs of extracted raw patterns (string), extract each simple (1 word) token.
  @param pattern_array : Array of multiple blobs of extracted patterns (string)
  @return array of tokens 
  */
export function getTokensFromSimplePatternArray(pattern_array) {
  let result_array = [];
  pattern_array.forEach((arr) => {
    const tokens = arr.split(",");
    tokens.map((token) => {
      let trimmed = token.trim();
      let cleaned = replaceAll(trimmed, '"', "");
      result_array.push(cleaned);
    });
  });

  return result_array;
}

/*
  Given an array of multiple blobs of extracted raw patterns of S3method (string), extract each combined token.
  @param pattern_array : Array of multiple blobs of extracted patterns (string)
  @return array of tokens 
  */
export function getTokensFromS3MethodPatternArray(pattern_array) {
  let result_array = [];
  pattern_array.forEach((combined) => {
    let separated = combined.split(",");
    let first = separated[0].trim();
    let cleaned_first = replaceAll(first, '"', "");
    let second = separated[1].trim();
    let cleaned_second = replaceAll(second, '"', "");
    result_array.push(cleaned_first + "." + cleaned_second);
  });

  return result_array;
}

/*
  Given an array of multiple blobs of extracted raw patterns of importFrom (string), extract each token with the library name
  in the format libraryName#token.
  @param pattern_array : Array of multiple blobs of extracted patterns (string)
  @return array of tokens 
  */
export function getTokensFromImportFromPatternArray(pattern_array) {
  let result_array = [];
  pattern_array.forEach((arr) => {
    const tokens = arr.split(",");
    let library_name = tokens.shift();
    tokens.map((token) => {
      let trimmed = token.trim();
      let cleaned = replaceAll(trimmed, '"', "");
      result_array.push(library_name + "#" + cleaned);
    });
  });

  return result_array;
}

/*
replace all in string
@param str : actual string
@param find : target string
@param replace :  string that should replace
@return transformed string
*/

export function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}
