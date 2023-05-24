const db_models = require("./db");
const {
  createToken,
  md5,
  getSalt,
  uuid,
  isEmpty,
  isNumber,
} = require("../utils");
const logger = require("../vo/Logger");
const HttpResult = require("../vo/HttpResult");
const UserModel = db_models.UserModel;

async function login({ username, password }) {
  try {
    if (isEmpty(username) || isEmpty(password)) {
      return HttpResult.fail();
    }
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
    if (!user) {
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
    if(isEmpty(id)){
      return HttpResult.fail()
    }
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
    if (!userInstance) {
      return HttpResult.fail();
    }
    return HttpResult.success({ result: userInstance });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function getUser(id) {
  try {
    if (isEmpty(id)) {
      return HttpResult.fail();
    }
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
    if (!userInstance) {
      return HttpResult.fail();
    }
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
  avatar = null,
  birthday = null,
  sex = null,
  email = null,
  phone = null,
  user_identity,
  del_flag = "0",
  status = "1",
  _jwtinfo,
}) {
  try {
    if (isEmpty(username) || isEmpty(password) || isEmpty(realname)) {
      return HttpResult.fail({
        message: `登录账号，真实姓名，密码不能为空`,
      });
    }
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

    let user = await UserModel.findOne({
      where: { username: values.username },
      raw: true,
    });

    if (user) {
      return HttpResult.fail({
        message: `登录账号重复`,
      });
    }

    let date = Date.now();
    let salt = getSalt();
    let _password = md5(password, salt);

    await UserModel.create({
      ...values,
      id: uuid(32),
      password: _password,
      salt,
      del_flag,
      status,
      create_by: _jwtinfo.id,
      create_time: date,
      update_by: _jwtinfo.id,
      update_time: date,
    });
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function editUser({
  id,
  realname,
  avatar = null,
  birthday = null,
  sex = null,
  email = null,
  phone = null,
  user_identity = null,
  del_flag = null,
  status = null,
  _jwtinfo,
}) {
  try {
    if (isEmpty(id)) {
      return HttpResult.fail();
    }

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

    if (isNumber(user_identity)) {
      Object.assign(values, { user_identity });
    }
    if (isNumber(del_flag)) {
      Object.assign(values, { del_flag });
    }
    if (isNumber(status)) {
      Object.assign(values, { status });
    }

    Object.assign(values, {
      update_by: _jwtinfo.id,
      update_time: Date.now(),
    });

    let where = {
      id,
    };

    let userInstance = await UserModel.findOne(
      {
        where: where,
      },
      { raw: true }
    );
    if (!userInstance) {
      return HttpResult.fail();
    }

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
    if (isEmpty(id)) {
      return HttpResult.fail();
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
    if (!userInstance) {
      return HttpResult.fail();
    }

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
    if (isEmpty(id)) {
      return HttpResult.fail();
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
    if (!userInstance) {
      return HttpResult.fail();
    }
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
  status = "0",
  del_flag = "1",
  page_no = 1,
  page_size = 10,
}) {
  try {
    let _page_no = page_no,
      _page_size = page_size;

    if (!isNumber(_page_no)) {
      _page_no = 1;
    }

    if (!isNumber(_page_size)) {
      _page_size = 10;
    }

    _page_no = Number(_page_no);
    _page_size = Number(_page_size);

    if (_page_size > 50) {
      _page_size = 50;
    }

    let filter = {};

    if (!isEmpty(username)) {
      Object.assign(filter, {
        username: {
          [Op.like]: `%${username}%`,
        },
      });
    }
    if (isNumber(status)) {
      Object.assign(filter, {
        status: {
          [Op.eq]: status,
        },
      });
    }
    if (isNumber(del_flag)) {
      Object.assign(filter, {
        del_flag: {
          [Op.eq]: del_flag,
        },
      });
    }

    let { count, rows } = await UserModel.findAndCountAll({
      where: filter,
      limit: _page_size,
      offset: (_page_no - 1) * _page_size,
      raw: true,
    });

    return HttpResult.success({
      result: {
        page: _page_no,
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
