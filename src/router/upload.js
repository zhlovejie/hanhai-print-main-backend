const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const config = require("../config");
const { upload } = require("../middleware");
const HttpResult = require("../vo/HttpResult");
const logger = require("../vo/Logger");
/**
 * 统一上传接口
 */
router.post(
  "/sys/common/upload",
  [upload.array("file", 10)],
  function (req, res, next) {
    logger.info("start--------------------------------");
    logger.info({
      message: "/sys/common/upload",
      params: { files: req.files },
    });
    try {
      if (Array.isArray(req.files) && req.files.length > 0) {
        let { filename } = req.files[0];
        let host = `http://${req.headers["host"]}`;
        let url = `${host}/static/uploads/${filename}`;
        res.json(
          HttpResult.success({
            result: url,
          })
        );
      } else {
        res.json(HttpResult.fail());
      }
    } catch (err) {
      logger.error(err);
      res.json(HttpResult.fail({ message: err.message }));
    }
    logger.info("end--------------------------------");
  }
);

/**
 * 查看图片
 */
router.get("/static/uploads/:fileName", function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/static/uploads/:fileName",
    params: req.params,
  });

  try {
    let fileName = req.params.fileName;
    let filePath = path.join(config.uploadPath, fileName);
    let fileType = path.extname(fileName).slice(1);

    if (fs.existsSync(filePath)) {
      res.type(fileType);
      res.sendFile(filePath);
    } else {
      res.status(403).send("无权查看此文件");
    }
  } catch (err) {
    logger.error(err);
    res.json(HttpResult.fail({ message: err.message }));
  }
  logger.info("end--------------------------------");
});

module.exports = router;
