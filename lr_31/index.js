const express = require("express");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger");

const numbersRouter = require("./router/numbers");

const app = express();
app.use(bodyParser.json());
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/ts", numbersRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Started on 3000 port.");
});
