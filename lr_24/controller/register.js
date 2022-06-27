const sequelize = require("../config/config");
const UserModel = require("../model/model").Models(sequelize).UserCASL;
const path = require("path");
const jwt = require("jsonwebtoken");
const { accessKey, refreshKey } = require("../config/consts");

class RegisterController {
  static async showRegister(req, res) {
    res.sendFile(path.parse(__dirname).dir + "\\view\\registration.html");
  }
  static async register(req, res) {
    let candidate = await UserModel.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (candidate) {
      res.status(401).send("User with this login already exists");
    } else {
      candidate = await UserModel.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: "user",
      });

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

      res.status(200).json("ok");
    }
  }
}

module.exports = RegisterController;
