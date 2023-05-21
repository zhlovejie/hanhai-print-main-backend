const db_models = require("../db/db");
const { uuid } = require("../utils/utils");
const { Op } = require("sequelize");
const { DictModel, DictItemModel } = db_models;
const HttpResult = require("../vo/HttpResult");
/**
 * 数据字典新增
 * @param {*} param0
 * @returns
 */
async function addDict({ dict_name, dict_code, description, _jwtinfo }) {
  let date = Date.now();
  let dict = await DictModel.create({
    id: uuid(32),
    dict_name,
    dict_code,
    description,
    del_flag: "0",
    create_by: _jwtinfo.id,
    create_time: date,
    update_by: _jwtinfo.id,
    update_time: date,
  });
  return HttpResult.success();
}

/**
 * 数据字典编辑
 * @param {*} param0
 * @returns
 */
async function editDict({ id, dict_name, dict_code, description }) {
  let values = {
    dict_name,
    dict_code,
    description,
  };

  let where = {
    id,
  };

  let rows = await DictModel.update(
    values,
    {
      where: where,
    },
    { raw: true }
  );

  return HttpResult.success();
}

/**
 * 数据字典删除
 * @param {*} param0
 * @returns
 */
async function delDict({ id }) {
  let where = {
    id,
  };

  let rows = await DictModel.destroy(
    {
      where: where,
    },
    { raw: true }
  );

  return HttpResult.success();
}

/**
 * 数据字典分页列表
 * @param {*} param0
 * @returns
 */
async function dictPageList({
  page_no = 1,
  page_size = 10,
  dict_name = "",
  dict_code = "",
  _jwtinfo,
}) {
  let filter = {
    create_by: _jwtinfo.id,
  };
  let order = [["create_time", "DESC"]];

  if (dict_name) {
    Object.assign(filter, {
      dict_name: {
        [Op.like]: `%${dict_name}%`,
      },
    });
  }
  if (dict_code) {
    Object.assign(filter, {
      dict_code: {
        [Op.like]: `%${dict_code}%`,
      },
    });
  }

  let { count, rows } = await DictModel.findAndCountAll({
    order,
    where: filter,
    limit: page_size,
    offset: (page_no - 1) * page_size,
    raw: true,
  });
  return HttpResult.success({
    result: {
      page: page_no,
      count,
      records: rows,
    },
  });
}

/**
 * 字典条目新增
 * @param {*} param0
 * @returns
 */
async function addDictItem({
  dict_id,
  item_text,
  item_value,
  description = "",
  sort_order = null,
  _jwtinfo,
}) {
  let date = Date.now();
  let dictItem = await DictItemModel.create({
    id: uuid(32),
    dict_id,
    item_text,
    item_value,
    description,
    sort_order,
    status: "1",
    create_by: _jwtinfo.id,
    create_time: date,
    update_by: _jwtinfo.id,
    update_time: date,
  });
  return HttpResult.success();
}

/**
 * 字典条目编辑
 * @param {*} param0
 * @returns
 */
async function editDictItem({
  id,
  item_text,
  item_value,
  description,
  sort_order = null,
  status = "1",
}) {
  let values = {};

  if (item_text) {
    Object.assign(values, { item_text });
  }
  if (item_value) {
    Object.assign(values, { item_value });
  }
  if (description) {
    Object.assign(values, { description });
  }
  if (sort_order) {
    Object.assign(values, { sort_order });
  }
  if (status) {
    Object.assign(values, { status });
  }

  let where = {
    id,
  };

  let rows = await DictItemModel.update(
    values,
    {
      where: where,
    },
    { raw: true }
  );

  return HttpResult.success();
}

/**
 * 字典条目删除
 * @param {*} param0
 * @returns
 */
async function delDictItem({ id }) {
  let where = {
    id,
  };

  await DictItemModel.destroy(
    {
      where: where,
    },
    { raw: true }
  );

  return HttpResult.success();
}

/**
 * 字典条目分页列表
 * @param {*} param0
 * @returns
 */
async function dictItemPageList({
  page_no = 1,
  page_size = 10,
  item_text = "",
  item_value = "",
  dict_id,
  _jwtinfo,
}) {
  let order = [["sort_order", "ASC"]];

  let filter = {
    dict_id,
    create_by: _jwtinfo.id,
  };

  if (item_text) {
    Object.assign(filter, {
      item_text: {
        [Op.like]: `%${item_text}%`,
      },
    });
  }
  if (item_value) {
    Object.assign(filter, {
      item_value: {
        [Op.like]: `%${item_value}%`,
      },
    });
  }

  let { count, rows } = await DictItemModel.findAndCountAll({
    order,
    where: filter,
    limit: page_size,
    offset: (page_no - 1) * page_size,
    raw: true,
  });
  return HttpResult.success({
    result: {
      page: page_no,
      count,
      records: rows,
    },
  });
}

module.exports = {
  addDict,
  editDict,
  delDict,
  dictPageList,
  addDictItem,
  editDictItem,
  delDictItem,
  dictItemPageList,
};
