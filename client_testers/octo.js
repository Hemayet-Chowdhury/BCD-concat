import { createRequire } from "module";
const require = createRequire(import.meta.url);

//https://github.com/search?l=R&q=library%28scater%29+reducedDimension%28&type=Code
//https://github.com/search?q=library%28DOSE%29+%22getGeneSet%22&type=Code
// https://github.com/search?q=library%28iranges%29+aggregate.Rle&type=Code
// https://github.com/search?l=R&q=library%28ggtree%29+getRoot&type=Code
// https://github.com/search?q=library%28ggtree%29+getNodeNum&type=Code

const { Octokit } = require("@octokit/core");
// or: import { Octokit } from "@octokit/core";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({
  auth: `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`,
});

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
// const queries = ["plotPCASCESet", "reducedDimension"];
// for (let query of queries) {
//   const res = await octokit.request("GET /search/code", {
//     q: "scater " + query + " language:R",
//   });

//   console.log(res.data.total_count);
// }

const res = await octokit.request("GET /rate_limit");
console.log(res.data.resources.search);
