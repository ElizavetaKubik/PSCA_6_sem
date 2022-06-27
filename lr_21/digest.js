const app = require("express")();
const passport = require("passport");
const Digest = require("passport-http").DigestStrategy;
const session = require("express-session")({
  resave: false,
  saveUninitialized: false,
  secret: "1651652",
});

let Users = require(__dirname + "/users.json");

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Digest(
    { qop: "auth" },
    (user, done) => {
      let check = null;
      let credential = Credential(user);
      if (!credential) {
        console.log("Wrong user name.");
        check = done(null, false);
      } else {
        check = done(null, credential.user, credential.password);
      }
      return check;
    },
    (params, done) => {
      console.log(`Params: ${JSON.stringify(params)}`);
      done(null, true);
    }
  )
);

function Credential(user) {
  let us = Users.find((u) => u.user.toLowerCase() == user.toLowerCase());
  return us;
}

passport.serializeUser((user, done) => {
  console.log("SerializeUser.");
  done(null, user);
});
passport.deserializeUser((user, done) => {
  console.log("DeserializeUser.");
  done(null, user);
});

app.get(
  "/login",
  (req, res, next) => {
    console.log("Login.");
    if (req.session.logout && req.headers["authorization"]) {
      req.session.logout = false;
      delete req.headers["authorization"];
    }
    next();
  },
  passport.authenticate("digest", { session: false }),
  (req, res, next) => {
    if (req.session.logout == undefined) {
      req.session.logout = false;
    }
    res.end("Login success");
  }
);

app.get("/logout", (req, res) => {
  console.log("Logout.");
  req.session.logout = true;
  delete req.headers["authorization"];
  res.redirect("/login");
});

app.get("/resource", (req, res) => {
  console.log("Resource.");
  if (req.session.logout == false && req.headers["authorization"])
    res.end("Resource (digest).");
  else res.redirect("/login");
});

app.all("/*", (req, res) => {
  res.status(404);
  res.end("Wrong URL.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Started on 3000 port.");
});
