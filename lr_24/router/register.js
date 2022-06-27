const Router = require("express");
const registerRouter = new Router();
const registerController = require("../controller/register");

registerRouter.get("/register", registerController.showRegister);
registerRouter.post("/register", registerController.register);

module.exports = registerRouter;
