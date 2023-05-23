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
  let { username, password } = req.body;
  let result = await bizUser.login({ username, password });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/user/baseinfo", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/user/baseinfo",
    params: req.body,
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
  const { id, realname, avatar, birthday, sex, email, phone } = req.body;
  let result = await bizUser.editUser({
    id,
    realname,
    avatar,
    birthday,
    sex,
    email,
    phone,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

module.exports = router;
