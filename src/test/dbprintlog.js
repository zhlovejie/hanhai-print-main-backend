const PrintLogModel = require("../db/print_log");
const testJsonData = require('./json')
async function test() {

  // add
  let _jwtinfo = {
    id:'v9venhd8aeedoosj13rdm6p8r22l2qo8'
  }
  // let print_json = JSON.stringify(testJsonData)

  // let dictFail = await PrintLogModel.printLogAdd({print_json,_jwtinfo});
  // console.log(dictFail)


  //pagelist

  let result = await PrintLogModel.printLogPageList({_jwtinfo})
  console.log(result)

}

test();
