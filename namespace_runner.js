const fs = require('fs');
const readline = require('readline');
const Ns_Parser = require('./Ns_Parser');

async function processLineByLine() {
  const fileStream = fs.createReadStream('./new_NS/NAMESPACE');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let ns_parser = new Ns_Parser();
  for await (const line of rl) {

    
    ns_parser.parseLine(line);
  }

   console.log(ns_parser.getNameSpaceList().length);
   
}

processLineByLine();