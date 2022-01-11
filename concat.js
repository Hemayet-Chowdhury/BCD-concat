var NodeProcessor = require("./NodeProcessor");
var TreeAnalyser = require("./TreeAnalyser");
var fs = require("fs");
const ts = require("typescript");
var path = require("path");
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var moveFrom = "./old_lib";

var source_data = "";

var logger = fs.createWriteStream("./OLD_OUTPUT.txt", {
  flags: "a", // 'a' means appending (old data will be preserved)
});

//DICTS
old_main_dict = {};
new_main_dict = {};

function transfer_dicts(main_dict, small_dict) {
  for (key in small_dict) {
    main_dict[key] = small_dict[key];
  }
}

function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}

function disp_function_names() {
  console.log("process started");
  for (key in old_main_dict) {
    console.log(key);
  }
}

//DICTS END

// Loop through all the files in the temp directory

let fileOpenPromise = () => {
  fs.readdir(moveFrom, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index, array) {
      // Make one pass and make the file complete
      var fromPath = path.join(moveFrom, file);

      fs.stat(fromPath, async function (error, stat) {
        if (error) {
          console.error("Error stating file.", error);
          return;
        }

        if (stat.isFile()) {
          var fileType = file.substr(file.length - 2);
          if (fileType == ".R") {
            try {
              let filename1 = await fs.readFileSync(
                moveFrom + "/" + file,
                "utf8"
              );

              filename1 = replaceAll(filename1, "#", "//");
              filename1 = replaceAll(filename1, "@", ".");
              filename1 = replaceAll(filename1, "\n.", "\n_");

              const ts_source_ast = ts.createSourceFile("temp1.ts", filename1);

              let old_version_tree = new TreeAnalyser(ts_source_ast);

              transfer_dicts(
                old_main_dict,
                old_version_tree.getFunctionsDict()
              );
            } catch (err) {
              console.error(err);
            }
          }
        }
      });
    });
  });
};

// fileOpenPromise.then((message) => {
//   console.log(message);
//   disp_function_names(old_main_dict);

// })

setTimeout(() => {
  disp_function_names(old_main_dict);
}, 3000);

fileOpenPromise();
disp_function_names(old_main_dict);
