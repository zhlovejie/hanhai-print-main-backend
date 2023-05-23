const express = require("express");
const router = express.Router();
const path = require("path");
const config = require("../config");
const { upload } = require("../middleware");

/**
 * 统一上传接口
 */
router.post(
  "/sys/common/upload",
  [upload.array("file", 10)],
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
router.get("/static/uploads/:fileName", function (req, res, next) {
  let fileName = req.params.fileName;
  let filePath = path.join(config.uploadPath, fileName);
  let fileType = path.extname(fileName).slice(1);

  if (fs.existsSync(filePath)) {
    res.type(fileType);
    res.sendFile(filePath);
  } else {
    res.status(403).send("无权查看此文件");
  }
});

module.exports = router;
