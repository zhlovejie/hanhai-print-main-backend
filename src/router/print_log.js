const express = require("express");
const router = express.Router();
const logger = require("../vo/Logger");
const bizPrintLog = require("../db/print_log");

router.post("/sys/printlog/add", async function (req, res) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/printlog/add",
    params: req.body,
  });
  let result = await bizPrintLog.printLogAdd({
    ...req.body,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/printlog/pageList", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/printlog/pageList",
    params: req.query,
  });
  let result = await bizPrintLog.printLogPageList({
    ...req.query,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

module.exports = router;
