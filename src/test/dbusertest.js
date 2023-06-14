const UserModel = require("../db/user");

async function testAddUser() {
  let user = {
    username: "王富贵",
    realname: "王富贵",
    password: "123456",
    birthday: "1987-10-26",
    sex: 1,
    phone: "18752106129",
    user_identity: 1,
  };
  let result = await UserModel.addUser(user);
  console.log(result);
}

async function testEditUser() {
  let user = {
    id: "fkp983i8qqlku7lgvjr7pclgg90i6to4",
    realname: "王富贵111",
    birthday: "1987-10-29",
    sex: 2,
  };
  let result = await UserModel.editUser(user);
  console.log(result);
}

async function testDelUser() {
  let user = {
    id: "fkp983i8qqlku7lgvjr7pclgg90i6to4",
  };
  let result = await UserModel.delUserBySoft(user);
  console.log(result);
}

async function testUserPageList() {
  let result = await UserModel.getUserPageList({});
  console.log(result);
}

function testMakeCaptcha(){
  let result = UserModel.makeCaptcha()
  console.log(result)
}

async function test() {
  // await testAddUser()

  // testEditUser()

  // testDelUser()

  // await testUserPageList();

  testMakeCaptcha()
}

test();
