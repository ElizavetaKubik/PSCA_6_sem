const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const session = require("express-session")({
  resave: false,
  saveUninitialized: false,
  secret: "sklasjl",
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "3310441363-ha3j3vc1b3g20puh4hpaa4q0l32hajmn.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (token, refreshToken, profile, done) => {
      done(null, { profile: profile, token: token });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serialize: displayName", user.profile.displayName);
  done(null, user);
});
passport.deserializeUser((user, done) => {
  console.log("deserialize: displayName", user.profile.displayName);
  done(null, user);
});

const app = express();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/resource");
  }
);

app.get("/resource", (req, res) => {
  if (req.user) {
    res
      .status(200)
      .send(
        `Resource: ${req.user.profile.id}, ${req.user.profile.displayName}`
      );
  } else {
    res.redirect("/login");
  }
});

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
