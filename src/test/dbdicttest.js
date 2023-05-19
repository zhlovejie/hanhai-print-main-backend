const DictModel = require("../router/dict");

async function testAddDict() {
  try {
    const dict = await DictModel.addDict({
      dict_name: "性别",
      dict_code: "sex",
      description: "性别",
    });
    console.log(dict);
  } catch (err) {
    console.log(err);
  }
  //   console.log("over...");
}

async function testEditDict() {
  try {
    const dict = await DictModel.editDict({
      id: "qcbc7vn88gkouqvqo4kimgmos8f22uf8",
      dict_name: "性别111",
      description: "性别111",
    });
    console.log(dict);
  } catch (err) {
    console.log(err);
  }
  //   console.log("over...");
}

async function testDelDict() {
  try {
    const dict = await DictModel.delDict({
      id: "qcbc7vn88gkouqvqo4kimgmos8f22uf8",
    });
    console.log(dict);
  } catch (err) {
    console.log(err);
  }
  //   console.log("over...");
}

async function testDictPageList() {
  try {
    const dict = await DictModel.dictPageList({
      page_no: 1,
      page_size: 10,
    });
    console.log(dict);
  } catch (err) {
    console.log(err);
  }
  //   console.log("over...");
}

async function test() {
  // testAddDict()

  // testEditDict()

  // testDelDict()

  testDictPageList();
}

test();
