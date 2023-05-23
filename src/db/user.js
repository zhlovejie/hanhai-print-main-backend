const db_models = require("./db");
const { createToken, md5, getSalt, uuid, isEmpty } = require("../utils");
const logger = require("../vo/Logger");
const HttpResult = require("../vo/HttpResult");
const UserModel = db_models.UserModel;

async function login({ username, password }) {
  try {
    let filter = {
      username,
    };
    let attributes = {};
    let user = await UserModel.findOne(
      {
        attributes,
        where: filter,
      },
      {
        raw: true,
      }
    );
    // 没有该用户
    if (user === null) {
      return HttpResult.fail({ message: "用户名或密码错误" });
    }

    if (user.password !== md5(String(password).trim(), user.salt)) {
      return HttpResult.fail({ message: "用户名或密码错误" });
    }

    let token = createToken(user, 60 * 60 * 2);

    return HttpResult.success({
      message: `欢迎，${user.realname || user.username}`,
      result: {
        token,
      },
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function loginout(token) {
  return HttpResult.success();
}

async function getUserInfo(id) {
  try {
    let attributes = {
      // 排除一些属性
      exclude: [
        "password",
        "salt",
        "create_by",
        "create_time",
        "update_by",
        "update_time",
      ],
    };

    let where = {
      id,
    };

    let userInstance = await UserModel.findOne(
      {
        attributes,
        where: where,
      },
      {
        raw: true,
      }
    );
    return HttpResult.success({ result: userInstance });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function getUser(id) {
  try {
    let attributes = {
      // 排除一些属性
      exclude: [
        "password",
        "salt",
        "create_by",
        "create_time",
        "update_by",
        "update_time",
      ],
    };
    let filter = {
      id,
    };
    let userInstance = await UserModel.findOne(
      {
        attributes,
        where: filter,
      },
      {
        raw: true,
      }
    );
    return HttpResult.success({ result: userInstance });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
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
  try {
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
    return HttpResult.success({
      result: user.get({ plain: true }),
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function editUser({ id, realname, avatar, birthday, sex, email, phone }) {
  try {
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
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function delUser({ id }) {
  try {
    let where = {
      id,
    };

    await UserModel.destroy(
      {
        where: where,
      },
      { raw: true }
    );

    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function delUserBySoft({ id }) {
  try {
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
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function getUserPageList({
  username = "",
  status = "",
  del_flag = "",
  page_no = 1,
  page_size = 10,
}) {
  try {
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

    return HttpResult.success({
      result: {
        page: page_no,
        count,
        records: rows,
      },
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
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
