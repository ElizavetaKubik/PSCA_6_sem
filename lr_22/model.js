const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Users extends Model {}
class BlackList extends Model {}

let ModelSetUp = (sequelize) => {
  Users.init(
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      login: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      Users: "Users",
      tableName: "Users",
      timestamps: false,
    }
  );

  BlackList.init(
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      value: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      BlackList: "BlackList",
      tableName: "BlackList",
      timestamps: false,
    }
  );

  return { Users, BlackList };
};

module.exports.Model = (sequelize) => ModelSetUp(sequelize);
