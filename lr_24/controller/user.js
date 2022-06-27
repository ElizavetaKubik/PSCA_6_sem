const sequelize = require("../config/config");
const { UserCASL } = require("../model/model").Models(sequelize);

class UserController {
  static async ability(req, res) {
    res.status(200).send(req.ability.rules);
  }

  static async allUsers(req, res) {
    try {
      req.ability.throwUnlessCan("read", "allUsers");
      const users = await UserCASL.findAll({
        attributes: ["id", "username", "email", "role"],
      });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async userInfo(req, res) {
    try {
      req.ability.throwUnlessCan("read", "UserCASL");
      if (req.params.id == req.payload.id || req.payload.role === "admin") {
        const user = await UserCASL.findOne({
          where: {
            id: req.params.id,
          },
          attributes: ["id", "username", "email", "role"],
        });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).send("User doesn't exist");
        }
      } else {
        res.send(`Cannot execute "read" on "UserCASL"`);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = UserController;
