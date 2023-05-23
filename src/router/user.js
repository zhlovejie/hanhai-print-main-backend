const express = require("express");
const router = express.Router();

const bizUser = require("../db/user");

router.post("/sys/user/login", async function (req, res) {
  let { username, password } = req.body;
  let result = await bizUser.login({ username, password });
  res.json(result);
});

router.get("/sys/user/baseinfo", async function (req, res) {
  console.log(req.jwtinfo);
  let result = await bizUser.getUserInfo(req.jwtinfo.id);
  res.json(result);
});

router.post("/sys/user/logout", async function (req, res) {
  let token = req.headers["x-access-token"];
  let result = await bizUser.loginout(token);
  // create user in req.body
  res.json(result);
});

router.post("/sys/user/edit", async function (req, res) {
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
});

module.exports = router;
