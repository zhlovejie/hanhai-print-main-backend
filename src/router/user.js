const express = require("express");
const router = express.Router();
const logger = require("../vo/Logger");
const bizUser = require("../db/user");

router.post("/sys/user/login", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/login",
    params: req.body,
  });
  let result = await bizUser.login({ ...req.body });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/user/baseinfo", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/baseinfo",
    params: req.jwtinfo,
  });
  let result = await bizUser.getUserInfo(req.jwtinfo.id);
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/user/logout", async function (req, res) {
  logger.info("start--------------------------------");

  let token = req.headers["x-access-token"];
  logger.info({
    message: "/sys/user/logout",
    params: { token },
  });
  let result = await bizUser.loginout(token);
  // create user in req.body
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/user/edit", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/edit",
    params: req.body,
  });
  let result = await bizUser.editUser({ ...req.body, _jwtinfo: req.jwtinfo });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/user/add", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/add",
    params: req.body,
  });
  let result = await bizUser.addUser({ ...req.body, _jwtinfo: req.jwtinfo });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/user/pagelist", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/pagelist",
    params: req.query,
  });
  let result = await bizUser.getUserPageList({
    ...req.query,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/user/resetpassword", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/resetpassword",
    params: req.body,
  });
  let _api = req.body.userid
    ? bizUser.updatePasswordByAdmin
    : bizUser.updatePasswordBySelf;
  let result = await _api({ ...req.body, _jwtinfo: req.jwtinfo });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/user/udpateTrialUsed", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/udpateTrialUsed",
    params: req.body,
  });
  let result = await bizUser.udpateTrialUsed({ _jwtinfo: req.jwtinfo });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/user/checkTrial", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/checkTrial",
    params: req.body,
  });
  let result = await bizUser.checkTrial({ _jwtinfo: req.jwtinfo });
  res.json(result);
  logger.info("end--------------------------------");
});

/**
 * 获取验证码
 */
router.post("/sys/user/captchaRandom", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/captcha",
    params: req.body,
  });
  let result = await bizUser.makeCaptcha();
  res.json(result);
  logger.info("end--------------------------------");
});

/**
 * 验证码校验
 */
router.post("/sys/user/captchaValidate", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/captcha",
    params: req.body,
  });
  let result = await bizUser.validateCaptcha({ ...req.body });
  res.json(result);
  logger.info("end--------------------------------");
});

module.exports = router;
