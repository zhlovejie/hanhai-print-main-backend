const { verifyToken } = require("../../utils/utils");
const HttpResult = require("../../vo/HttpResult");
/**
 * 检测token
 * 校验通过：把token的信息附加到body.jwtinfo上
 * 校验不通过：直接返回 code 50008 token失效
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function tokenChecker(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    res.json(HttpResult.jwtfail());
    return;
  }
  let tokenResult = await verifyToken(token);
  if (tokenResult === null) {
    res.json(HttpResult.jwtfail());
    return;
  } else {
    req.jwtinfo = tokenResult.data;
    next();
    return;
  }
}

module.exports = tokenChecker;
