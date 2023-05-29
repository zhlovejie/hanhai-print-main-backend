const db_models = require("./db");
const { UserModel, Op } = db_models;
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

    //状态(1-正常,2-冻结)
    if (+user.status === 2) {
      return HttpResult.fail({ message: "该账号已冻结，请联系管理员！" });
    }
    //删除状态(0-正常,1-已删除)
    if (+user.del_flag === 1) {
      return HttpResult.fail({ message: "该账号已暂停使用，请联系管理员！" });
    }

    //试用客户
    // if(+user.user_identity === 4){
    //   if(isNumber(user.trial_times) && isNumber(user.trial_used)){
    //     let trial_times = Number(user.trial_times)
    //     let trial_used = Number(user.trial_used)
    //     if(trial_used >= trial_times){
    //       return HttpResult.fail({ message: "该账号已暂停使用，请联系管理员！" });
    //     }
    //   }else{
    //     logger.warn({
    //       message:`试用客户试用次数和已试用次数异常`,
    //       params:{
    //         user
    //       }
    //     })
    //   }
    // }

    //token有效期为2小时
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
  trial_times = null,
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
    if (!isEmpty(trial_times) && isNumber(trial_times)) {
      Object.assign(values, { trial_times });
    }

    let user = await UserModel.findOne({
      where: { username: values.username },
      raw: true,
    });

    if (user) {
      return HttpResult.fail({
        message: `账号重复`,
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
  status = null,
  del_flag = null,
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

    let order = [["create_time", "DESC"]];

    let { count, rows } = await UserModel.findAndCountAll({
      order,
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

/**
 * 修改自己的密码
 * @param {*} param0
 * @returns
 */
async function updatePasswordBySelf({ password, newpassword, _jwtinfo }) {
  try {
    logger.info({
      message: "客户自己修改密码",
    });
    if (isEmpty(password) || isEmpty(newpassword)) {
      return HttpResult.fail();
    }

    let where = {
      id: _jwtinfo.id,
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

    // 验证密码是否正确
    if (md5(password, userInstance.salt) !== userInstance.password) {
      return HttpResult.fail();
    }

    let values = {};

    let salt = getSalt();
    let _password = md5(newpassword, salt);

    Object.assign(values, {
      salt,
      password: _password,
      update_by: _jwtinfo.id,
      update_time: Date.now(),
    });

    userInstance.set(values);
    await userInstance.save();
    return HttpResult.success({
      message: `密码设置成功，密码为：${newpassword} 。请妥善保管！`,
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 管理员修改客户密码
 * @param {*} param0
 * @returns
 */
async function updatePasswordByAdmin({ userid, newpassword, _jwtinfo }) {
  try {
    logger.info({
      message: "管理员修改客户密码",
    });
    if (isEmpty(newpassword) || isEmpty(userid)) {
      return HttpResult.fail();
    }

    // 非管理权限账号 拒绝
    if (+_jwtinfo.user_identity !== 1) {
      return HttpResult.fail();
    }

    let where = {
      id: userid,
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

    let values = {};

    let salt = getSalt();
    let _password = md5(newpassword, salt);

    Object.assign(values, {
      salt,
      password: _password,
      update_by: _jwtinfo.id,
      update_time: Date.now(),
    });

    userInstance.set(values);
    await userInstance.save();
    return HttpResult.success({
      message: `密码设置成功，密码为：${newpassword} 。请妥善保管！`,
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 试用客户更新打印次数
 * @param {*} param0
 * @returns
 */
async function udpateTrialUsed({ _jwtinfo }) {
  try {
    let where = {
      id: _jwtinfo.id,
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
    // 非试用客户
    if (+userInstance.user_identity !== 4) {
      return HttpResult.fail();
    }

    let values = {};
    Object.assign(values, {
      update_by: _jwtinfo.id,
      update_time: Date.now(),
    });

    if (!isNumber(userInstance.trial_used)) {
      Object.assign(values, {
        trial_used: 1,
      });
    } else {
      Object.assign(values, {
        trial_used: Number(userInstance.trial_used) + 1,
      });
    }

    userInstance.set(values);
    await userInstance.save();
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 试用客户打印次数是否用完
 * @param {*} param0
 * @returns
 */
async function checkTrial({ _jwtinfo }) {
  try {
    let where = {
      id: _jwtinfo.id,
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
    // 非试用客户
    if (+userInstance.user_identity !== 4) {
      return HttpResult.fail();
    }

    if (!isNumber(userInstance.trial_used)) {
      return HttpResult.fail();
    }

    if (
      isNumber(userInstance.trial_used) &&
      isNumber(userInstance.trial_times) &&
      Number(userInstance.trial_used) >= Number(userInstance.trial_times)
    ) {
      return HttpResult.success({
        result: { end: 1 },
      });
    }

    return HttpResult.success({
      result: { end: 0 },
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
  updatePasswordBySelf,
  updatePasswordByAdmin,
  udpateTrialUsed,
  checkTrial
};
