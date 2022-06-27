const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("./users.json");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "kflklr" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new LocalStrategy((username, password, done) => {
    for (let user of users) {
      if (username === user.login && password === user.password) {
        return done(null, user);
      }
    }
    return done(null, false, { message: "Wrong login or password" });
  })
);

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/resource",
    failureRedirect: "/login",
  })
);

app.get(
  "/resource",
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401);
      res.end("No access. Please, log in.");
    }
  },
  (req, res) => {
    res.send(`Resource: ${req.user.login}`);
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.all("/*", (req, res) => {
  res.status(404);
  res.end("Wrong URL.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Started on 3000 port.");
});
