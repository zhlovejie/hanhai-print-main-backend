const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const os = require("os");

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
        reslove(null);
      } else {
        reslove(decoded);
      }
    });
  });
}

/**
 * 上传文件名称生成规则
 * @param {*} originalname
 * @returns
 */
function makeUploadFileName(originalname) {
  /**自定义文件名称 */
  let fileName = `file${uuid(16)}${Date.now()}${path.extname(originalname)}`;
  return fileName;
}

function isEmpty(val) {
  return val === "" || val === undefined || val === null;
}

function isNumber(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

function getLocalIp() {
  let netDict = os.networkInterfaces();
  for (const devName in netDict) {
    let netList = netDict[devName];
    for (var i = 0; i < netList.length; i++) {
      let { address, family, internal, mac } = netList[i];
      let isvm = isVmNetwork(mac);
      if (family === "IPv4" && address !== "127.0.0.1" && !internal && !isvm) {
        return address;
      }
    }
  }
}

function isVmNetwork(mac) {
  // 常见的虚拟网卡MAC地址和厂商
  let vmNetwork = [
    "00:05:69", //vmware1
    "00:0C:29", //vmware2
    "00:50:56", //vmware3
    "00:1C:42", //parallels1
    "00:03:FF", //microsoft virtual pc
    "00:0F:4B", //virtual iron 4
    "00:16:3E", //red hat xen , oracle vm , xen source, novell xen
    "08:00:27", //virtualbox
    "00:00:00", // VPN
  ];
  for (let i = 0; i < vmNetwork.length; i++) {
    let mac_per = vmNetwork[i];
    if (mac.startsWith(mac_per)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getLocalIp,
  md5,
  getSalt,
  uuid,
  createToken,
  verifyToken,
  makeUploadFileName,
  isEmpty,
  isNumber,
};
