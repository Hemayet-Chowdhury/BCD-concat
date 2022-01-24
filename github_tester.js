import fetch from "node-fetch";

const getNames = () => {
  fetch("https://code.bioconductor.org/browse/cTRAP/blob/master/R/CMap.R")
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log("fetch error", err));
};
