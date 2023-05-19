const { createToken, verifyToken } = require("../utils/utils");

let info = {
  username: "admin",
  passworld: "123456",
};
let exp = 20;
let token = createToken(info, exp);
console.log(`生成token:${token}`);

setTimeout(function () {
  verifyToken(token)
    .then((res) => {
      console.log(res.data.username, res.data.passworld);
    })
    .catch((err) => {
      console.log(err);
    });
}, 1000 * 5);
