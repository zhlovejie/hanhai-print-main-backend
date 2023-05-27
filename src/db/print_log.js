const db_models = require("./db");
const {
  createToken,
  md5,
  getSalt,
  uuid,
  isEmpty,
  isNumber,
} = require("../utils");
const logger = require("../vo/Logger");
const HttpResult = require("../vo/HttpResult");
const PrintLogModel = db_models.PrintLogModel;

async function printLogAdd({ _jwtinfo, print_json = "" }) {
  try {
    let values = {};
    Object.assign(values, { print_json });

    await PrintLogModel.create({
      ...values,
      id: uuid(32),
      user_id: _jwtinfo.id,
      create_by: _jwtinfo.id,
      create_time: Date.now(),
    });
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

async function printLogPageList({ page_no = 1, page_size = 10, _jwtinfo }) {
  try {
    let _page_no = page_no,
      _page_size = page_size;

    if (!isNumber(_page_no)) {
      _page_no = 1;
    }

    if (!isNumber(_page_size)) {
      _page_size = 10;
    }

    _page_no = Number(_page_no);
    _page_size = Number(_page_size);

    if (_page_size > 50) {
      _page_size = 50;
    }

    let order = [["create_time", "DESC"]];

    let filter = {
      user_id: _jwtinfo.id,
    };

    let { count, rows } = await PrintLogModel.findAndCountAll({
      order,
      where: filter,
      limit: _page_size,
      offset: (_page_no - 1) * _page_size,
      raw: true,
    });
    return HttpResult.success({
      result: {
        page: _page_no,
        count,
        records: rows,
      },
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

module.exports = {
  printLogAdd,
  printLogPageList,
};
