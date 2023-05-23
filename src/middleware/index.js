const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const config = require("../config");
const { makeUploadFileName } = require("../utils");
/**application/json parser 参数附加到 req.body 中 */
const jsonParser = bodyParser.json();

/**application/x-www-form-urlencoded parser 参数附加到 req.body 中 */
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const tokenChecker = require("./tokenChecker");

/**
 * 文件上传中间件
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: config.uploadPath,
    filename: function (req, file, cb) {
      cb(null, makeUploadFileName(file.originalname));
    },
  }),
});

module.exports = {
  cors,
  jsonParser,
  urlencodedParser,
  tokenChecker,
  upload,
};
