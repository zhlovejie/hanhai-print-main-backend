const DictModel = require("../db/dict");





async function test() {

  // add
  let _jwtinfo = {
    id:'v9venhd8aeedoosj13rdm6p8r22l2qo8'
  }

  // let dictFail = await DictModel.addDict({description:"学历",_jwtinfo});

  // let dict1 = await DictModel.addDict({dict_name: "学历",description:"学历",_jwtinfo});

  // let dictItem1 =  await DictModel.addDictItem({
  //   dict_id:dict1.result.id, 
  //   item_text:'专科', 
  //   description:'专科', 
  //   sort_order:'1'
  // })

  // let dictItem2 =  await DictModel.addDictItem({
  //   dict_id:dict1.result.id, 
  //   item_text:'本科', 
  //   sort_order:'1'
  // })

  // let dictItem3 =  await DictModel.addDictItem({
  //   dict_id:dict1.result.id, 
  //   item_text:'研究生'
  // })

  // let dict2 = await DictModel.addDict({dict_name: "性别",_jwtinfo});

  // let dictItem4 =  await DictModel.addDictItem({
  //   dict_id:dict2.result.id, 
  //   item_text:'男'
  // })

  // let dictItem5 =  await DictModel.addDictItem({
  //   dict_id:dict2.result.id, 
  //   item_text:'女'
  // })

  // add END

  // pageList
  // await DictModel.dictPageList({_jwtinfo})
  // await DictModel.dictItemPageList({dict_id:'ijca620g8c0v1v1g5on5t8qdk5lfotso',item_text:'男',page_no:100,page_size:100})
  // pageListEND


  //edit

  // DictModel.delDictItem({id:'j0dl0o933ul299ool63s6la8k7v0k7f8'})

  DictModel.delDict({})

}

test();
