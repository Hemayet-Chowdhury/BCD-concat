import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");

const AdmZip = require("adm-zip");
const path = require("path");
const extraction_errors = [];

async function extractArchive(filepath, output_base) {
  try {
    const zip = new AdmZip(filepath);
    const outputFolderName = `${path.parse(filepath).name}`;
    const outputDir = output_base + "/" + outputFolderName;
    zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${(e, filepath)}`);
    extraction_errors.push(filepath);
    fs.appendFile("./extraction_errors.txt", "\n" + filepath, function (err) {
      if (err) console.log("could not append");
    });
  }
}

let base_directory_name = "./download_final_100";

let folder_names = fs.readdirSync(base_directory_name);

folder_names.forEach((folder) => {
  let path = base_directory_name + "/" + folder;
  console.log(path);
  let file_names = fs.readdirSync(path);
  file_names.forEach((zip_file) => {
    let zip_path = path + "/" + zip_file;
    extractArchive(zip_path, path);
    console.log(zip_file);
  });
  console.log(extraction_errors);
});

// extractArchive(zip_location);
