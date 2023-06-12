const express = require("express");
const router = express.Router();
const { upload } = require("../middleware");
const logger = require("../vo/Logger");
const bizDict = require("../db/dict");


router.post("/sys/dict/add", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/add",
    params: req.body,
  });
  let result = await bizDict.addDict({
    ...req.body,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/dict/edit", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/edit",
    params: req.body,
  });
  let result = await bizDict.editDict({ ...req.body });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/dict/del/:id", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/del/:id",
    params: req.params,
  });
  let result = await bizDict.delDict({ ...req.params });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/dict/pageList", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/pageList",
    params: req.query,
  });

  let result = await bizDict.dictPageList({
    ...req.query,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/dict/item/add", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/item/add",
    params: req.body,
  });
  let result = await bizDict.addDictItem({
    ...req.body,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/dict/item/edit", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/item/edit",
    params: req.body,
  });
  let result = await bizDict.editDictItem({
    ...req.body,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/dict/item/del/:id", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/item/del/:id",
    params: req.params,
  });

  let result = await bizDict.delDictItem({ ...req.params });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/dict/item/pageList", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/item/pageList",
    params: req.query,
  });
  let result = await bizDict.dictItemPageList({
    ...req.query,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

/**
 * 字典导入
 */
router.post(
  "/sys/dict/import",
  [upload.array("file", 1)],
  async function (req, res, next) {
    logger.info("start--------------------------------");
    logger.info({
      message: "/sys/dict/import",
      params: { files: req.files },
    });
    try {
      if (Array.isArray(req.files) && req.files.length > 0) {
        let result = await bizDict.dictImportByExcel({
          file: req.files[0],
          _jwtinfo: req.jwtinfo,
        });
        res.json(result);
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

module.exports = router;
