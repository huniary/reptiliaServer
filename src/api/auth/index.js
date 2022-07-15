const Router = require("koa-router");
const authCtrl = require("./auth.ctrl");

const auth = new Router();

auth.post("/register", authCtrl.register);
auth.post("/login", authCtrl.login);
auth.get("/check", authCtrl.check);     //체크는 다름 get으로해야함
auth.post("/logout", authCtrl.logout);

module.exports = auth;