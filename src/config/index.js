const path = require("path");

module.exports = {
  appName: "print-app",
  appPort: 9999,
  //数据库相关
  db: {
    database: "hanhai-print",
    username: "hanhai_print_db_base",
    password: ")Y:]AI3:*?P1Mx^K@ZWq#<[w^S!R%O^%",
    host: "81.68.204.177",
    dialect: "mysql",
  },
  //日志路径
  logPath: path.join(__dirname, "../../log"),
  //文件上传路径
  uploadPath: path.join(__dirname, "../../uploads"),
};
