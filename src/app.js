const express = require("express");
const config = require("./config")
const routerInstall = require("./router");
const logger = require("./vo/Logger")
const app = express();

routerInstall(app);

process.on('exit',function(code){
  logger.warn({
    message:`process exit code:${code}`
  })
})

let server = app.listen(config.appPort, function () {
  console.log(server.address());
  var host = server.address().address;
  var port = server.address().port;

  console.log("访问地址为 http://%s:%s", host, port);

  logger.info("访问地址为 http://%s:%s", host, port)
});
