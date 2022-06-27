const Router = require("express");
const loginRouter = new Router();
const loginController = require("../controller/login");

loginRouter.get("/login", loginController.showLogin);
loginRouter.post("/login", loginController.login);
loginRouter.get("/resource", loginController.resource);
loginRouter.get("/logout", loginController.logout);

module.exports = loginRouter;
