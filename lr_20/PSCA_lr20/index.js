const express = require("express");
const hbs = require("express-handlebars").create({ extname: ".hbs" });
const bodyParser = require("body-parser");

const NumbersRouter = require("./routes/numbers.route");

const app = express();
app.use(bodyParser.json());

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

app.use("/", NumbersRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Started on 3000 port.");
});
