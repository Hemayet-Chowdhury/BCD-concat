//returns an array of objects {files, urls}
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scrapy = require("node-scrapy");
import fetch from "../../node_modules/node-fetch/src/index.js";
const model = {
  files: [
    ".table > tbody tr td a",
    {
      name: "",
      url: "(href)",
    },
  ],
};
export function extractFiles(body) {
  var file_object = scrapy.extract(body, model);
  var filtered_array = file_object.files.filter((file) => {
    if (file.name.slice(-2) == ".R") return true;
    else return false;
  });

  return filtered_array;
}

export function transfer_dicts(main_dict, small_dict) {
  for (let key in small_dict) {
    main_dict[key] = small_dict[key];
  }
}

export function transfer_locations(locations_dict, small_dict, filename) {
  for (let key in small_dict) {
    locations_dict[key] = filename;
  }
}

export function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}

export function disp_function_names(main_dict, version) {
  console.log(version + " process started ");
  for (key in main_dict) {
    console.log(key);
  }
  console.log(Object.keys(main_dict).length);
}

export function display_old_location(name) {
  console.log("old_lib/ + " + old_location_dict[name]);
}

export function display_new_location(name) {
  console.log("new_lib/ + " + new_location_dict[name]);
}

export let list_100 = [
  // "BiocGenerics",
  // "BiocVersion",
  // "S4Vectors",
  // "IRanges",
  // "GenomeInfoDb",
  // "Biobase",
  // "zlibbioc",
  // "XVector",
  // "DelayedArray",
  // "BiocParallel",
  // "GenomicRanges",
  // "Biostrings",
  // "SummarizedExperiment",
  // "MatrixGenerics",
  // "AnnotationDbi",
  // "limma",
  // "genefilter",
  // "KEGGREST",
  // "annotate",
  // "biomaRt",
  // "rtracklayer",
  // "BiocFileCache",
  // "edgeR",
  // "Rsamtools",
  // "Rhtslib",
  // "graph",
  // "GenomicAlignments",
  // "Rhdf5lib",
  // "DESeq2",
  // "GenomicFeatures",
  // "geneplotter",
  // "rhdf5",
  // "rhdf5filters",
  // "preprocessCore",
  // "qvalue",
  // "clusterProfiler",
  // "fgsea",
  // "DOSE",
  // "enrichplot",
  // "DelayedMatrixStats",
  // "GOSemSim",
  // "Rgraphviz",
  // "RBGL",
  // "ggtree",
  // "multtest",
  // "treeio",
  // "sparseMatrixStats",
  // "GEOquery",
  // "BSgenome",
  // "beachmat",
  // "SingleCellExperiment",
  // "ProtGenerics",
  // "HDF5Array",
  // "BiocIO",
  // "ComplexHeatmap",
  // "impute",
  // "ensembldb",
  // "AnnotationHub",
  // "affyio",
  // "affy",
  // "BiocSingular",
  // "AnnotationFilter",
  // "interactiveDisplayBase",
  // "VariantAnnotation",
  // "GSEABase",
  // "BiocNeighbors",
  // "sva",
  // "ShortRead",
  // "BiocStyle",
  // "scuttle",
  // "ExperimentHub",
  // "ScaledMatrix",
  // "biovizBase",
  // "vsn",
  // "scater",
  // "KEGGgraph",
  // "phyloseq",
  // "biomformat",
  // "pcaMethods",
  // "pathview",
  // "biocViews",
  // "Gviz",
  // "GSVA",
  // "scran",
  // "AnnotationForge",
  // "topGO",
  // "tximport",
  // "apeglm",
  // "OrganismDbi",
  // "EnhancedVolcano",
  // "TCGAbiolinks",
  // "Category",
  // "MSnbase",
  // "bluster",
  // "ConsensusClusterPlus",
  // "GOstats",
  // "mzR",
  // "illuminaio",
  // "batchelor",
  // "EBImage",
];

export let list_last_59 = [
  "Rgraphviz",
  "RBGL",
  "ggtree",
  "multtest",
  "treeio",
  "sparseMatrixStats",
  "GEOquery",
  "BSgenome",
  "beachmat",
  "SingleCellExperiment",
  "ProtGenerics",
  "HDF5Array",
  "BiocIO",
  "ComplexHeatmap",
  "impute",
  "ensembldb",
  "AnnotationHub",
  "affyio",
  "affy",
  "BiocSingular",
  "AnnotationFilter",
  "interactiveDisplayBase",
  "VariantAnnotation",
  "GSEABase",
  "BiocNeighbors",
  "sva",
  "ShortRead",
  "BiocStyle",
  "scuttle",
  "ExperimentHub",
  "ScaledMatrix",
  "biovizBase",
  "vsn",
  "scater",
  "KEGGgraph",
  "phyloseq",
  "biomformat",
  "pcaMethods",
  "pathview",
  "biocViews",
  "Gviz",
  "GSVA",
  "scran",
  "AnnotationForge",
  "topGO",
  "tximport",
  "apeglm",
  "OrganismDbi",
  "EnhancedVolcano",
  "TCGAbiolinks",
  "Category",
  "MSnbase",
  "bluster",
  "ConsensusClusterPlus",
  "GOstats",
  "mzR",
  "illuminaio",
  "batchelor",
  "EBImage",
];

export function sort_by_branch(a, b) {
  var first_version = a.url.match(/\d/g);
  var second_version = b.url.match(/\d/g);
  if (first_version && second_version) {
    first_version = first_version.join("");
    first_version = +first_version;

    second_version = second_version.join("");
    second_version = +second_version;
    if (String(first_version).charAt(0) === String(second_version).charAt(0)) {
      return first_version - second_version;
    } else {
      let first_num = String(first_version).charAt(0);
      first_num = +first_num;
      let second_num = String(second_version).charAt(0);
      second_num = +second_num;
      return first_num - second_num;
    }
  } else {
    return 1;
  }
}

export function sort_array_by_branch(a, b) {
  if (a.slice(-6) === "master") return 1;
  if (b.slice(-6) === "master") return -1;
  const [old_first, ...old_rest] = a.split("_");
  const old_remainder = old_rest.join("_");
  const [new_first, ...new_rest] = b.split("_");
  const new__remainder = new_rest.join("_");
  var first_version = old_remainder.match(/\d/g);
  var second_version = new__remainder.match(/\d/g);

  if (first_version && second_version) {
    first_version = first_version.join("");
    first_version = +first_version;

    second_version = second_version.join("");
    second_version = +second_version;

    if (String(first_version).charAt(0) === String(second_version).charAt(0)) {
      return first_version - second_version;
    } else {
      let first_num = String(first_version).charAt(0);
      first_num = +first_num;
      let second_num = String(second_version).charAt(0);
      second_num = +second_num;
      return first_num - second_num;
    }
  } else {
    return 1;
  }
}
