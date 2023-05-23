const routerUser = require("./user");
const routerUpload = require("./upload");
const routerDict = require("./dict");

const {
  cors,
  jsonParser,
  urlencodedParser,
  tokenChecker,
} = require("../middleware");

function install(app) {
  let middlewares = [cors, tokenChecker, jsonParser, urlencodedParser];
  middlewares.map((r) => app.use(r));
  let allRouters = [routerUser, routerUpload, routerDict];
  allRouters.map((r) => app.use(r));
}

module.exports = install;
