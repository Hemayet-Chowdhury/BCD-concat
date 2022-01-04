const fs = require('fs');
const util = require('util');
const ts = require("typescript");
var NodeProcessor = require('./NodeProcessor');
var TreeAnalyser  = require('./TreeAnalyser');


//DICTS
old_location_dict = {}
new_location_dict = {}
old_main_dict = {}
new_main_dict = {}

function transfer_dicts(main_dict, small_dict){
    for (key in small_dict){
      main_dict[key] = small_dict[key]
    }
}

function transfer_locations(locations_dict, small_dict, filename){
    for (key in small_dict){
      locations_dict[key] = filename;
    }
}

function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, 'g'), replace);
}

function disp_function_names(main_dict, version){
  console.log(version + " process started ")
        for(key in main_dict){
          console.log(key);
        }
}

function display_old_location(name){
    console.log('old_lib/ + '+old_location_dict[name])
}

function display_new_location(name){
    console.log('new_lib/ + '+new_location_dict[name])
}


//DICTS END


//custom functs



//custom functs end



// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);

old_root_dir = './old_lib'
new_root_dir = './new_lib'

async function myF() {
  let old_names;
  try {
    old_names = await readdir(old_root_dir);
  } catch (err) {
    console.log(err);
  }
  if (old_names === undefined) {
    console.log('undefined');
  } else {
    // console.log(old_names);
  }


  for(file of old_names){
    let filename1 = await readFile(old_root_dir+"/"+file, 'utf8');
    filename1 = "##\n"+filename1;                   
    filename1 =  replaceAll(filename1, "#", "//")
    filename1 =  replaceAll(filename1, "@", ".")
    filename1 =  replaceAll(filename1, "\n.", "\n_")
    
    const ts_source_ast = ts.createSourceFile('temp1.ts', filename1);
  
    let old_version_tree = new TreeAnalyser(ts_source_ast)
    // console.log("old functions collected")
    transfer_dicts(old_main_dict, old_version_tree.getFunctionsDict());
    transfer_locations(old_location_dict, old_version_tree.getFunctionsDict(), file )
  }







  let new_names;
  try {
    new_names = await readdir(new_root_dir);
  } catch (err) {
    console.log(err);
  }
  if (new_names === undefined) {
    console.log('undefined');
  } else {
    // console.log(new_names);
  }


  for(file of new_names){
    let filename2 = await readFile(new_root_dir+"/"+file, 'utf8');
    filename2 = "##\n"+filename2;                 
    filename2 =  replaceAll(filename2, "#", "//")
    filename2 =  replaceAll(filename2, "@", ".")
    filename2 =  replaceAll(filename2, "\n.", "\n_")
    
    const ts_target_ast = ts.createSourceFile('temp2.ts', filename2);
  
    let new_version_tree = new TreeAnalyser(ts_target_ast)
    // console.log("new functions collected")
    transfer_dicts(new_main_dict, new_version_tree.getFunctionsDict());
    transfer_locations(new_location_dict, new_version_tree.getFunctionsDict(), file )
  }


//   disp_function_names(old_main_dict, "OLD");
//   disp_function_names(new_main_dict, "NEW");

  let myNodeProcessor = new NodeProcessor(old_main_dict, new_main_dict, old_location_dict, new_location_dict);
  myNodeProcessor.printFunctionRemovals();
  myNodeProcessor.printFunctionsAdded();

  myNodeProcessor.printParameterChanges();
//   myNodeProcessor.printParameterWarnings();


  console.log('\n\nLocations : ')
//   display_old_location('Function Name : availablePSets(...) | Function Declaration Type : S3')

  
}

myF();