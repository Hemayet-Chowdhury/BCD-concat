import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");

const AdmZip = require("adm-zip");
const path = require("path");

async function extractArchive(filepath, output_base) {
  try {
    const zip = new AdmZip(filepath);
    const outputFolderName = `${path.parse(filepath).name}`;
    const outputDir = output_base + "/" + outputFolderName;
    await zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

let base_directory_name = "./extract_test";

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
});

// extractArchive(zip_location);
