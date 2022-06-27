const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const redis = require("redis");

const app = express();

const redisClient = redis.createClient(
  "//redis-10578.c253.us-central1-1.gce.cloud.redislabs.com:10578",
  { password: "redis-22" }
);

const cookieKey = "coooooookie";
const accessKey = "coooooookie_access_key";
const refreshKey = "coooooookie_refresh_key";
let oldRefreshKeyCount = 0;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(cookieKey));

const sequelize = require("./config");
const { Users, BlackList } = require("./model").Model(sequelize);

app.use((req, res, next) => {
  if (req.cookies.accessToken) {
    jwt.verify(req.cookies.accessToken, accessKey, (err, payload) => {
      if (err) {
        next();
      } else if (payload) {
        req.payload = payload;
        next();
      }
    });
  } else next();
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/registration", (req, res) => {
  res.sendFile(__dirname + "/registration.html");
});

app.post("/login", async (req, res) => {
  const candidate = await Users.findOne({
    where: {
      login: req.body.username,
      password: req.body.password,
    },
  });

  if (candidate) {
    const accessToken = jwt.sign(
      { id: candidate.id, login: candidate.login },
      accessKey,
      { expiresIn: 10 * 60 }
    );
    const refreshToken = jwt.sign(
      { id: candidate.id, login: candidate.login },
      refreshKey,
      { expiresIn: 24 * 60 * 60 }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    res.redirect("/resource");
  } else {
    res.redirect("/login");
  }
});

app.post("/registration", async (req, res) => {
  let candidate = await Users.findOne({
    where: {
      login: req.body.username,
    },
  });

  if (candidate != null) {
    res.status(401).send("User with this login already exists");
  } else {
    candidate = await Users.create({
      login: req.body.username,
      password: req.body.password,
    });

    const accessToken = jwt.sign(
      { id: candidate.id, login: candidate.login },
      accessKey,
      { expiresIn: 10 * 60 }
    );
    const refreshToken = jwt.sign(
      { id: candidate.id, login: candidate.login },
      refreshKey,
      { expiresIn: 24 * 60 * 60 }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    res.redirect("/resource");
  }
});

app.get("/resource", (req, res) => {
  if (req.payload) {
    res.status(200).send(`Resource ${req.payload.id} - ${req.payload.login}`);
  } else {
    res.status(401).send("No access.");
  }
});

app.get("/refresh-token", (req, res) => {
  if (req.cookies.refreshToken) {
    jwt.verify(req.cookies.refreshToken, refreshKey, async (err, payload) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else if (payload) {
        redisClient.on("ready", () => console.log("ready"));
        redisClient.on("error", (err) => console.log(`error: ${err}`));
        redisClient.on("connect", () => console.log("connect"));
        redisClient.on("end", () => console.log("end"));

        redisClient.set(oldRefreshKeyCount, req.cookies.refreshToken, () =>
          console.log("set old refresh token" + oldRefreshKeyCount)
        );
        redisClient.get(oldRefreshKeyCount, (err, result) =>
          console.log("added old refresh token: " + result + oldRefreshKeyCount)
        );
        oldRefreshKeyCount++;
        //redisClient.quit();

        // const oldRefreshToken = await BlackList.create({
        //   value: req.cookies.refreshToken,
        // });
        const candidate = await Users.findOne({ where: { id: payload.id } });
        const newAccessToken = jwt.sign(
          { id: candidate.id, login: candidate.login },
          accessKey,
          { expiresIn: 10 * 60 }
        );
        const newRefreshToken = jwt.sign(
          { id: candidate.id, login: candidate.login },
          refreshKey,
          { expiresIn: 24 * 60 * 60 }
        );
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.redirect("/resource");
      }
    });
  } else {
    res.status(401).send("Please, authorize");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/login");
});

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
