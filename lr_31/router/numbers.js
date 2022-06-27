const express = require("express");
const numbersRouter = express.Router();
const numbersController = require("../controller/numbers");

numbersRouter.get("/", numbersController.getNumbers);
numbersRouter.post("/", numbersController.addNumber);
numbersRouter.put("/", numbersController.editNumber);
numbersRouter.delete("/", numbersController.deleteNumber);

module.exports = numbersRouter;
