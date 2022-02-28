//Rename stuff ends

import myF from "./myF.js";

var arr = ["RELEASE_3_5", "RELEASE_3_6", "RELEASE_3_7", "RELEASE_3_8"];
for (let i = 0; i < arr.length - 1; i++) {
  await myF("MetaboSignal", arr[i], arr[i + 1]);
}
