const db_models = require("../db/db");
const {
  createToken,
  verifyToken,
  md5,
  getSalt,
  uuid,
  isEmpty,
} = require("../utils/utils");
const UserModel = db_models.UserModel;

async function login({ username, password }) {
  let filter = {
    username,
  };
  let user = await UserModel.findOne({
    where: filter,
    raw: true,
  });
  // 没有该用户
  if (user === null) {
    return {
      success: "true",
      code: 200,
      message: "用户名或密码错误",
      result: {},
      timestamp: Date.now(),
    };
  }

  if (user.password !== md5(String(password).trim(), user.salt)) {
    return {
      success: "true",
      code: 200,
      message: "用户名或密码错误",
      result: {},
      timestamp: Date.now(),
    };
  }

  // 隐藏一些字段
  let ignoreAttributes = [
    "password",
    "salt",
    "create_by",
    "create_time",
    "update_by",
    "update_time",
  ];
  ignoreAttributes.map((key) => {
    delete user[key];
  });

  let token = createToken(user, 60 * 60 * 2);

  return {
    success: "true",
    code: 200,
    message: `欢迎，${user.realname || user.username}`,
    result: {
      user,
      token,
    },
    timestamp: Date.now(),
  };
}

async function loginout(token) {
  return {
    success: "true",
    code: 200,
    message: "成功",
    result: {},
    timestamp: Date.now(),
  };
}

async function getUserInfo(token) {
  if (!token) {
    return {
      success: "true",
      code: 50008,
      message: `token 失效`,
      result: {},
      timestamp: Date.now(),
    };
  }
  let result = await verifyToken(token);
  if (result === null) {
    return {
      success: "true",
      code: 50008,
      message: `token 失效`,
      result: {},
      timestamp: Date.now(),
    };
  }

  let where = {
    id: result.data.id,
  };

  let userInstance = await UserModel.findOne(
    {
      where: where,
    },
    { raw: true }
  );

  return {
    success: "true",
    code: 200,
    message: "成功",
    result: userInstance,
    timestamp: Date.now(),
  };
}

async function getUser(id) {
  let filter = {
    id,
  };
  let user = await UserModel.findOne({
    where: filter,
    raw: true,
  });
  return user;
}

async function addUser({
  username,
  realname,
  password,
  avatar,
  birthday,
  sex,
  email,
  phone,
  user_identity,
}) {
  let values = {};
  if (!isEmpty(username)) {
    Object.assign(values, { username });
  }
  if (!isEmpty(realname)) {
    Object.assign(values, { realname });
  }
  if (!isEmpty(password)) {
    Object.assign(values, { password });
  }
  if (!isEmpty(avatar)) {
    Object.assign(values, { avatar });
  }
  if (!isEmpty(birthday)) {
    Object.assign(values, { birthday });
  }
  if (!isEmpty(sex)) {
    Object.assign(values, { sex });
  }
  if (!isEmpty(email)) {
    Object.assign(values, { email });
  }
  if (!isEmpty(phone)) {
    Object.assign(values, { phone });
  }
  if (!isEmpty(user_identity)) {
    Object.assign(values, { user_identity });
  }

  let date = Date.now();
  let salt = getSalt();
  let _password = md5(password, salt);

  let user = await UserModel.create({
    ...values,
    id: uuid(32),
    password: _password,
    salt,
    del_flag: "0",
    status: "1",
    create_by: "admin",
    create_time: date,
    update_by: "admin",
    update_time: date,
  });
  return {
    success: "true",
    code: 200,
    message: "成功",
    result: {},
    timestamp: Date.now(),
  };
}

async function editUser({ id, realname, avatar, birthday, sex, email, phone }) {
  let values = {};
  if (!isEmpty(realname)) {
    Object.assign(values, { realname });
  }
  if (!isEmpty(avatar)) {
    Object.assign(values, { avatar });
  }
  if (!isEmpty(birthday)) {
    Object.assign(values, { birthday });
  }
  if (!isEmpty(sex)) {
    Object.assign(values, { sex });
  }
  if (!isEmpty(email)) {
    Object.assign(values, { email });
  }
  if (!isEmpty(phone)) {
    Object.assign(values, { phone });
  }

  let where = {
    id,
  };

  let userInstance = await UserModel.findOne(
    {
      where: where,
    },
    { raw: true }
  );

  userInstance.set(values);

  await userInstance.save();

  return {
    success: "true",
    code: 200,
    message: "操作成功",
    result: {},
    timestamp: Date.now(),
  };
}

async function delUser({ id }) {
  let where = {
    id,
  };

  let rows = await UserModel.destroy(
    {
      where: where,
    },
    { raw: true }
  );

  return {
    success: "true",
    code: 200,
    message: "成功",
    result: {
      rows,
    },
    timestamp: Date.now(),
  };
}

async function delUserBySoft({ id }) {
  let where = {
    id,
  };

  let userInstance = await UserModel.findOne(
    {
      where: where,
    },
    { raw: true }
  );
  userInstance.set({
    del_flag: 1,
  });
  await userInstance.save();

  return {
    success: "true",
    code: 200,
    message: "成功",
    result: {},
    timestamp: Date.now(),
  };
}

async function getUserPageList({
  username = "",
  status = "",
  del_flag = "",
  page_no = 1,
  page_size = 10,
}) {
  let filter = {};

  if (username) {
    Object.assign(filter, {
      username: {
        [Op.like]: `%${username}%`,
      },
    });
  }
  if (!isEmpty(status)) {
    Object.assign(filter, {
      status: {
        [Op.eq]: status,
      },
    });
  }
  if (!isEmpty(del_flag)) {
    Object.assign(filter, {
      del_flag: {
        [Op.eq]: del_flag,
      },
    });
  }

  let { count, rows } = await UserModel.findAndCountAll({
    where: filter,
    limit: page_size,
    offset: (page_no - 1) * page_size,
    raw: true,
  });
  return {
    success: "true",
    code: 200,
    message: "成功",
    result: {
      page: page_no,
      count,
      records: rows,
    },
    timestamp: Date.now(),
  };
}

module.exports = {
  login,
  loginout,
  getUserInfo,
  getUser,
  addUser,
  editUser,
  delUser,
  delUserBySoft,
  getUserPageList,
};
