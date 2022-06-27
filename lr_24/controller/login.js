const sequelize = require("../config/config");
const UserModel = require("../model/model").Models(sequelize).UserCASL;
const path = require("path");
const jwt = require("jsonwebtoken");
const { accessKey, refreshKey } = require("../config/consts");

class LoginController {
  static async showLogin(req, res) {
    await res.sendFile(path.parse(__dirname).dir + "\\view\\login.html");
  }

  static async login(req, res) {
    const candidate = await UserModel.findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    });
    if (candidate) {
      const accessToken = jwt.sign(
        {
          id: candidate.id,
          username: candidate.username,
          role: candidate.role,
        },
        accessKey,
        { expiresIn: 60 * 60 * 60 }
      );
      const refreshToken = jwt.sign(
        {
          id: candidate.id,
          username: candidate.username,
          role: candidate.role,
        },
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
  }

  static async resource(req, res) {
    if (req.payload && req.payload.id !== 0)
      res
        .status(200)
        .send(
          `Resource ${req.payload.id}-${req.payload.username}-${req.payload.role}`
        );
    else {
      res.status(401).send("Non authorized");
    }
  }

  static async logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/login");
  }
}

module.exports = LoginController;
