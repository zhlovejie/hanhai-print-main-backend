const { Sequelize, DataTypes, Op } = require("sequelize");
const logger = require("../vo/Logger")
const config = require("../config");
const db_config = config.db;
const sequelize = new Sequelize(
  db_config.database,
  db_config.username,
  db_config.password,
  {
    host: db_config.host,
    dialect: db_config.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
    },
    timezone: "+08:00",
    //配置
    dialectOptions: {
      // 时间格式化，返回字符串
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
    logging:(msg) => logger.info(msg)
  }
);

/**用户表 */
let UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    realname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sex: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    del_flag: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    create_by: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    update_by: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_identity: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
    },
    client_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  },
  {
    tableName: "sys_user",
    timestamps: false,
  }
);

/**字典表 */
let DictModel = sequelize.define(
  "Dict",
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    dict_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dict_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    create_by: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    tableName: "jimu_dict",
    timestamps: false,
  }
);

/**字典项目表 */
let DictItemModel = sequelize.define(
  "DictItem",
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    dict_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      autoIncrement: false,
    },
    item_text: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    item_value: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.TINYINT(10),
      allowNull: true,
    }
  },
  {
    tableName: "jimu_dict_item",
    timestamps: false,
  }
);

module.exports = {
  UserModel,
  DictModel,
  DictItemModel,
  Op,
  sequelize
};
