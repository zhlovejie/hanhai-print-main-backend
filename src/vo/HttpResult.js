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
    return Object.assign(
      {
        code: HttpResultCode.success,
        message: "成功",
        result: {},
        timestamp: Date.now(),
      },
      opt
    );
  }

  /**
   * 成功返回
   * @param {*} param0
   * @returns
   */
  static fail(opt) {
    return Object.assign(
      {
        code: HttpResultCode.fail,
        message: "失败",
        result: {},
        timestamp: Date.now(),
      },
      opt
    );
  }

  /**
   * token校验失败返回
   * @param {*} param0
   * @returns
   */
  static jwtfail(opt) {
    return Object.assign(
      {
        code: HttpResultCode.fail,
        message: "失败",
        result: {},
        timestamp: Date.now(),
      },
      opt
    );
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
