const db_models = require("../db/db");
const { getSalt, uuid, md5 } = require("../utils/utils");
const user = db_models.UserModel;

async function testAddUser() {
  let salt = getSalt();
  let password = md5("123456", salt);
  let date = Date.now();
  try {
    const userInstance = await user.create(
      {
        id: uuid(32),
        username: "admin",
        realname: "管理员",
        password: password,
        salt: salt,
        sex: "1",
        phone: "15651341214",
        status: "1",
        del_flag: "0",
        create_by: "admin",
        create_time: date,
        update_by: "admin",
        update_time: date,
        //身份（1管理员 2运营人员 3正式客户  4 试用客户）
        user_identity: "1",
      },
      { raw: true }
    );
    console.log(userInstance);
  } catch (err) {
    console.log(err);
  }
  //   console.log("over...");
}

async function testFindAllUsers() {
  let users = await user.findAll({ raw: true });
  console.log(users);
}

async function test() {
  await testFindAllUsers();
  await testAddUser();
  await testFindAllUsers();
}

test();
