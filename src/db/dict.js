const db_models = require("./db");
const { uuid, isEmpty, isNumber } = require("../utils");
const { DictModel, DictItemModel, Op, sequelize } = db_models;
const HttpResult = require("../vo/HttpResult");
const logger = require("../vo/Logger");
const nodepath = require("path");
const xlsx = require("node-xlsx");
/**
 * 数据字典新增
 * @param {*} param0
 * @returns
 */
async function addDict({ dict_name, description = null, _jwtinfo }) {
  try {
    if (isEmpty(dict_name) || !(_jwtinfo && _jwtinfo.id)) {
      return HttpResult.fail();
    }
    let dictInstance = await DictModel.create({
      id: uuid(32),
      dict_name,
      description,
      create_by: _jwtinfo.id,
      create_time: Date.now(),
    });
    return HttpResult.success({
      result: dictInstance.get({ raw: true }),
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 数据字典编辑
 * @param {*} param0
 * @returns
 */
async function editDict({ id, dict_name, description = null }) {
  try {
    if (isEmpty(dict_name) || isEmpty(id)) {
      return HttpResult.fail();
    }

    let values = {};
    if (!isEmpty(dict_name)) {
      Object.assign(values, {
        dict_name,
      });
    }
    if (!isEmpty(description)) {
      Object.assign(values, {
        description,
      });
    }

    let where = {
      id,
    };
    let dictInstance = await DictModel.findOne(
      {
        where: where,
      },
      { raw: true }
    );

    if (!dictInstance) {
      logger.error({
        message: `editDict 未找到 ${where} 数据`,
      });
      return HttpResult.fail();
    }
    dictInstance.set(values);

    await dictInstance.save();
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 数据字典删除
 * @param {*} param0
 * @returns
 */
async function delDict({ id }) {
  try {
    if (isEmpty(id)) {
      return HttpResult.fail();
    }
    let where = {
      id,
    };

    let dictInstance = await DictModel.findOne(
      {
        where: where,
      },
      { raw: true }
    );

    if (!dictInstance) {
      logger.error({
        message: `delDict 未找到 ${where} 数据`,
      });
      return HttpResult.fail();
    }

    let dictItemWhere = {
      dict_id: dictInstance.id,
    };

    await sequelize.transaction(async (t) => {
      await DictModel.destroy({
        where: where,
        transaction: t,
      });

      await DictItemModel.destroy({
        where: dictItemWhere,
        transaction: t,
      });
    });

    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
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
  _jwtinfo,
}) {
  try {
    if (!(_jwtinfo && _jwtinfo.id)) {
      return HttpResult.fail({
        message: "dictPageList _jwtinfo 缺失",
      });
    }
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

    let { count, rows } = await DictModel.findAndCountAll({
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

/**
 * 字典条目新增
 * @param {*} param0
 * @returns
 */
async function addDictItem({
  dict_id,
  item_text,
  description = null,
  sort_order = null,
}) {
  try {
    if (isEmpty(dict_id) || isEmpty(item_text)) {
      return HttpResult.fail();
    }

    let dictItemInstance = await DictItemModel.create({
      id: uuid(32),
      dict_id,
      item_text,
      description,
      sort_order,
    });
    return HttpResult.success({
      result: dictItemInstance.get({ raw: true }),
    });
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 字典条目编辑
 * @param {*} param0
 * @returns
 */
async function editDictItem({
  id,
  item_text,
  description = null,
  sort_order = null,
}) {
  try {
    if (isEmpty(id) || isEmpty(item_text)) {
      return HttpResult.fail();
    }

    let values = {};

    if (!isEmpty(item_text)) {
      Object.assign(values, { item_text });
    }
    if (!isEmpty(description)) {
      Object.assign(values, { description });
    }
    if (isNumber(sort_order)) {
      Object.assign(values, { sort_order });
    }

    let where = {
      id,
    };

    let dictItemInstance = await DictItemModel.findOne(
      {
        where: where,
      },
      { raw: true }
    );

    if (!dictItemInstance) {
      logger.error({
        message: `editDictItem 未找到 ${where} 数据`,
      });
      return HttpResult.fail();
    }
    dictItemInstance.set(values);
    await dictItemInstance.save();

    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
}

/**
 * 字典条目删除
 * @param {*} param0
 * @returns
 */
async function delDictItem({ id }) {
  try {
    if (isEmpty(id)) {
      return HttpResult.fail();
    }
    let where = {
      id,
    };

    let dictItemInstance = await DictItemModel.findOne(
      {
        where: where,
      },
      { raw: true }
    );

    if (!dictItemInstance) {
      logger.error({
        message: `delDictItem 未找到 数据`,
        params: where,
      });
      return HttpResult.fail();
    }
    await DictItemModel.destroy({
      where,
    });
    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
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
  dict_id,
}) {
  try {
    if (isEmpty(dict_id)) {
      return HttpResult.fail();
    }

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

    let order = [["sort_order", "ASC"]];
    let filter = {
      dict_id,
    };

    if (item_text) {
      Object.assign(filter, {
        item_text: {
          [Op.like]: `%${item_text}%`,
        },
      });
    }

    let { count, rows } = await DictItemModel.findAndCountAll({
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

/**
 * 批量导入字典， 先创建一条字典，zai
 * @param {*} param0
 * @returns
 */
async function dictImportByExcel({ file, _jwtinfo }) {
  try {
    let maxFileSize = 1024 * 1024 * 5;
    let { filename, path, size } = file;
    let extname = nodepath.extname(String(filename)).trim().toLowerCase();
    let whiteList = [".xlsx", ".xls"];
    if (!whiteList.includes(extname)) {
      return HttpResult.fail({
        message: "不支持的文件类型",
      });
    }
    if (size > maxFileSize) {
      return HttpResult.fail({
        message: "不支持文件大小超过5M的文件",
      });
    }

    const workSheets = xlsx.parse(path);
    if (!(Array.isArray(workSheets) && workSheets.length > 0)) {
      return HttpResult.fail({
        message: "sheets不存在",
      });
    }

    let sheetOne = workSheets[0];
    // let sheetName = sheetOne.name
    if (!(Array.isArray(sheetOne.data) && sheetOne.data.length > 0)) {
      return HttpResult.fail({
        message: "没有需要导入的数据",
      });
    }
    let sheetHeader = sheetOne.data[0];

    let dict_id = uuid(32);
    let dictItemList = [];
    for (let i = 1, len = sheetOne.data.length; i < len; i++) {
      let cell = sheetOne.data[i][0];
      dictItemList.push({
        id: uuid(32),
        dict_id,
        item_text: cell,
        description: cell,
        sort_order: i,
      });
    }

    await sequelize.transaction(async (t) => {
      await DictModel.create(
        {
          id: dict_id,
          dict_name: sheetHeader[0],
          description: sheetHeader[0],
          create_by: _jwtinfo.id,
          create_time: Date.now(),
        },
        {
          transaction: t,
        }
      );

      await DictItemModel.bulkCreate(dictItemList, {
        transaction: t,
      });
    });

    return HttpResult.success();
  } catch (err) {
    logger.error(err);
    return HttpResult.fail({ message: err.message });
  }
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
  dictImportByExcel,
};
