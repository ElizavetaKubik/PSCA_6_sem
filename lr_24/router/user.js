const Router = require("express");
const userRouter = new Router();
const userController = require("../controller/user");

userRouter.get("/api/ability", userController.ability);
userRouter.get("/api/user", userController.allUsers);
userRouter.get("/api/user/:id", userController.userInfo);

module.exports = userRouter;
