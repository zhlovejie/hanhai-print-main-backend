const nodePath = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const app = express();

const { uuid,verifyToken } = require("./utils/utils");

/**上传文件目录 */
const uploadsPath = nodePath.join(__dirname, "../uploads");

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsPath,
    filename: function (req, file, cb) {
      /**自定义文件名称 */
      let fileName = `file${uuid(16)}${Date.now()}${nodePath.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  }),
});

const bizUser = require("./router/user");

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());

// POST /login gets urlencoded bodies
app.post("/sys/user/login", jsonParser, async function (req, res) {
  let { username, password } = req.body;
  let result = await bizUser.login({ username, password });
  res.json(result);
});

// POST /api/users gets JSON bodies
app.get("/sys/user/baseinfo", async function (req, res) {
  let token = req.headers["x-access-token"];
  let result = await bizUser.getUserInfo(token);
  // create user in req.body
  res.json(result);
});

app.post("/sys/user/logout", async function (req, res) {
  let token = req.headers["x-access-token"];
  let result = await bizUser.loginout(token);
  // create user in req.body
  res.json(result);
});

app.post("/sys/user/edit", jsonParser,async function (req, res) {
  const {id, realname, avatar, birthday, sex, email, phone } = req.body
  let token = req.headers["x-access-token"];
  let tokenResult = await verifyToken(token)
  console.log(tokenResult)
  if(tokenResult === null){
    res.json({
      success: "false",
      code: 500,
      message: "失败",
      result: {},
      timestamp: Date.now(),
    });
  }

  let result = await bizUser.editUser({id, realname, avatar, birthday, sex, email, phone})
  res.json(result);
});

/**
 * 统一上传接口
 */
app.post(
  "/sys/common/upload",
  upload.array("file", 10),
  function (req, res, next) {
    if (Array.isArray(req.files) && req.files.length > 0) {
      let { filename } = req.files[0];
      let host = `http://${req.headers["host"]}`;
      let url = `${host}/static/uploads/${filename}`;

      res.json({
        success: "true",
        code: 200,
        message: "成功",
        result: url,
        timestamp: Date.now(),
      });
    } else {
      res.json({
        success: "false",
        code: 500,
        message: "上传失败",
        result: null,
        timestamp: Date.now(),
      });
    }
  }
);

/**
 * 查看图片
 */
app.get("/static/uploads/:fileName", function (req, res, next) {
  let fileName = req.params.fileName;
  let filePath = nodePath.join(uploadsPath, fileName);
  let fileType = nodePath.extname(fileName).slice(1);

  if (fs.existsSync(filePath)) {
    res.type(fileType);
    res.sendFile(filePath);
  } else {
    res.status(403).send("无权查看此文件");
  }
});



let server = app.listen(9999, function () {
  console.log(server.address());
  var host = server.address().address;
  var port = server.address().port;

  console.log("访问地址为 http://%s:%s", host, port);
});
