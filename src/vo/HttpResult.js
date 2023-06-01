const logger = require("./Logger");
/**
 * 简单的状态返回
 */
class HttpResult {
  /**
   * 成功返回
   * @param {*} param0
   * @returns
   */
  static success(opt) {
    let result = Object.assign(
      {
        code: HttpResultCode.success,
        message: "成功",
        result: {},
        timestamp: Date.now(),
      },
      opt
    );
    logger.info(result);
    return result;
  }

  /**
   * 失败返回
   * @param {*} param0
   * @returns
   */
  static fail(opt) {
    let result = Object.assign(
      {
        code: HttpResultCode.fail,
        message: "失败",
        result: {},
        timestamp: Date.now(),
      },
      opt
    );
    logger.info(result);
    return result;
  }

  /**
   * token校验失败返回
   * @param {*} param0
   * @returns
   */
  static jwtfail(opt) {
    let result = Object.assign(
      {
        code: HttpResultCode.fail,
        message: "token失效",
        result: {},
        timestamp: Date.now(),
      },
      opt
    );
    logger.info(result);
    return result;
  }
}

/**
 * 自定义返回状态码
 */
class HttpResultCode {
  /**成功状态码 200 */
  static success = 200;
  /**失败状态码 500 */
  static fail = 500;
  /**token校验失败状态码 50008 */
  static jwtfail = 50008;
}

module.exports = HttpResult;
