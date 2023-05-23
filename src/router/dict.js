const express = require("express");
const router = express.Router();
const logger = require("../vo/Logger");
const bizDict = require("../db/dict");

router.post("/sys/dict/add", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/add",
    params: req.body,
  });
  let { dict_name, dict_code, description } = req.body;
  let result = await bizDict.addDict({
    dict_name,
    dict_code,
    description,
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
  let { id, dict_name, dict_code, description } = req.body;
  let result = await bizDict.editDict({
    id,
    dict_name,
    dict_code,
    description,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

router.post("/sys/dict/del/:id", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/del/:id",
    params: req.params,
  });
  let id = req.params.id;
  let result = await bizDict.delDict({ id });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/dict/pageList", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/pageList",
    params: req.query,
  });

  let { page_no, page_size, dict_name, dict_code } = req.query;
  let _page_no = Number(page_no) || 1;
  let _page_size = Number(page_size) || 10;
  let result = await bizDict.dictPageList({
    page_no: _page_no,
    page_size: _page_size,
    dict_name,
    dict_code,
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
  let { dict_id, item_text, item_value, description, sort_order } = req.body;
  let result = await bizDict.addDictItem({
    dict_id,
    item_text,
    item_value,
    description,
    sort_order,
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
  let { id, item_text, item_value, description, sort_order, status } = req.body;
  let result = await bizDict.editDictItem({
    id,
    item_text,
    item_value,
    description,
    sort_order,
    status,
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

  let id = req.params.id;
  let result = await bizDict.delDictItem({ id });
  res.json(result);
  logger.info("end--------------------------------");
});

router.get("/sys/dict/item/pageList", async function (req, res, next) {
  logger.info("start--------------------------------");
  logger.info({
    message: "/sys/dict/item/pageList",
    params: req.query,
  });
  let { page_no, page_size, dict_id, item_text, item_value } = req.query;
  let _page_no = Number(page_no) || 1;
  let _page_size = Number(page_size) || 10;
  let result = await bizDict.dictItemPageList({
    page_no: _page_no,
    page_size: _page_size,
    item_text,
    item_value,
    dict_id,
    _jwtinfo: req.jwtinfo,
  });
  res.json(result);
  logger.info("end--------------------------------");
});

module.exports = router;
