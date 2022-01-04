var stringSimilarity = require("string-similarity");

var similarity = stringSimilarity.compareTwoStrings("calculateLocalConsistency".toLowerCase(), "calculate_local_consistency".toLowerCase());

function getBigrams(str) {
    const bigrams = new Set();
    const length = str.length;
    for(let i=0; i < length - 1; i++) {
      const bigram = str.slice(i, i + 2);
      bigrams.add(bigram);
    }
    return bigrams;
  }
  
  function intersect(set1, set2) {
    const intersection = new Set();
    set1.forEach(value => {
      if(set2.has(value)) {
        intersection.add(value);
      }
    });
    return intersection;
  }
  
  function diceCoefficient(str1, str2) {
    const bigrams1 = getBigrams(str1);
    const bigrams2 = getBigrams(str2);
    return ( 2 * intersect(bigrams1, bigrams2).size ) / ( bigrams1.size + bigrams2.size );
  }

console.log(diceCoefficient("ycnetsisnoc_labolg_etaluclac".toLowerCase(), "calculate_local_consistency".toLowerCase()))

//ycnetsisnoc_labolg_etaluclac