const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//  jwt令牌私钥
const JWT_SECRET = ")Y:]AI3:*?P1Mx^K@JWq#<[w^S!R%O^%";

/**
 * 生成用户密码，规则：md5(密码字符串:盐)
 * @param {*} str
 * @param {*} salt
 * @returns
 */
function md5(str, salt) {
  let _str = `${str}:${salt}`;
  return crypto
    .createHash("md5")
    .update(Buffer.from(_str, "utf8"))
    .digest("hex");
}

/**
 * 生成密码所需要的盐，默认16位
 * @param {*} n
 * @returns
 */
function getSalt(n = 16) {
  return uuid(n);
}

/**
 * 生成唯一uuid传，默认8位
 * @param {*} n
 * @returns
 */
function uuid(n = 8) {
  let str = "";
  while (str.length < n) {
    str += `${Math.random().toString(32).slice(-8)}`;
  }

  return str.slice(0, n);
}

/**
 * 生成jwt令牌
 * @param {*} info 自定义数据
 * @param {*} exp 过期时间 默认1个小时 3600s
 * @returns
 */
function createToken(info, exp = 3600) {
  let token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + exp,
      data: info,
    },
    JWT_SECRET
  );
  return token;
}

/**
 * 验证jwt令牌是否有效
 * @param {*} token
 * @returns
 */
function verifyToken(token) {
  return new Promise((reslove, reject) => {
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        reslove(null)
      } else {
        reslove(decoded);
      }
    });
  });
}


function isEmpty(val){
  return val === '' || val === undefined || val === null
}

function isNumber(val){
  return !isNaN(parseFloat(val)) && isFinite(val)
}

module.exports = {
  md5,
  getSalt,
  uuid,
  createToken,
  verifyToken,
  isEmpty,
  isNumber
};
