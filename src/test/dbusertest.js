const UserModel = require("../router/user");

async function testAddUser() {
  let user = {
    username: "18752106129",
    realname: "王富贵",
    password: "123456",
    birthday: "1987-10-26",
    sex: 1,
    phone: "18752106129",
    user_identity: 4,
  };
  let result = await UserModel.addUser(user);
  console.log(result);
}

async function testEditUser() {
  let user = {
    id: "kcnl7oomilt6b6j8j02k1ofoksgcs30a",
    realname: "王富贵111",
    birthday: "1987-10-29",
    sex: 2,
  };
  let result = await UserModel.editUser(user);
  console.log(result);
}

async function testDelUser() {
  let user = {
    id: "6dan2nbto3nd537vktvj1apcnmtfd03g",
  };
  let result = await UserModel.delUserBySoft(user);
  console.log(result);
}

async function testUserPageList() {
  let result = await UserModel.getUserPageList({});
  console.log(result);
}

function test() {
  // testAddUser()

  // testEditUser()

  // testDelUser()

  testUserPageList();
}

test();
