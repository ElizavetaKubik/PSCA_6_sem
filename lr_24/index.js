const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Ability, AbilityBuilder } = require("casl");

const sequelize = require("./config/config");
const { cookieKey, accessKey } = require("./config/consts");

const loginRouter = require("./router/login");
const registerRouter = require("./router/register");
const userRouter = require("./router/user");
const repoRouter = require("./router/repo");
const commitRouter = require("./router/commit");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(cookieKey));

app.use((req, res, next) => {
  const { rules, can, cannot } = AbilityBuilder.extract();
  if (req.cookies.accessToken) {
    jwt.verify(req.cookies.accessToken, accessKey, (err, payload) => {
      if (err) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.sendFile(__dirname + +"\\view\\login.html");
      } else if (payload) {
        req.payload = payload;
        if (req.payload.role === "admin") {
          can(["read", "update", "delete"], ["Repo", "Commit"]);
          can("read", "allUsers");
          can("read", "UserCASL");
          cannot("create", "Repo");
          cannot("create", "Commit");
        }
        if (req.payload.role === "user") {
          can(["read", "create", "update"], ["Repo", "Commit"]);
          can("read", "UserCASL", { id: req.payload.id });
        }
      }
    });
  } else {
    req.payload = { id: 0 };
    can("read", ["Repo", "Commit"], { id: req.payload.id });
  }
  req.ability = new Ability(rules);
  next();
});

app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", userRouter);
app.use("/", repoRouter);
app.use("/", commitRouter);

app.all("/*", (req, res) => {
  res.status(404);
  res.end("Wrong URL.");
});

sequelize
  .sync()
  .then(() => {
    console.log("Success connection.");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Started on 3000 port.");
    });
  })
  .catch((err) => {
    console.log("Error while BD connecting: " + err);
  });
