const express = require("express");
const numbersRouter = express.Router();
const NumbersController = require("../controllers/numbers.controller");

numbersRouter.get("/", NumbersController.showIndex);
numbersRouter.get("/add", NumbersController.showAdd);
numbersRouter.get("/update", NumbersController.showUpdate);
numbersRouter.post("/add", NumbersController.addNumber);
numbersRouter.post("/update", NumbersController.updateNumber);
numbersRouter.post("/delete", NumbersController.deleteNumber);

module.exports = numbersRouter;
